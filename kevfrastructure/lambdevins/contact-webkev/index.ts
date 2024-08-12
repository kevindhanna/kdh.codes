import { validateRequest } from "./src/validators/validateRequest";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

export default {
    async fetch(request: Request): Promise<Response> {
        if (!process.env.SNS_TOPIC_ARN) {
            console.error("Missing SNS_TOPIC_ARN");
            return new Response("Something went wrong :(!", {
                status: 500,
                headers: {
                    "Content-Type": "text/plain",
                },
            });
        }

        const [body, invalidResponse] = await validateRequest(request);

        if (invalidResponse) {
            console.warn("Invalid request");
            return invalidResponse;
        }

        const snsClient = new SNSClient({});
        const subject = `You've been Webkev Contacted by ${body.name}`;
        const message = [
            `email: ${body.email}`,
            `phone: ${body.phone}`,
            `contact by: ${body.contactPreference}`,
            body.body,
        ].join("\n");

        await snsClient.send(
            new PublishCommand({
                Subject: subject,
                Message: message,
                TopicArn: process.env.SNS_TOPIC_ARN,
            }),
        );

        console.log("Submitted, redirecting");
        const origin = request.headers.get("origin");
        return new Response("Thanks!", {
            status: 303,
            headers: {
                Location: `${origin}/contact?submitted=true`,
                "Content-Type": "text/plain",
            },
        });
    },
};
