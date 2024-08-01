import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const email = config.require("webkev-contact-email");

export const contactWebkevMeMessageTopic = new aws.sns.Topic(
    "contact-webkev-messages",
    {
        name: "contact-webkev-messages",
    },
);

const contactWebkevMeMessageTarget = new aws.sns.TopicSubscription(
    "contact-webkev-message-received",
    {
        topic: contactWebkevMeMessageTopic.arn,
        protocol: "email",
        endpoint: email,
    },
);
