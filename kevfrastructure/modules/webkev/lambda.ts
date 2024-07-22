import * as archive from "@pulumi/archive";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as std from "@pulumi/std";
import { existsSync } from "fs";
import { resolve } from "path";

import { exec } from "../../helpers";
import { bunLambdaLayer } from "./bunLayer";
import { compileDeployWebkevLambdaRole } from "./iam";
import { webkevBucket } from "./s3";
import {
    kavpiId,
    kavpiLambdasHttpMethod,
    kavpiLambdasResourceId,
    kavpiLambdasResourceSourceArn,
} from "../api";

const lambdaDir = resolve(__dirname, "../../lambdevins/compile-deploy-webkev");
const version = pulumi.output(exec("git rev-parse HEAD", lambdaDir));
const archivePath = resolve(
    __dirname,
    `../../artifacts/compile-deploy-webdev-${version}.zip`,
);
const compileDeployWebkev = () => {
    const handlerPath = lambdaDir.concat(`/dist/handler.js`);

    pulumi.log.info(
        `lambdevin:compileDeployWebkev: zipping compile-deploy-webkev`,
    );

    exec(`bun run build`, lambdaDir);

    const lambda = archive.getFile({
        type: "zip",
        sourceFile: handlerPath,
        outputPath: archivePath,
    });
    return lambda;
};

let sourceCodeHashPromise: Promise<string>;
let pulumiArchive = new pulumi.asset.FileArchive(archivePath);
if (!existsSync(archivePath)) {
    sourceCodeHashPromise = compileDeployWebkev().then(
        (zip) => zip.outputBase64sha256,
    );
} else {
    sourceCodeHashPromise = std
        .filebase64sha256({ input: archivePath })
        .then((sha) => sha.result);
}
const webkevConfig = new pulumi.Config("webkev");
const compileDeployWebkevLambdaToken = webkevConfig.require(
    "compile-deploy-webkev-lambda-github-token",
);

export const compileDeployWebkevLambda = new aws.lambda.Function(
    "compile-deploy-webkev",
    {
        code: pulumiArchive,
        timeout: 60,
        memorySize: 256,
        handler: "handler.fetch",
        role: compileDeployWebkevLambdaRole.arn,
        architectures: ["arm64"],
        layers: [bunLambdaLayer.arn],
        runtime: aws.lambda.Runtime.CustomAL2,
        sourceCodeHash: sourceCodeHashPromise,
        environment: {
            variables: {
                GITHUB_ACCESS_TOKEN: compileDeployWebkevLambdaToken,
                WEBKEV_BUCKET_NAME: webkevBucket.id,
            },
        },
    },
);
const apigwLambda = new aws.lambda.Permission("apigw_lambda", {
    statementId: "AllowExecutionFromAPIGateway",
    action: "lambda:InvokeFunction",
    function: compileDeployWebkevLambda.name,
    principal: "apigateway.amazonaws.com",
    sourceArn: kavpiLambdasResourceSourceArn,
});

export const compileDeployWebkevLambdasIntegration =
    new aws.apigateway.Integration(
        "compile-deploy-webkev-trigger",
        {
            restApi: kavpiId,
            resourceId: kavpiLambdasResourceId,
            httpMethod: kavpiLambdasHttpMethod,
            integrationHttpMethod: "POST",
            type: "AWS_PROXY",
            uri: compileDeployWebkevLambda.invokeArn,
        },
        { dependsOn: [compileDeployWebkevLambda] },
    );
