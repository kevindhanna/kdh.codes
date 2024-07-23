import * as pulumi from "@pulumi/pulumi";
import * as github from "@pulumi/github";
import { kdhCodesRepo } from "../core";
// import { compileDeployWebkevResource, kavpiProdStage } from "./apigateway";

// const webkevRepoWebhook = new github.RepositoryWebhook(
//     "kdh-codes-push-webhook",
//     {
//         events: ["push"],
//         active: true,
//         repository: kdhCodesRepo.then((kdhCodesRepo) => kdhCodesRepo.id),
//         configuration: {
//             contentType: "json",
//             url: pulumi.concat(
//                 kavpiProdStage.invokeUrl,
//                 compileDeployWebkevResource.path,
//             ),
//         },
//     },
// );
