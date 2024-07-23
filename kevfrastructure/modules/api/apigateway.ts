import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { cloudwatchRole } from "./iam";
import { compileDeployWebkevLambda } from "./lambda";
import { compileDeployWebkevLogGroup } from "./cloudwatch";

export const kavpi = new aws.apigatewayv2.Api("kavpi", {
    name: "Kavpi",
    protocolType: "HTTP",
    corsConfiguration: {
        allowOrigins: ["*"],
        allowMethods: ["OPTIONS", "POST"],
    },
    target: compileDeployWebkevLambda.arn,
});

export const compileDeployWebkevIntegration = new aws.apigatewayv2.Integration(
    "compile-deploy-webkev-kavpi-integration",
    {
        apiId: kavpi.id,
        integrationType: "AWS_PROXY",
        integrationMethod: "POST",
        integrationUri: compileDeployWebkevLambda.invokeArn,
        passthroughBehavior: "WHEN_NO_MATCH",
        payloadFormatVersion: "2.0",
    },
);
export const compileDeployWebkevRoute = new aws.apigatewayv2.Route(
    "compile-deploy-webkev-kavpi-route",
    {
        apiId: kavpi.id,
        routeKey: "POST /compile-deploy-webkev",
        target: pulumi.interpolate`integrations/${compileDeployWebkevIntegration.id}`,
    },
);

export const kavpiProdStage = new aws.apigatewayv2.Stage("kavpie-prod-stage", {
    accessLogSettings: {
        destinationArn: compileDeployWebkevLogGroup.arn,
        format: '{ "requestId":"$context.requestId", "extendedRequestId":"$context.extendedRequestId","ip": "$context.identity.sourceIp", "caller":"$context.identity.caller", "user":"$context.identity.user", "requestTime":"$context.requestTime", "httpMethod":"$context.httpMethod", "resourcePath":"$context.resourcePath", "status":"$context.status", "protocol":"$context.protocol", "responseLength":"$context.responseLength" }',
    },
    apiId: kavpi.id,
    autoDeploy: true,
    name: "prod",
});

const apigwLambda = new aws.lambda.Permission("apigw_lambda", {
    statementId: "AllowExecutionFromAPIGateway",
    action: "lambda:InvokeFunction",
    function: compileDeployWebkevLambda,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${kavpi.executionArn}/*/*`,
    // sourceArn: pulumi.interpolate`arn:aws:execute-api:${region}:${awsAccountId}:${kavpi.id}/*/${compileDeployWebkevMethod.httpMethod}/${compileDeployWebkevResource.path}`,
});

// export const compileDeployWebkevResource = new aws.apigateway.Resource(
//     "compile-deploy-webkev-resource",
//     {
//         pathPart: "compile-deploy-webkev",
//         parentId: kavpi.rootResourceId,
//         restApi: kavpi.id,
//     },
// );

// export const compileDeployWebkevMethod = new aws.apigateway.Method(
//     "compile-deploy-webkev-method",
//     {
//         restApi: kavpi.id,
//         resourceId: compileDeployWebkevResource.id,
//         httpMethod: "POST",
//         authorization: "NONE",
//     },
// );

// const kavpiProdStageName = "prod";
// const kavpiLogGroup = new aws.cloudwatch.LogGroup("kavpi-prod-log-group", {
//     name: pulumi.interpolate`API-Gateway-Execution-Logs_${kavpi.id}/${kavpiProdStageName}`,
//     retentionInDays: 7,
// });
// const kavpiAccount = new aws.apigateway.Account("kavpi-account", {
//     cloudwatchRoleArn: cloudwatchRole.arn,
// });

// const kavpiDeployment = new aws.apigateway.Deployment(
//     "kavpi-prod-deployment",
//     {
//         restApi: kavpi.id,
//     },
//     { dependsOn: [compileDeployWebkevMethod, compileDeployWebkevResource] },
// );

// export const kavpiProdStage = new aws.apigateway.Stage(
//     "kavpi-prod",
//     {
//         stageName: kavpiProdStageName,
//         deployment: kavpiDeployment.id,
//         restApi: kavpi.id,
//         accessLogSettings: {
//             destinationArn: kavpiLogGroup.arn,
//             format: '$context.identity.sourceIp $context.identity.caller $context.identity.user [$context.requestTime]"$context.httpMethod $context.resourcePath $context.protocol" $context.status $context.responseLength $context.requestId $context.extendedRequestId',
//         },
//     },
//     {
//         dependsOn: [kavpiLogGroup, kavpiAccount],
//     },
// );
