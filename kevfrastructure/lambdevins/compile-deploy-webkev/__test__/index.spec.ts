import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    mock,
    type Mock,
} from "bun:test";

import compileDeployWebkev, { outputDir, tarFile } from "../";
import { unlinkSync, rmSync, existsSync } from "fs";
import { type Hmac, createHmac } from "crypto";
import testPayload from "./test-payload.json";

describe("compile-deploy-webkev:fetch", () => {
    let responseData: ArrayBuffer;
    let s3Client: { send: Mock<() => void> };
    let PutObjectCommand: Mock<() => string>;
    let cloudFrontClient: { send: Mock<() => void> };
    let CreateInvalidationCommand: Mock<() => string>;
    let requestMock: Mock<() => { data: ArrayBuffer }>;
    // the top level directory in the test-tarball.tar, matches what we get from github
    const headDir =
        "kevindhanna-kdh.codes-04954a9e3081e2cea7bbce08f54410edf0818d08";
    const getWorkingFilePath = (path: string) =>
        `${outputDir}/${headDir}/${path}`;

    let requestBody: string;
    let validRequestSignature: Hmac;

    beforeEach(async () => {
        const file = Bun.file("__test__/test-tarball.tar");
        responseData = await file.arrayBuffer();
        process.env.GITHUB_ACCESS_TOKEN = "some-token";
        process.env.GITHUB_WEBHOOK_SECRET = "some-secret";
        process.env.WEBKEV_BUCKET_NAME = "foobar";
        process.env.CLOUDFRONT_DISTRIBUTION_ID = "barfoo";
        process.env.VITE_CONTACT_WEBKEV_INVOKE_URL = "https://some.invoke.url";

        s3Client = { send: mock(() => {}) };
        cloudFrontClient = { send: mock(() => {}) };
        PutObjectCommand = mock(() => "<putObjectCommand>");
        CreateInvalidationCommand = mock(() => "<createInvalidationCommand>");
        requestMock = mock(() => ({
            data: responseData,
        }));

        mock.module("@octokit/request", () => ({
            request: requestMock,
        }));
        mock.module("@aws-sdk/client-s3", () => ({
            S3Client: mock(() => s3Client),
            PutObjectCommand,
        }));
        mock.module("@aws-sdk/client-cloudfront", () => ({
            CloudFrontClient: mock(() => cloudFrontClient),
            CreateInvalidationCommand,
        }));
        mock.module("uuid", () => ({
            v6: mock(() => "<some-uuid>"),
        }));

        requestBody = JSON.stringify(testPayload);
        validRequestSignature = createHmac(
            "sha256",
            process.env.GITHUB_WEBHOOK_SECRET,
        );
        validRequestSignature.update(requestBody);
    });

    afterEach(() => {
        if (existsSync(tarFile)) {
            unlinkSync(tarFile);
        }
        if (existsSync(outputDir)) {
            rmSync(outputDir, { recursive: true });
        }
    });

    const buildWebhookRequest = (signature?: string) => {
        return new Request("https://cool.kdh.codes/lambda", {
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
                "User-Agent": "GitHub-Hookshot/7d42ae9",
                "X-GitHub-Delivery": "52cb71be-4b5c-11ef-8034-fafd7653fb94",
                "X-GitHub-Event": "push",
                "X-GitHub-Hook-ID": "492332293",
                "X-GitHub-Hook-Installation-Target-ID": "828022247",
                "X-GitHub-Hook-Installation-Target-Type": "repository",
                HTTP_X_HUB_SIGNATURE_256:
                    "sha256=" +
                    (signature ?? validRequestSignature.digest("hex")),
            },
            body: requestBody,
        });
    };

    it("returns 401 for invalid signature", async () => {
        const response = await compileDeployWebkev.fetch(
            buildWebhookRequest("invalid signature"),
        );

        expect(response.status).toEqual(401);
    });

    it("returns 200 for valid signature", async () => {
        const response = await compileDeployWebkev.fetch(buildWebhookRequest());

        expect(response.status).toEqual(200);
    });

    it("downloads the repo", async () => {
        const response = await compileDeployWebkev.fetch(buildWebhookRequest());

        expect(requestMock).toHaveBeenCalledWith(
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
        expect(response.status).toEqual(200);
    });

    it("saves the file", async () => {
        const response = await compileDeployWebkev.fetch(buildWebhookRequest());

        expect(await Bun.file(tarFile).exists()).toBeTruthy();
        expect(response.status).toEqual(200);
    });

    it("extracts the tar contents", async () => {
        const response = await compileDeployWebkev.fetch(buildWebhookRequest());

        expect(
            await Bun.file(getWorkingFilePath("/webkev/index.ts")).exists(),
        ).toBeTruthy();
        expect(
            await Bun.file(getWorkingFilePath("/webkev/package.json")).exists(),
        ).toBeTruthy();
        expect(response.status).toEqual(200);
    });

    it("builds the contents", async () => {
        const response = await compileDeployWebkev.fetch(buildWebhookRequest());

        expect(
            await Bun.file(
                getWorkingFilePath("/webkev/dist/index.js"),
            ).exists(),
        ).toBeTruthy();
        expect(response.status).toEqual(200);
    });

    it("uploads the built files to s3", async () => {
        const response = await compileDeployWebkev.fetch(buildWebhookRequest());

        expect(PutObjectCommand).toHaveBeenCalledWith({
            Bucket: "foobar",
            Key: "index.js",
            Body: expect.any(Uint8Array),
            ContentType: expect.any(String),
        });
        expect(PutObjectCommand).toHaveBeenCalledWith({
            Bucket: "foobar",
            Key: "public/site.webmanifest",
            Body: expect.any(Uint8Array),
            ContentType: expect.any(String),
        });
        expect(s3Client.send).toHaveBeenCalledTimes(2);

        expect(response.status).toEqual(200);
    });

    it("invalidates the cloudfront cache", async () => {
        const response = await compileDeployWebkev.fetch(buildWebhookRequest());

        expect(CreateInvalidationCommand).toHaveBeenCalledWith({
            DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
            InvalidationBatch: {
                Paths: {
                    Quantity: 1,
                    Items: ["/*"],
                },
                CallerReference: "<some-uuid>", // required
            },
        });

        expect(cloudFrontClient.send).toHaveBeenCalled();

        expect(response.status).toEqual(200);
    });
});
