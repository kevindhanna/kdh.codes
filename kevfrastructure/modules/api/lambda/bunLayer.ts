import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { existsSync, rmdirSync } from "fs";
import { resolve } from "path";

import { exec } from "../../../helpers";

export const bunBuildArgs = pulumi.output({
  tag: "bun-v1.1.20",
  arch: "aarch64",
});

const { version, arch, archive } = bunBuildArgs.apply(({ tag, arch }) => {
  const bunRepo = "https://github.com/oven-sh/bun";
  const artifactsPath = resolve(__dirname, "../../../artifacts");
  const bunRepoPath = artifactsPath.concat("/bun");
  const layerPath = bunRepoPath.concat("/packages/bun-lambda");
  const resultPath = artifactsPath.concat(`/${tag}-${arch}-lambda-layer.zip`);

  if (!existsSync(resultPath)) {
    pulumi.log.info(
      `lambdevin:bunLayer: Existing archive not found for tag ${tag}-${arch}`,
    );
    if (existsSync(bunRepoPath)) {
      pulumi.log.info(
        `lambdevin:bunLayer: Existing repo found at ${bunRepoPath}`,
      );
      const currentTag = exec("git describe --exact-match --tags", bunRepoPath);

      if (currentTag !== tag) {
        pulumi.log.info(
          `lambdevin:bunLayer: Existing repo incorrect tag: ${currentTag} vs ${tag}`,
        );
        rmdirSync(bunRepo);
        exec(`git clone --depth=1 --branch ${tag} ${bunRepo}`, artifactsPath);
      }
    } else {
      exec(`git clone --depth=1 --branch ${tag} ${bunRepo}`, artifactsPath);
    }

    exec(`bun install`, layerPath);
    exec(`bun run build-layer --output ${resultPath}`, layerPath);
  }
  return {
    version: tag,
    arch,
    archive: new pulumi.asset.FileArchive(resultPath),
  };
});

export const bunLambdaLayer = new aws.lambda.LayerVersion("bun-lambda-layer", {
  layerName: pulumi.concat(
    version.apply((v) => v.replace(/\./g, "-")),
    "-",
    arch,
    "-",
    "lambda-layer",
  ),
  code: archive,
  compatibleArchitectures: ["arm64"],
});
