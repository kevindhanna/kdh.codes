import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const config = new pulumi.Config("github");
export const compileDeployWebkevLambdaToken = config.require(
    "compile-deploy-webkev-lambda-token",
);
