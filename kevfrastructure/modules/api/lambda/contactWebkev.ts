import * as archive from "@pulumi/archive";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { resolve } from "path";
import { existsSync } from "fs";

import { exec } from "../../../helpers";
import { bunLambdaLayer } from "./bunLayer";
import { contactWebkevMessageTopic } from "../sns";
import { contactWebkevLambdaRole } from "../iam";

const lambdaDir = resolve(__dirname, "../../../lambdevins/contact-webkev");

const version = exec('git log -1 --pretty="format:%H" .', lambdaDir);

const archivePath = resolve(
    __dirname,
    `../../../artifacts/contact-webkev-${version}.zip`,
);
const handlerPath = lambdaDir.concat(`/dist/handler.js`);
if (!existsSync(archivePath)) {
    pulumi.log.info(`lambdevin:contactWebkev: zipping`);

    exec(`bun run build`, lambdaDir);
}
const zip = archive.getFile({
    type: "zip",
    sourceFile: handlerPath,
    outputPath: archivePath,
});
const pulumiArchive = new pulumi.asset.FileArchive(archivePath);

export const contactWebkevLambda = new aws.lambda.Function(
    "contact-webkev-lambda",
    {
        code: pulumiArchive,
        timeout: 120,
        memorySize: 512,
        handler: "handler.fetch",
        role: contactWebkevLambdaRole.arn,
        architectures: ["arm64"],
        layers: [bunLambdaLayer.arn],
        runtime: aws.lambda.Runtime.CustomAL2,
        sourceCodeHash: zip.then((zip) => zip.outputBase64sha256),
        environment: {
            variables: {
                SNS_TOPIC_ARN: contactWebkevMessageTopic.arn,
            },
        },
    },
);
