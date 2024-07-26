import * as github from "@pulumi/github";
import * as random from "@pulumi/random";

import { kdhCodesRepo } from "../core";
import { compileDeployWebkevInvokeUrl } from "./apigateway";

export const webhookSecret = new random.RandomString("random", {
    length: 16,
    special: true,
    overrideSpecial: "/@£$",
});
const webkevRepoWebhook = new github.RepositoryWebhook(
    "kdh-codes-push-webhook",
    {
        events: ["push"],
        active: true,
        repository: kdhCodesRepo.then((kdhCodesRepo) => kdhCodesRepo.id),
        configuration: {
            contentType: "json",
            // TODO: Why the hell does api gateway use the aws cert here instead of kavpi.kdh.codes?!?!
            // url: pulumi.concat(
            //     "https://",
            //     kavpiProdApiMapping.domainName,
            //     "/compile-deploy-webkev",
            // ),
            url: compileDeployWebkevInvokeUrl,
            secret: webhookSecret.result,
        },
    },
);
