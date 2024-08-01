import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { compileDeployWebkevLambdaRole } from "../webkev/iam";
import { awsAccountId } from "../core";
import { webkevCFDistributionId } from "../webkev";
import { contactWebkevMeMessageTopic } from "./sns";

const lambdaRoleAttachment = new aws.iam.RolePolicyAttachment(
    "lambda-role-attachment",
    {
        role: compileDeployWebkevLambdaRole,
        policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
    },
);

const createCloudFrontInvalidation =
    pulumi.interpolate`arn:aws:cloudfront::${awsAccountId}:distribution/${webkevCFDistributionId}`.apply(
        (resourceArn) => {
            return aws.iam.getPolicyDocument({
                statements: [
                    {
                        effect: "Allow",
                        actions: ["cloudfront:CreateInvalidation"],
                        resources: [resourceArn],
                    },
                ],
            });
        },
    );
const lambdaCloudFrontRolePolicy = new aws.iam.RolePolicy(
    "lambda-cloudfront-role-policy",
    {
        role: compileDeployWebkevLambdaRole,
        policy: createCloudFrontInvalidation.json,
    },
);

const apiGatewayAssumeRole = aws.iam.getPolicyDocument({
    statements: [
        {
            effect: "Allow",
            principals: [
                {
                    type: "Service",
                    identifiers: ["apigateway.amazonaws.com"],
                },
                {
                    type: "Service",
                    identifiers: ["lambda.amazonaws.com"],
                },
            ],
            actions: ["sts:AssumeRole"],
        },
    ],
});
export const cloudwatchRole = new aws.iam.Role("cloudwatch", {
    name: "api_gateway_cloudwatch_global",
    assumeRolePolicy: apiGatewayAssumeRole.then((policy) => policy.json),
});

const cloudwatch = aws.iam.getPolicyDocument({
    statements: [
        {
            effect: "Allow",
            actions: [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:DescribeLogGroups",
                "logs:DescribeLogStreams",
                "logs:PutLogEvents",
                "logs:GetLogEvents",
                "logs:FilterLogEvents",
            ],
            resources: ["*"],
        },
    ],
});
const cloudwatchRolePolicy = new aws.iam.RolePolicy("cloudwatch", {
    name: "default",
    role: cloudwatchRole.id,
    policy: cloudwatch.then((cloudwatch) => cloudwatch.json),
});

const allowContactWebkevTopicPublishPolicy =
    contactWebkevMeMessageTopic.arn.apply((arn) =>
        aws.iam.getPolicyDocument({
            statements: [
                {
                    effect: "Allow",
                    actions: ["sns:Publish"],
                    resources: [arn],
                },
            ],
        }),
    );
export const contactWebkevLambdaRole = new aws.iam.Role(
    "contact-webkev-lambda-role",
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
        inlinePolicies: [
            {
                name: "allow-contact-webkev-topic-publish",
                policy: allowContactWebkevTopicPublishPolicy.apply(
                    (policy) => policy.json,
                ),
            },
        ],
    },
);
