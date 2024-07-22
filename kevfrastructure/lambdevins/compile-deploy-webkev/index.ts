import { $, Glob, type ShellOutput } from "bun";
import { mkdirSync, existsSync, readdirSync } from "fs";
import * as tar from "tar";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { request } from "@octokit/request";
import { resolve } from "path";

const logResult = ({ stdout, stderr }: ShellOutput) => {
    console.log();
    console.log(stdout.toString());
    console.error(stderr.toString());
};

export const tarFile = "/tmp/kdh.codes.tar";
export const outputDir = "/tmp/kdh.codes";
const repoFolderRegexp = /kevindhanna-kdh\.codes-.+/;

export default {
    async fetch(trigger: Request): Promise<Response> {
        if (process.env.GITHUB_ACCESS_TOKEN === undefined) {
            console.error(
                "Missing required environment variable GITHUB_ACCESS_TOKEN",
            );
            return new Response("OK!", {
                status: 200,
                headers: {
                    "Content-Type": "text/plain",
                },
            });
        }
        if (process.env.WEBKEV_BUCKET_NAME === undefined) {
            console.error(
                "Missing required environment variable WEBKEV_BUCKET_NAME",
            );
            return new Response("OK!", {
                status: 200,
                headers: {
                    "Content-Type": "text/plain",
                },
            });
        }

        console.log("Getting repo");
        const response = await request(
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
            console.log("Uploading file", { filename });
            await s3Client.send(
                new PutObjectCommand({
                    Bucket: process.env.WEBKEV_BUCKET_NAME,
                    Key: key,
                    Body: new Uint8Array(fileContents),
                    ContentType: file.type,
                }),
            );
        }

        return new Response("OK!", {
            status: 200,
            headers: {
                "Content-Type": "text/plain",
            },
        });
    },
};
