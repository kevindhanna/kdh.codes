import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

import bunLayer from "./bunLayer";
import compileDeployWebkev from "./compileDeployWebkev";
import { gitLayerArn } from "./variables";
import { compileDeployWebkevLambdaToken } from "../github";
import { lambdaRole } from "./iam";

const bunLambdaLayer = new aws.lambda.LayerVersion("bun-lambda-layer", {
    layerName: pulumi.concat(
        bunLayer.version.apply((v) => v.replace(/\./g, "-")),
        "-",
        bunLayer.arch,
        "-",
        "lambda-layer",
    ),
    code: bunLayer.archive,
    compatibleArchitectures: ["arm64"],
});

export const compileDeployWebkevLambda = new aws.lambda.Function(
    "compile-deploy-webkev",
    {
        code: compileDeployWebkev.archive,
        handler: "handler.fetch",
        role: lambdaRole.arn,
        architectures: ["x86_64"],
        layers: [bunLambdaLayer.arn, gitLayerArn],
        runtime: aws.lambda.Runtime.CustomAL2,
        sourceCodeHash: compileDeployWebkev.lambda.outputBase64sha256,
        environment: {
            variables: {
                GITHUB_ACCESS_TOKEN: compileDeployWebkevLambdaToken,
            },
        },
    },
);
