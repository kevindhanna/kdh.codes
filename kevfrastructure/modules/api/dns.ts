import * as cloudflare from "@pulumi/cloudflare";

import { kdhCodesDnsZone } from "../core";
import { kavpiProdStage } from "./apigateway";

export const kavpiKdhCodesCNameRecord = new cloudflare.Record(
    "kavpi-kdh-codes-cname-record",
    {
        zoneId: kdhCodesDnsZone.then((zone) => zone.id),
        value: kavpiProdStage.invokeUrl.apply(
            (url) => new URL(url).hostname + "/prod",
        ),
        name: "kavpi",
        type: "CNAME",
        proxied: false,
    },
);
