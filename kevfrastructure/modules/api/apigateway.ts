import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { compileDeployWebkevLambda } from "./lambda";
import { kavpiLogGroup } from "./cloudwatch";
import { kavpiKdhCodesCertificate } from "./acm";

export const kavpi = new aws.apigatewayv2.Api("kavpi", {
    name: "kavpi",
    protocolType: "HTTP",
    corsConfiguration: {
        allowOrigins: ["*"],
        allowMethods: ["OPTIONS", "POST"],
    },
    disableExecuteApiEndpoint: true,
});

const compileDeployWebkevIntegration = new aws.apigatewayv2.Integration(
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

export const kavpiProdStage = new aws.apigatewayv2.Stage("kavpi-prod-stage", {
    accessLogSettings: {
        destinationArn: kavpiLogGroup.arn,
        format: '{ "requestId":"$context.requestId", "extendedRequestId":"$context.extendedRequestId","ip": "$context.identity.sourceIp", "caller":"$context.identity.caller", "user":"$context.identity.user", "requestTime":"$context.requestTime", "httpMethod":"$context.httpMethod", "resourcePath":"$context.resourcePath", "status":"$context.status", "protocol":"$context.protocol", "responseLength":"$context.responseLength" }',
    },
    apiId: kavpi.id,
    autoDeploy: true,
    name: "prod",
    defaultRouteSettings: {
        loggingLevel: "INFO",
        throttlingBurstLimit: 1,
        throttlingRateLimit: 1,
    },
});

export const compileDeployWebkevInvokeUrl = pulumi.concat(
    kavpiProdStage.invokeUrl,
    compileDeployWebkevRoute.routeKey.apply((key) => key.split(" "))[1],
);

const kavpiProdStageDomainName = new aws.apigatewayv2.DomainName(
    "kavpi-prod-domain-name",
    {
        domainName: kavpiKdhCodesCertificate.domainName,
        domainNameConfiguration: {
            certificateArn: kavpiKdhCodesCertificate.arn,
            endpointType: "REGIONAL",
            securityPolicy: "TLS_1_2",
        },
    },
);

const kavpiProdApiMapping = new aws.apigatewayv2.ApiMapping(
    "kavpi-prod-api-mapping",
    {
        apiId: kavpi.id,
        domainName: kavpiProdStageDomainName.id,
        stage: kavpiProdStage.id,
    },
);

const apigwLambda = new aws.lambda.Permission("apigw_lambda", {
    statementId: "AllowExecutionFromAPIGateway",
    action: "lambda:InvokeFunction",
    function: compileDeployWebkevLambda,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${kavpi.executionArn}/*/*`,
});
