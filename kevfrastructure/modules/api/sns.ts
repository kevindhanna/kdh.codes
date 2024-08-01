import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const email = config.require("webkev-contact-email");

const webkevContactMeMessageTopic = new aws.sns.Topic(
    "webkev-contact-me-messages",
    {
        name: "webkev-contact-me",
    },
);

const webkevContactMeMessageTarget = new aws.sns.TopicSubscription(
    "webkev-contact-me-message-received",
    {
        topic: webkevContactMeMessageTopic.arn,
        protocol: "email",
        endpoint: email,
    },
);
