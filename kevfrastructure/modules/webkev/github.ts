import * as pulumi from "@pulumi/pulumi";
import * as github from "@pulumi/github";
import { kdhCodesRepo } from "../core";
import { kavpiProdInvokeUrl } from "../api";
import { kavpiLambdasResourcePath } from "../api";

const kdhCodesPushWebhook = new github.RepositoryWebhook(
    "kdh-codes-push-webhook",
    {
        repository: kdhCodesRepo.name,
        configuration: {
            url: pulumi.concat(kavpiProdInvokeUrl, kavpiLambdasResourcePath),
            contentType: "json",
            insecureSsl: false,
        },
        events: ["push"],
    },
);
