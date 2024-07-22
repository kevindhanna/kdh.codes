import * as aws from "@pulumi/aws";

const assumeRole = aws.iam.getPolicyDocument({
    statements: [
        {
            effect: "Allow",
            principals: [
                {
                    type: "Service",
                    identifiers: ["lambda.amazonaws.com"],
                },
            ],
            actions: ["sts:AssumeRole"],
        },
    ],
});
const role = new aws.iam.Role("api-gateway-lambdas-role", {
    name: "api-gateway-lambdas-role",
    assumeRolePolicy: assumeRole.then((assumeRole) => assumeRole.json),
});
