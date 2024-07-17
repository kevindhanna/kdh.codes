import { resolve } from "path";
import { existsSync, rmdirSync } from "fs";
import * as pulumi from "@pulumi/pulumi";
import { bunBuildArgs } from "./variables";
import { exec } from "../../helpers";

const { version, arch, archive } = bunBuildArgs.apply(({ tag, arch }) => {
  const bunRepo = "https://github.com/oven-sh/bun";
  const artifactsPath = resolve(__dirname, "../../artifacts");
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
    exec(`bun run build-layer --arch x64 --output ${resultPath}`, layerPath);
  }
  return {
    version: tag,
    arch,
    archive: new pulumi.asset.FileArchive(resultPath),
  };
});

export default {
  version,
  arch,
  archive,
};
