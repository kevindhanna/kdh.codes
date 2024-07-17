import { $, type ShellOutput } from "bun";
import {
    S3Client,
    PutObjectCommand,
    CreateBucketCommand,
    DeleteObjectCommand,
    DeleteBucketCommand,
    paginateListObjectsV2,
    GetObjectCommand,
} from "@aws-sdk/client-s3";

const logResult = ({ stdout, stderr }: ShellOutput) => {
    console.log(stdout);
    console.error(stderr);
};

export default {
    async fetch(request: Request): Promise<Response> {
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
        if (process.env.BUCKET_NAME === undefined) {
            console.error("Missing required environment variable BUCKET");
            return new Response("OK!", {
                status: 200,
                headers: {
                    "Content-Type": "text/plain",
                },
            });
        }

        logResult(
            await $`git clone https://kevindhanna:$GITHUB_ACCESS_TOKEN@github.com/kevindhanna/kdh.codes`.env(
                { GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN },
            ),
        );

        const cwd = "kdh.codes/webkev";
        logResult(await $`bun run build`.cwd(cwd));

        const s3Client = new S3Client({});
        await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: "my-first-object.txt",
                Body: "Hello JavaScript SDK!",
            }),
        );

        return new Response("OK!", {
            status: 200,
            headers: {
                "Content-Type": "text/plain",
            },
        });
    },
};
