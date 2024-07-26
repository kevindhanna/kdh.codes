import * as github from "@pulumi/github";
import * as aws from "@pulumi/aws";
import * as cloudflare from "@pulumi/cloudflare";
import * as pulumi from "@pulumi/pulumi";

export const kdhCodesRepo = github.getRepository({
    fullName: "kevindhanna/kdh.codes",
});
const current = aws.getCallerIdentity({});
export const awsAccountId = current.then((current) => current.accountId);

export const kdhCodesDnsZone = cloudflare.getZone({
    name: "kdh.codes",
});

const awsConfig = new pulumi.Config("aws");
const awsAccessKey = awsConfig.requireSecret("accessKey");
const awsSecretKey = awsConfig.requireSecret("secretKey");
export const usEast1Provider = new aws.Provider("aws-us-east-1-provider", {
    region: "us-east-1",
    accessKey: awsAccessKey,
    secretKey: awsSecretKey,
    allowedAccountIds: [awsAccountId],
});
