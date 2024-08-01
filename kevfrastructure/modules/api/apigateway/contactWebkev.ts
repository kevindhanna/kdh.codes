import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

import { kavpi } from "./api";
import { contactWebkevLambda } from "../lambda";

const contactWebkevIntegration = new aws.apigatewayv2.Integration(
    "contact-webkev-kavpi-integration",
    {
        apiId: kavpi.id,
        integrationType: "AWS_PROXY",
        integrationMethod: "POST",
        integrationUri: contactWebkevLambda.invokeArn,
        passthroughBehavior: "WHEN_NO_MATCH",
        payloadFormatVersion: "2.0",
    },
);
export const contactWebkevRoute = new aws.apigatewayv2.Route(
    "contact-webkev-kavpi-route",
    {
        apiId: kavpi.id,
        routeKey: "POST /contact-webkev",
        target: pulumi.interpolate`integrations/${contactWebkevIntegration.id}`,
    },
);
const contactWebkevApiGatewayLambdaPermission = new aws.lambda.Permission(
    "contact-webkev-api-gateway-lambda-permission",
    {
        statementId: "AllowContactWebkevExecutionFromAPIGateway",
        action: "lambda:InvokeFunction",
        function: contactWebkevLambda,
        principal: "apigateway.amazonaws.com",
        sourceArn: pulumi.interpolate`${kavpi.executionArn}/*/*`,
    },
);
