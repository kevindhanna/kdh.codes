import { $, Glob, type ShellOutput } from "bun";
import { mkdirSync } from "fs";
import * as tar from "tar";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { request } from "@octokit/request";

const logResult = ({ stdout, stderr }: ShellOutput) => {
    console.log(stdout);
    console.error(stderr);
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

        mkdirSync("/tmp/kdh.codes");
        await tar.x({ f: "/tmp/kdh.codes.tar", C: "/tmp/kdh.codes" });

        const cwd = `/tmp/kdh.codes/webkev`;
        logResult(await $`bun run build`.cwd(cwd));

        const s3Client = new S3Client({});
        const glob = new Glob("/tmp/kdh.codes/webkev/dist/**/*");
        for await (const filename of glob.scan(".")) {
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
