import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

import { webkevBucket } from "./s3";
import { webkevCFDistribution } from "./cloudfront";

export const webkevBucketArn = webkevBucket.arn;
export const webkevBucketName = webkevBucket.id;
export const webkevCFDistributionArn = webkevCFDistribution.arn;
