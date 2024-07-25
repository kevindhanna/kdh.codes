import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { compileDeployWebkevLambda } from "./lambda";
import { kavpiLogGroup } from "./cloudwatch";

export const kavpiName = "Kavpi";
export const kavpi = new aws.apigatewayv2.Api("kavpi", {
    name: kavpiName,
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
        destinationArn: kavpiLogGroup.arn,
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
});
