import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import { webkevCFDistribution } from "./cloudfront";
import { webkevBucket } from "./s3";

export const compileDeployWebkevLambdaRole = new aws.iam.Role(
    "compile-deploy-webkev-lambda-role",
    {
        assumeRolePolicy: {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "sts:AssumeRole",
                    Effect: "Allow",
                    Principal: {
                        Service: "lambda.amazonaws.com",
                    },
                },
            ],
        },
    },
);

const lambdaLogging = aws.iam.getPolicyDocument({
    statements: [
        {
            effect: "Allow",
            actions: [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
            ],
            resources: ["arn:aws:logs:*:*:*"],
        },
    ],
});

export const lambdaLoggingPolicy = new aws.iam.Policy("lambda_logging", {
    name: "lambda_logging",
    path: "/",
    description: "IAM policy for logging from a lambda",
    policy: lambdaLogging.then((lambdaLogging) => lambdaLogging.json),
});
export const allowWebkevBucketAccess = aws.iam.getPolicyDocumentOutput({
    statements: [
        {
            sid: "AllowCloudFrontAccess",
            effect: "Allow",
            resources: [pulumi.concat(webkevBucket.arn, "/*")],
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
            actions: ["s3:GetObject*"],
        },
        {
            sid: "AllowLambdaWriteAccess",
            effect: "Allow",
            resources: [
                webkevBucket.arn,
                pulumi.concat(webkevBucket.arn, "/*"),
            ],
            principals: [
                {
                    type: "AWS",
                    identifiers: [compileDeployWebkevLambdaRole.arn],
                },
            ],
            actions: ["s3:PutObject"],
        },
    ],
});

const webkevBucketPolicy = new aws.s3.BucketPolicy("webkev-bucket-policy", {
    bucket: webkevBucket.id,
    policy: allowWebkevBucketAccess.apply((policy) => policy.json),
});
