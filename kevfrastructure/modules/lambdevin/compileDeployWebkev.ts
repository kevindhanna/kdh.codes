import * as pulumi from "@pulumi/pulumi";
import * as archive from "@pulumi/archive";
import { resolve } from "path";
import { exec } from "../../helpers";

const lambdaDir = resolve(__dirname, "../../lambdevins/compile-deploy-webkev");
const version = pulumi.output(exec("git rev-parse HEAD", lambdaDir));

const result = version.apply((version) => {
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
export default {
    version: result.version,
    lambda: result.lambda,
    archive: result.archive,
};
