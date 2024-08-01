import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

import { kavpi } from "./api";
import { compileDeployWebkevLambda } from "../lambda";

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
const compileDeployWebkevApiGatewayLambdaPermission = new aws.lambda.Permission(
    "compile-deploy-webkev-api-gateway-lambda-permission",
    {
        statementId: "AllowCompileDeployWebkevExecutionFromAPIGateway",
        action: "lambda:InvokeFunction",
        function: compileDeployWebkevLambda,
        principal: "apigateway.amazonaws.com",
        sourceArn: pulumi.interpolate`${kavpi.executionArn}/*/*`,
    },
);
