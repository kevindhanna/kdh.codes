import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import { compileDeployWebkevLambda } from "../webkev";

export const kavpi = new aws.apigateway.RestApi("api", { name: "Kavpi" });

export const compileDeployWebkevResource = new aws.apigateway.Resource(
    "compile-deploy-webkev-resource",
    {
        pathPart: "compile-deploy-webkev",
        parentId: kavpi.rootResourceId,
        restApi: kavpi.id,
    },
);

export const compileDeployWebkevMethod = new aws.apigateway.Method(
    "lambdas-method",
    {
        restApi: kavpi.id,
        resourceId: compileDeployWebkevResource.id,
        httpMethod: "POST",
        authorization: "NONE",
    },
);

const kavpiProdStageName = "prod";
const kavpiLogGroup = new aws.cloudwatch.LogGroup("kavpi-prod-log-group", {
    name: pulumi.interpolate`API-Gateway-Execution-Logs_${kavpi.id}/${kavpiProdStageName}`,
    retentionInDays: 7,
});

const kavpiDeployment = new aws.apigateway.Deployment("kavpi-prod-deployment", {
    restApi: kavpi.id,
    stageName: kavpiProdStageName,
});

export const kavpiProdStage = new aws.apigateway.Stage(
    "kavapi-prod",
    {
        stageName: kavpiProdStageName,
        deployment: kavpiDeployment.id,
        restApi: kavpi.id,
    },
    {
        dependsOn: [kavpiLogGroup],
    },
);
