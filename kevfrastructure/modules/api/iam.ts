import * as aws from "@pulumi/aws";
import { compileDeployWebkevLambdaRole } from "../webkev/iam";

// const lambdaAssumeRole = aws.iam.getPolicyDocument({
//     statements: [
//         {
//             effect: "Allow",
//             principals: [
//                 {
//                     type: "Service",
//                     identifiers: ["lambda.amazonaws.com"],
//                 },
//             ],
//             actions: ["sts:AssumeRole"],
//         },
//     ],
// });
// export const lambdaRole = new aws.iam.Role("lambda-role", {
//     name: "lambda-role",
//     assumeRolePolicy: lambdaAssumeRole.then((policy) => policy.json),
// });
const lambdaRoleAttachment = new aws.iam.RolePolicyAttachment(
    "lambda-role-attachment",
    {
        role: compileDeployWebkevLambdaRole,
        policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
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
