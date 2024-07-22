import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

import {
    webkevBucketArn,
    webkevBucketName,
    webkevCFDistributionArn,
} from "./modules/webkev";
import {
    compileDeployWebkevCodeArchive,
    bunLambdaLayerArn,
    compileDeployWebkevSourceHash,
    compileDeployWebkevLambdaRoleName,
} from "./modules/lambdevin";
import { compileDeployWebkevLambdaToken } from "./modules/github";
import { compileDeployWebkevLambdaRoleArn } from "./modules/lambdevin";

const allowAccessFromCloudFront = aws.iam.getPolicyDocumentOutput({
    statements: [
        {
            sid: "AllowCloudFrontAccess",
            effect: "Allow",
            resources: [pulumi.concat(webkevBucketArn, "/*")],
            principals: [
                { type: "Service", identifiers: ["cloudfront.amazonaws.com"] },
            ],
            conditions: [
                {
                    test: "StringEquals",
                    values: [webkevCFDistributionArn],
                    variable: "AWS:SourceArn",
                },
            ],
            actions: ["s3:GetObject*"],
        },
        {
            sid: "AllowLambdaWriteAccess",
            effect: "Allow",
            resources: [webkevBucketArn, pulumi.concat(webkevBucketArn, "/*")],
            principals: [
                // { type: "Service", identifiers: ["lambda.amazonaws.com"] },
                {
                    type: "AWS",
                    identifiers: [compileDeployWebkevLambdaRoleArn],
                },
            ],
            // conditions: [
            //     {
            //         test: "StringEquals",
            //         values: [compileDeployWebkevLambdaRoleArn],
            //         variable: "AWS:SourceArn",
            //     },
            // ],
            actions: ["s3:PutObject"],
        },
    ],
});
const webkevBucketPolicy = new aws.s3.BucketPolicy("webkev-bucket-policy", {
    bucket: webkevBucketName,
    policy: allowAccessFromCloudFront.apply((policy) => policy.json),
});

const compileDeployWebkevLambda = new aws.lambda.Function(
    "compile-deploy-webkev",
    {
        code: compileDeployWebkevCodeArchive,
        timeout: 30,
        handler: "handler.fetch",
        role: compileDeployWebkevLambdaRoleArn,
        architectures: ["arm64"],
        layers: [bunLambdaLayerArn],
        runtime: aws.lambda.Runtime.CustomAL2,
        sourceCodeHash: compileDeployWebkevSourceHash,
        environment: {
            variables: {
                GITHUB_ACCESS_TOKEN: compileDeployWebkevLambdaToken,
                WEBKEV_BUCKET_NAME: webkevBucketName,
            },
        },
    },
);

const compileDeployWebkevLogGroup = new aws.cloudwatch.LogGroup(
    "compile-deploy-webkev-log-group",
    {
        name: pulumi.concat("/aws/lambda/", compileDeployWebkevLambda.name),
        retentionInDays: 7,
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
const lambdaLoggingPolicy = new aws.iam.Policy("lambda_logging", {
    name: "lambda_logging",
    path: "/",
    description: "IAM policy for logging from a lambda",
    policy: lambdaLogging.then((lambdaLogging) => lambdaLogging.json),
});
const lambdaLogs = new aws.iam.RolePolicyAttachment("lambda_logs", {
    role: compileDeployWebkevLambdaRoleName,
    policyArn: lambdaLoggingPolicy.arn,
});
