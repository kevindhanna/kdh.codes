import * as github from "@pulumi/github";
import * as aws from "@pulumi/aws";
import * as cloudflare from "@pulumi/cloudflare";

export const kdhCodesRepo = github.getRepository({
    fullName: "kevindhanna/kdh.codes",
});
const current = aws.getCallerIdentity({});
export const awsAccountId = current.then((current) => current.accountId);

export const kdhCodesDnsZone = cloudflare.getZone({
    name: "kdh.codes",
});
