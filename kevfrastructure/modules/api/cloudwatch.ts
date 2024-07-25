import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { compileDeployWebkevLambda } from "./lambda";
import { kavpiName } from "./apigateway";

export const compileDeployWebkevLogGroup = new aws.cloudwatch.LogGroup(
    "compile-deploy-webkev-log-group",
    {
        name: pulumi.concat("/aws/lambda/", compileDeployWebkevLambda.name),
        retentionInDays: 7,
    },
);

export const kavpiLogGroup = new aws.cloudwatch.LogGroup("kavpi-log-group", {
    name: pulumi.concat("/aws/apigateway/", kavpiName),
    retentionInDays: 7,
});
