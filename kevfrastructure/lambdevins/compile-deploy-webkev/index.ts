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
        const file = Bun.file("/tmp/kdh.codes.tar");
        const writer = file.writer();
        writer.write(response.data);

        if (!existsSync("/tmp/kdh.codes")) {
            mkdirSync("/tmp/kdh.codes");
        }

        await tar.x({ f: "/tmp/kdh.codes.tar", C: "/tmp/kdh.codes" });

        const parent = readdirSync("/tmp/kdh.codes").find((f) =>
            /kevindhanna-kdh\.codes-.+/.test(f),
        );

        if (!parent) {
            console.error("No folders found in /tmp/kdh.codes");
            return new Response("OK!", {
                status: 200,
                headers: {
                    "Content-Type": "text/plain",
                },
            });
        }

        const webkevDir = resolve("/tmp/kdh.codes", parent, "webkev");
        console.log(webkevDir);
        logResult(await $`bun install`.cwd(webkevDir));
        const strictEnv = Object.entries(process.env)
            .filter<[string, string]>(([, val]) => val !== undefined)
            .reduce<Record<string, string>>((result, [key, val]) => {
                result[key] = val;
                return result;
            }, {});
        logResult(await $`bun run build`.cwd(webkevDir).env(strictEnv));

        const s3Client = new S3Client({});
        const distGlob = new Glob("/tmp/kdh.codes/webkev/dist/**/*");
        for await (const filename of distGlob.scan(".")) {
            const key = filename.split("/").slice(4).join("/"); // remove /tmp/kdh.codes/webkev
            const file = Bun.file(filename);
            const fileContents = await file.arrayBuffer();
            await s3Client.send(
                new PutObjectCommand({
                    Bucket: process.env.WEBKEV_BUCKET_NAME,
                    Key: key,
                    Body: new Uint8Array(fileContents),
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
