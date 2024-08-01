import * as random from "@pulumi/random";

export const githubWebhookSecret = new random.RandomString("random", {
    length: 16,
    special: true,
    overrideSpecial: "/@£$",
});
