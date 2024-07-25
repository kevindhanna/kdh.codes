import * as aws from "@pulumi/aws";

import { webkevBucket, webkevLogsBucket } from "./s3";
import { kdhCodesCertificate } from "./acm";
import { kdhCodesDnsZone } from "../core";

const webkevCFOriginAccessControl = new aws.cloudfront.OriginAccessControl(
    "webkev-cloudfront-origin-access-control",
    {
        name: "webkev-cloudfront-origin-access-control",
        description: "Default Origin Access Control",
        signingBehavior: "always",
        signingProtocol: "sigv4",
        originAccessControlOriginType: "s3",
    },
);

export const webkevCFDistribution = new aws.cloudfront.Distribution(
    "webkev-cloudfront-distribution",
    {
        origins: [
            {
                originId: webkevBucket.arn,
                domainName: webkevBucket.bucketRegionalDomainName,
                originAccessControlId: webkevCFOriginAccessControl.id,
            },
        ],
        aliases: [kdhCodesDnsZone.then((zone) => zone.name)],
        enabled: true,
        defaultRootObject: "index.html",
        defaultCacheBehavior: {
            allowedMethods: ["GET", "HEAD", "OPTIONS"],
            cachedMethods: ["GET", "HEAD"],
            targetOriginId: webkevBucket.arn,
            cachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6", // CachingOptimized
            originRequestPolicyId: "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf", // CORS-S3Origin
            responseHeadersPolicyId: "67f7725c-6f97-4210-82d7-5512b31e9d03", // SecurityHeadersPolicy
            viewerProtocolPolicy: "redirect-to-https",
        },
        priceClass: "PriceClass_100",
        customErrorResponses: [
            {
                errorCode: 404,
                responseCode: 404,
                responsePagePath: "/404/index.html",
            },
        ],
        loggingConfig: {
            bucket: webkevLogsBucket.bucketRegionalDomainName,
            includeCookies: false,
            prefix: "cloudfront/",
        },
        viewerCertificate: {
            acmCertificateArn: kdhCodesCertificate.arn,
            sslSupportMethod: "sni-only",
        },
        restrictions: {
            geoRestriction: {
                restrictionType: "none",
            },
        },
    },
);
