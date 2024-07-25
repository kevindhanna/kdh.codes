import * as cloudflare from "@pulumi/cloudflare";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import { kdhCodesDnsZone, awsAccountId } from "../core";

const awsConfig = new pulumi.Config("aws");
const awsAccessKey = awsConfig.require("accessKey");
const awsSecretKey = awsConfig.require("secretKey");
const usEast1Provider = new aws.Provider("aws-us-east-1-provider", {
    region: "us-east-1",
    accessKey: awsAccessKey,
    secretKey: awsSecretKey,
    allowedAccountIds: [awsAccountId],
});
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
