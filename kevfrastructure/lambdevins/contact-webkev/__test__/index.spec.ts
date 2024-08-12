import { beforeEach, describe, expect, it, mock, type Mock } from "bun:test";

import contactWebkev from "../";
import {
    requiredFields,
    type ValidBody,
} from "../src/validators/validateRequest";

describe("contact-webkev:fetch", () => {
    let validBody: ValidBody;
    let PublishCommand: Mock<() => void>;
    let snsClient: { send: Mock<() => void> };
    beforeEach(() => {
        process.env.SNS_TOPIC_ARN = "<arn>";
        validBody = {
            name: "Some person",
            email: "some@email.com",
            phone: "07123456789",
            contactPreference: "whatever",
            body: "Hello joe",
        };
        PublishCommand = mock();
        snsClient = { send: mock() };
        mock.module("@aws-sdk/client-sns", () => ({
            SNSClient: mock(() => snsClient),
            PublishCommand,
        }));
    });
    const buildBody = (body: Partial<ValidBody>) =>
        encodeURI(
            Object.entries(body).reduce(
                (result, [key, val]) => result + `&${key}=${val}`,
                "",
            ),
        );
    const buildRequest = (body: Partial<ValidBody>, method = "POST") => {
        return new Request("https://cool.kdh.codes/lambda", {
            method,
            headers: {
                host: "kdh.codes",
                origin: "https://kdh.codes",
                "content-type": "application/x-www-form-urlencoded",
                referer: "https://kdh.codes/",
            },
            body: buildBody(body),
        });
    };
    it("returns 400 for no body", async () => {
        const response = await contactWebkev.fetch(
            new Request("https://cool.kdh.codes/lambda"),
        );

        expect(response.status).toEqual(400);
    });

    it("returns 500 if the sns topic is missing", async () => {
        process.env.SNS_TOPIC_ARN = undefined;
        const response = await contactWebkev.fetch(buildRequest(validBody));
        expect(response.status).toEqual(500);
    });

    it("returns 400 if the method is incorrect", async () => {
        const response = await contactWebkev.fetch(
            buildRequest(validBody, "GET"),
        );
        expect(response.status).toEqual(400);
    });

    it.each(requiredFields)(
        "it returns 400 when when formdata is missing %s",
        async (field) => {
            const invalidBody = { ...validBody };
            delete invalidBody[field];
            const response = await contactWebkev.fetch(
                buildRequest(invalidBody),
            );

            expect(response.status).toEqual(400);
        },
    );

    it("submits a message to the sns topic", async () => {
        const response = await contactWebkev.fetch(buildRequest(validBody));

        expect(response.status).toEqual(303);
        expect(PublishCommand).toHaveBeenCalledWith(
            expect.objectContaining({
                Subject: expect.stringContaining(validBody.name),
            }),
        );
        expect(PublishCommand).toHaveBeenCalledWith(
            expect.objectContaining({
                Message: expect.stringContaining(validBody.email),
            }),
        );
        expect(PublishCommand).toHaveBeenCalledWith(
            expect.objectContaining({
                Message: expect.stringContaining(validBody.phone),
            }),
        );
        expect(PublishCommand).toHaveBeenCalledWith(
            expect.objectContaining({
                Message: expect.stringContaining(validBody.contactPreference),
            }),
        );
        expect(PublishCommand).toHaveBeenCalledWith(
            expect.objectContaining({
                Message: expect.stringContaining(validBody.body),
            }),
        );
        expect(PublishCommand).toHaveBeenCalledWith(
            expect.objectContaining({
                TopicArn: process.env.SNS_TOPIC_ARN,
            }),
        );
    });
});
