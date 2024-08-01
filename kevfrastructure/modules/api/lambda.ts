import * as archive from "@pulumi/archive";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as std from "@pulumi/std";
import { resolve } from "path";
import { existsSync } from "fs";

import { exec } from "../../helpers";
import {
    compileDeployWebkevLambdaRoleArn,
    webkevBucketId,
    webkevCFDistributionId,
} from "../webkev";
import { bunLambdaLayer } from "./bunLayer";
import { githubWebhookSecret } from "./secrets";

const lambdaDir = resolve(__dirname, "../../lambdevins/compile-deploy-webkev");

const version = exec('git log -1 --pretty="format:%H" .', lambdaDir);

const archivePath = resolve(
    __dirname,
    `../../artifacts/compile-deploy-webdev-${version}.zip`,
);
const handlerPath = lambdaDir.concat(`/dist/handler.js`);
if (!existsSync(archivePath)) {
    pulumi.log.info(
        `lambdevin:compileDeployWebkev: zipping compile-deploy-webkev`,
    );

    exec(`bun run build`, lambdaDir);
}
const zip = archive.getFile({
    type: "zip",
    sourceFile: handlerPath,
    outputPath: archivePath,
});
const pulumiArchive = new pulumi.asset.FileArchive(archivePath);
const webkevConfig = new pulumi.Config("webkev");
const compileDeployWebkevLambdaToken = webkevConfig.requireSecret(
    "compile-deploy-webkev-lambda-github-token",
);

export const compileDeployWebkevLambda = new aws.lambda.Function(
    "compile-deploy-webkev",
    {
        // code: codeArchive.archive,
        code: pulumiArchive,
        timeout: 120,
        memorySize: 512,
        handler: "handler.fetch",
        role: compileDeployWebkevLambdaRoleArn,
        architectures: ["arm64"],
        layers: [bunLambdaLayer.arn],
        runtime: aws.lambda.Runtime.CustomAL2,
        sourceCodeHash: zip.then((zip) => zip.outputBase64sha256),
        // sourceCodeHash: codeArchive.sourceCodeHash,
        environment: {
            variables: {
                GITHUB_ACCESS_TOKEN: compileDeployWebkevLambdaToken,
                GITHUB_WEBHOOK_SECRET: githubWebhookSecret.result,
                WEBKEV_BUCKET_NAME: webkevBucketId,
                CLOUDFRONT_DISTRIBUTION_ID: webkevCFDistributionId,
            },
        },
    },
);
