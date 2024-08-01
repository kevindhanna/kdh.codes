import * as github from "@pulumi/github";

import * as pulumi from "@pulumi/pulumi";

import { kdhCodesRepo } from "../core";
import { compileDeployWebkevRoute, kavpiProdStage } from "./apigateway";
import { githubWebhookSecret } from "./secrets";

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
            url: pulumi.concat(
                kavpiProdStage.invokeUrl,
                compileDeployWebkevRoute.routeKey.apply((key) =>
                    key.split(" "),
                )[1],
            ),
            secret: githubWebhookSecret.result,
        },
    },
);
