import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config("aws");
const awsRegion = config.require("region");
export const gitLayerArn = pulumi.output(
    `arn:aws:lambda:${awsRegion}:553035198032:layer:git-lambda2:8`,
);
export const bunBuildArgs = pulumi.output({ tag: "bun-v1.1.20", arch: "x64" });
