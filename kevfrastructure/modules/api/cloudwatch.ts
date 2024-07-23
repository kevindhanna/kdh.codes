import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { compileDeployWebkevLambda } from "./lambda";

export const compileDeployWebkevLogGroup = new aws.cloudwatch.LogGroup(
    "compile-deploy-webkev-log-group",
    {
        name: pulumi.concat("/aws/lambda/", compileDeployWebkevLambda.name),
        retentionInDays: 7,
    },
);
