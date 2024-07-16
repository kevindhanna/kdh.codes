import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const webkevLogsBucket = new aws.s3.Bucket("kdh-codes-webkev-logs", {
    bucketPrefix: "kdh-codes-webkev-logs-",
    forceDestroy: true,
});
const webkevBucket = new aws.s3.Bucket("kdh-codes-webkev", {
    bucketPrefix: "kdh-codes-webkev-",
    loggings: [
        {
            targetBucket: webkevLogsBucket.id,
            targetPrefix: "s3",
        },
    ],
});

const webkevLogsBucketOwnershipControl = new aws.s3.BucketOwnershipControls(
    "webkev-logs-bucket-ownership-controls",
    {
        bucket: webkevLogsBucket.id,
        rule: {
            objectOwnership: "BucketOwnerPreferred",
        },
    },
);
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
const webkevCFDistributionOriginId = "webkevBucketOrigin";
const webkevCFDistribution = new aws.cloudfront.Distribution(
    "webkev-cloudfront-distribution",
    {
        origins: [
            {
                originId: webkevCFDistributionOriginId,
                domainName: webkevBucket.bucketRegionalDomainName,
                s3OriginConfig: {
                    originAccessIdentity: "",
                },
                originAccessControlId: webkevCFOriginAccessControl.id,
            },
        ],
        enabled: true,
        defaultRootObject: "index.html",
        defaultCacheBehavior: {
            allowedMethods: ["GET", "HEAD", "OPTIONS"],
            cachedMethods: ["GET", "HEAD"],
            targetOriginId: webkevCFDistributionOriginId,
            cachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6", // CachingOptimized
            originRequestPolicyId: "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf", // CORS-S3Origin
            responseHeadersPolicyId: "67f7725c-6f97-4210-82d7-5512b31e9d03", // SecurityHeadersPolicy
            viewerProtocolPolicy: "redirect-to-https",
        },
        priceClass: "PriceClass_100",
        loggingConfig: {
            bucket: webkevLogsBucket.bucketRegionalDomainName,
            prefix: "cloudfront",
        },
        viewerCertificate: {
            cloudfrontDefaultCertificate: true,
        },
        restrictions: {
            geoRestriction: {
                restrictionType: "none",
            },
        },
    },
);

const allowAccessFromCloudFront = aws.iam.getPolicyDocumentOutput({
    statements: [
        {
            sid: "AllowCloudFrontAccess",
            effect: "Allow",
            resources: [webkevBucket.arn],
            principals: [
                { type: "Service", identifiers: ["cloudfront.amazonaws.com"] },
            ],
            conditions: [
                {
                    test: "StringEquals",
                    values: [webkevCFDistribution.arn],
                    variable: "AWS:SourceArn",
                },
            ],
        },
    ],
});

const webkevBucketPolicy = new aws.s3.BucketPolicy("webkev-bucket-policy", {
    bucket: webkevBucket.id,
    policy: allowAccessFromCloudFront.apply((policy) => policy.json),
});
