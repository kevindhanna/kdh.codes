import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import { kavpiLogGroup } from "../cloudwatch";
import { kavpiKdhCodesCertificate } from "../acm";
import { compileDeployWebkevRoute } from "./compileDeployWebkev";
import { contactWebkevRoute } from "./contactWebkev";
import { kavpi } from "./api";
export * from "./compileDeployWebkev";
export * from "./api";

export const kavpiProdStage = new aws.apigatewayv2.Stage("kavpi-prod-stage", {
    accessLogSettings: {
        destinationArn: kavpiLogGroup.arn,
        format: '{ "requestId":"$context.requestId", "extendedRequestId":"$context.extendedRequestId","ip": "$context.identity.sourceIp", "caller":"$context.identity.caller", "user":"$context.identity.user", "requestTime":"$context.requestTime", "httpMethod":"$context.httpMethod", "resourcePath":"$context.resourcePath", "status":"$context.status", "protocol":"$context.protocol", "responseLength":"$context.responseLength" }',
    },
    apiId: kavpi.id,
    autoDeploy: true,
    name: "prod",
    routeSettings: [
        {
            routeKey: compileDeployWebkevRoute.routeKey,
            throttlingBurstLimit: 1,
            throttlingRateLimit: 1,
        },
        {
            routeKey: contactWebkevRoute.routeKey,
            throttlingBurstLimit: 1,
            throttlingRateLimit: 1,
        },
    ],
});

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

export const contactWebkevApiEndpoint = pulumi.concat(
    kavpiProdStage.invokeUrl,
    contactWebkevRoute.routeKey.apply((key) => key.split(" "))[1],
);
