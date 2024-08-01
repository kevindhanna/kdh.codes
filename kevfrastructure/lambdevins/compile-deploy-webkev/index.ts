import { $, Glob, type ShellOutput } from "bun";
import { mkdirSync, existsSync, readdirSync } from "fs";
import * as tar from "tar";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
    CloudFrontClient,
    CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import { request as octokitRequest } from "@octokit/request";
import { resolve } from "path";
import { v6 as uuid } from "uuid";
import { validateRequest } from "./src/validators/validateRequest";

const logResult = ({ stdout, stderr }: ShellOutput) => {
    console.log(stdout.toString());
    console.error(stderr.toString());
};

export const tarFile = "/tmp/kdh.codes.tar";
export const outputDir = "/tmp/kdh.codes";
const repoFolderRegexp = /kevindhanna-kdh\.codes-.+/;
const requiredEnv = [
    "GITHUB_ACCESS_TOKEN",
    "GITHUB_WEBHOOK_SECRET",
    "WEBKEV_BUCKET_NAME",
    "CLOUDFRONT_DISTRIBUTION_ID",
];
export default {
    async fetch(request: Request): Promise<Response> {
        for (const key of requiredEnv) {
            if (process.env[key] === undefined) {
                console.error(`Missing required environment variable ${key}`);
                return new Response("OK!", {
                    status: 200,
                    headers: {
                        "Content-Type": "text/plain",
                    },
                });
            }
        }

        const [body, invalidResponse] = await validateRequest(request);
        if (invalidResponse) {
            return invalidResponse;
        }

        console.log("Processing webhook", { request: body });

        console.log("Getting repo");
        const response = await octokitRequest(
            "GET /repos/kevindhanna/kdh.codes/tarball/main",
            {
                owner: "kevindhanna",
                repo: "kdh.codes",
                ref: "main",
                headers: {
                    "X-GitHub-Api-Version": "2022-11-28",
                    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
                },
            },
        );

        const file = Bun.file(tarFile);
        const writer = file.writer();
        writer.write(response.data);

        if (!existsSync(outputDir)) {
            mkdirSync(outputDir);
        }

        console.log("Extracting tar");
        await tar.x({ f: tarFile, C: outputDir });

        const parent = readdirSync(outputDir).find((f) =>
            repoFolderRegexp.test(f),
        );

        if (!parent) {
            console.error(`No folders found in ${outputDir}`);
            return new Response("OK!", {
                status: 200,
                headers: {
                    "Content-Type": "text/plain",
                },
            });
        }

        const webkevDir = resolve(outputDir, parent, "webkev");

        console.log("Bun Install");
        logResult(await $`bun install`.cwd(webkevDir));
        const strictEnv = Object.entries(process.env)
            .filter<[string, string]>(([, val]) => val !== undefined)
            .reduce<Record<string, string>>((result, [key, val]) => {
                result[key] = val;
                return result;
            }, {});
        console.log("Bun Build");
        logResult(await $`bun run build`.cwd(webkevDir).env(strictEnv));

        const s3Client = new S3Client({});
        const distGlob = new Glob(webkevDir.concat("/dist/**/*"));
        for await (const filename of distGlob.scan(".")) {
            // remove /tmp/kdh.codes/kevindhanna-kdh.codes-<commit>/webkev/dist
            const key = filename.split("/").slice(6).join("/");
            const file = Bun.file(filename);
            file.type;
            const fileContents = await file.arrayBuffer();
            console.log("Uploading file", { filename: `${key}/${file}` });
            await s3Client.send(
                new PutObjectCommand({
                    Bucket: process.env.WEBKEV_BUCKET_NAME,
                    Key: key,
                    Body: new Uint8Array(fileContents),
                    ContentType: file.type,
                }),
            );
        }

        console.log("Invalidating cache");
        const cloudfrontClient = new CloudFrontClient({});
        const command = new CreateInvalidationCommand({
            DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
            InvalidationBatch: {
                Paths: {
                    Quantity: 1,
                    Items: ["/*"],
                },
                CallerReference: uuid(), // required
            },
        });
        await cloudfrontClient.send(command);

        return new Response("OK!", {
            status: 200,
            headers: {
                "Content-Type": "text/plain",
            },
        });
    },
};
