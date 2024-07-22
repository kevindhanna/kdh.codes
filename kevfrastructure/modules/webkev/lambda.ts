import * as archive from "@pulumi/archive";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import { resolve } from "path";
import { exec } from "../../helpers";
import { bunLambdaLayer } from "./bunLayer";
import { compileDeployWebkevLambdaRole } from "./iam";
import { webkevBucket } from "./s3";

const lambdaDir = resolve(__dirname, "../../lambdevins/compile-deploy-webkev");
const version = pulumi.output(exec("git rev-parse HEAD", lambdaDir));

const compileDeployWebkev = version.apply((version) => {
    const handlerPath = lambdaDir.concat(`/dist/handler.js`);
    const resultPath = resolve(
        __dirname,
        "../../artifacts/compile-deploy-webdev.zip",
    );

    pulumi.log.info(
        `lambdevin:compileDeployWebkev: zipping compile-deploy-webkev`,
    );

    exec(`bun run build`, lambdaDir);

    const lambda = archive.getFile({
        type: "zip",
        sourceFile: handlerPath,
        outputPath: resultPath,
    });
    return {
        version,
        lambda,
        archive: new pulumi.asset.FileArchive(resultPath),
    };
});

const config = new pulumi.Config("github");
const compileDeployWebkevLambdaToken = config.require(
    "compile-deploy-webkev-lambda-token",
);

export const compileDeployWebkevLambda = new aws.lambda.Function(
    "compile-deploy-webkev",
    {
        code: compileDeployWebkev.archive,
        timeout: 60,
        memorySize: 256,
        handler: "handler.fetch",
        role: compileDeployWebkevLambdaRole.arn,
        architectures: ["arm64"],
        layers: [bunLambdaLayer.arn],
        runtime: aws.lambda.Runtime.CustomAL2,
        sourceCodeHash: compileDeployWebkev.lambda.outputBase64sha256,
        environment: {
            variables: {
                GITHUB_ACCESS_TOKEN: compileDeployWebkevLambdaToken,
                WEBKEV_BUCKET_NAME: webkevBucket.id,
            },
        },
    },
);
