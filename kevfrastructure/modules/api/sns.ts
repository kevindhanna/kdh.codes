import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const email = config.require("webkev-contact-email");

export const contactWebkevMessageTopic = new aws.sns.Topic(
    "contact-webkev-messages",
    {
        name: "contact-webkev-messages",
    },
);

const contactWebkevMessageTarget = new aws.sns.TopicSubscription(
    "contact-webkev-message-received",
    {
        topic: contactWebkevMessageTopic.arn,
        protocol: "email",
        endpoint: email,
    },
);
