import * as cloudflare from "@pulumi/cloudflare";
import * as aws from "@pulumi/aws";

import { kdhCodesDnsZone, usEast1Provider } from "../core";

export const kdhCodesCertificate = new aws.acm.Certificate(
    "kdh-codes-certificate",
    {
        domainName: kdhCodesDnsZone.then((zone) => zone.name),
        validationMethod: "DNS",
    },
    { provider: usEast1Provider },
);

const validationRecords: cloudflare.Record[] = [];
kdhCodesCertificate.domainValidationOptions.apply((domainValidationOptions) => {
    domainValidationOptions.forEach((dvo) => {
        validationRecords.push(
            new cloudflare.Record(
                `kdh-codes-validation-record-${dvo.resourceRecordName}`,
                {
                    allowOverwrite: true,
                    name: dvo.resourceRecordName,
                    value: dvo.resourceRecordValue,
                    ttl: 60,
                    type: dvo.resourceRecordType,
                    zoneId: kdhCodesDnsZone.then((zone) => zone.id),
                },
            ),
        );
    });
});

const kdhCodesCertificateValidation = new aws.acm.CertificateValidation(
    "kdh-codes-certificate-validation",
    {
        certificateArn: kdhCodesCertificate.arn,
        validationRecordFqdns: validationRecords.map((r) => r.hostname),
    },
    { provider: usEast1Provider },
);
