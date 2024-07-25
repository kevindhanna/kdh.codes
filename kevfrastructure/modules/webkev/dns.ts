import * as cloudflare from "@pulumi/cloudflare";

import { kdhCodesDnsZone } from "../core";
import { webkevCFDistribution } from "./cloudfront";

const kdhCodesCNameRecord = new cloudflare.Record("kdh-codes-cname-record", {
    zoneId: kdhCodesDnsZone.then((zone) => zone.id),
    name: "@",
    value: webkevCFDistribution.domainName,
    type: "CNAME",
    proxied: false,
});

const wwwKdhCodesCNameRecord = new cloudflare.Record(
    "www-kdh-codes-cname-record",
    {
        zoneId: kdhCodesDnsZone.then((zone) => zone.id),
        value: kdhCodesCNameRecord.hostname,
        name: "www",
        type: "CNAME",
        proxied: false,
    },
);
