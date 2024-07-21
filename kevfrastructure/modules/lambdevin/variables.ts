import * as pulumi from "@pulumi/pulumi";

export const bunBuildArgs = pulumi.output({
    tag: "bun-v1.1.20",
    arch: "aarch64",
});
