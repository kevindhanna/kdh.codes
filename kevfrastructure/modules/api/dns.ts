import * as cloudflare from "@pulumi/cloudflare";
import * as aws from "@pulumi/aws";

import { kdhCodesDnsZone } from "../core";
import { kavpiProdStage } from "./apigateway";

const kavpiKdhCodesCNameRecord = new cloudflare.Record(
    "kavpi-kdh-codes-cname-record",
    {
        zoneId: kdhCodesDnsZone.then((zone) => zone.id),
        value: kavpiProdStage.invokeUrl,
        name: "kavpi",
        type: "CNAME",
        proxied: false,
    },
);

const kavpiKdhCodesCertificate = new aws.acm.Certificate(
    "kavpi-kdh-codes-certificate",
    {
        domainName: kavpiKdhCodesCNameRecord.hostname,
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

const kavpiKdhCodesCertificateValidation = new aws.acm.CertificateValidation(
    "kavpi-kdh-codes-certificate-validation",
    {
        certificateArn: kavpiKdhCodesCertificate.arn,
        validationRecordFqdns: validationRecords.map((r) => r.hostname),
    },
);
