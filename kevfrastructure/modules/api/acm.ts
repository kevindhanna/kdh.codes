import * as cloudflare from "@pulumi/cloudflare";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import { kdhCodesDnsZone } from "../core";

export const kavpiKdhCodesCertificate = new aws.acm.Certificate(
    "kavpi-kdh-codes-certificate",
    {
        domainName: pulumi.interpolate`kavpi.${kdhCodesDnsZone.then((zone) => zone.name)}`,
        validationMethod: "DNS",
    },
);

const validationRecords: cloudflare.Record[] = [];
kavpiKdhCodesCertificate.domainValidationOptions.apply(
    (domainValidationOptions) => {
        domainValidationOptions.forEach((dvo) => {
            validationRecords.push(
                new cloudflare.Record(
                    `kavpi-kdh-codes-validation-record-${dvo.resourceRecordName}`,
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
    },
);

const kavpikdhCodesCertificateValidation = new aws.acm.CertificateValidation(
    "kavpikdh-codes-certificate-validation",
    {
        certificateArn: kavpiKdhCodesCertificate.arn,
        validationRecordFqdns: validationRecords.map((r) => r.hostname),
    },
);
