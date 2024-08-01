import * as aws from "@pulumi/aws";

export const kavpi = new aws.apigatewayv2.Api("kavpi", {
    name: "kavpi",
    protocolType: "HTTP",
    corsConfiguration: {
        allowOrigins: ["*"],
        allowMethods: ["OPTIONS", "POST"],
    },
    // TODO: Why doesn't the custom domain cert work?
    // disableExecuteApiEndpoint: true,
});
