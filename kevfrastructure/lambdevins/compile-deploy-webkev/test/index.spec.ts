import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    mock,
    type Mock,
} from "bun:test";

import compileDeployWebkev from "../";
import { unlinkSync, rmSync } from "fs";

describe("compile-deploy-webkev:fetch", () => {
    let responseData: ArrayBuffer;
    let s3Client: { send: Mock<() => void> };
    let PutObjectCommand: Mock<() => string>;
    let requestMock: Mock<() => { data: ArrayBuffer }>;

    beforeEach(async () => {
        // s3Client = { send: mock(() => {}) };
        // PutObjectCommand = mock(() => "<putObjectCommand>");
        // requestMock = mock(() => ({
        //     data: responseData,
        // }));
        // const file = Bun.file("test/test-tarball.tar");
        // responseData = await file.arrayBuffer();
        process.env.GITHUB_ACCESS_TOKEN = "some-token";
        process.env.WEBKEV_BUCKET_NAME = "foobar";
        // mock.module("@octokit/request", () => ({
        //     request: requestMock,
        // }));
        // mock.module("@aws-sdk/client-s3", () => ({
        //     S3Client: mock(() => s3Client),
        //     PutObjectCommand,
        // }));
    });

    afterEach(() => {
        // unlinkSync("/tmp/kdh.codes.tar");
        // rmSync("/tmp/kdh.codes", { recursive: true });
    });

    it("downloads the repo", async () => {
        const request = new Request("https://cool.kdh.codes/lambda");
        const response = await compileDeployWebkev.fetch(request);

        // expect(requestMock).toHaveBeenCalledWith(
        //     "GET /repos/kevindhanna/kdh.codes/tarball/main",
        //     {
        //         owner: "kevindhanna",
        //         repo: "kdh.codes",
        //         ref: "main",
        //         headers: {
        //             "X-GitHub-Api-Version": "2022-11-28",
        //             Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        //         },
        //     },
        // );
        expect(response.status).toEqual(200);
    });

    it("saves the file", async () => {
        const request = new Request("https://cool.kdh.codes/lambda");
        const response = await compileDeployWebkev.fetch(request);

        expect(await Bun.file("/tmp/kdh.codes.tar").exists()).toBeTruthy();
        expect(response.status).toEqual(200);
    });

    it("extracts the tar contents", async () => {
        const request = new Request("https://cool.kdh.codes/lambda");
        const response = await compileDeployWebkev.fetch(request);

        // expect(
        //     await Bun.file("kdh.codes/webkev/index.ts").exists(),
        // ).toBeTruthy();
        // expect(
        //     await Bun.file("kdh.codes/webkev/package.json").exists(),
        // ).toBeTruthy();
        expect(response.status).toEqual(200);
    });

    it("builds the contents", async () => {
        const request = new Request("https://cool.kdh.codes/lambda");
        const response = await compileDeployWebkev.fetch(request);

        expect(
            await Bun.file("kdh.codes/webkev/dist/index.js").exists(),
        ).toBeTruthy();
        expect(response.status).toEqual(200);
    });

    it.only("uploads the built files to s3", async () => {
        const request = new Request("https://cool.kdh.codes/lambda");
        const response = await compileDeployWebkev.fetch(request);
        // expect(PutObjectCommand).toHaveBeenCalledWith({
        //     Bucket: "foobar",
        //     Key: "dist/index.js",
        //     Body: expect.any(Uint8Array),
        // });
        // expect(PutObjectCommand).toHaveBeenCalledWith({
        //     Bucket: "foobar",
        //     Key: "dist/public/site.webmanifest",
        //     Body: expect.any(Uint8Array),
        // });

        expect(response.status).toEqual(200);
    });
});
