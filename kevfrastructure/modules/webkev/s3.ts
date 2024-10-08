import * as aws from "@pulumi/aws";

export const webkevLogsBucket = new aws.s3.BucketV2("kdh-codes-webkev-logs", {
    bucket: "kdh-codes-webkev-logs",
    forceDestroy: true,
});
export const webkevBucket = new aws.s3.BucketV2("kdh-codes-webkev", {
    bucket: "kdh-codes-webkev",
});

const webkevBucketLogging = new aws.s3.BucketLoggingV2(
    "kdh-codes-webkev-logging",
    {
        bucket: webkevBucket.id,
        targetBucket: webkevLogsBucket.id,
        targetPrefix: "s3/",
    },
);

const webkevLogsBucketOwnershipControl = new aws.s3.BucketOwnershipControls(
    "webkev-logs-bucket-ownership-controls",
    {
        bucket: webkevLogsBucket.id,
        rule: {
            objectOwnership: "BucketOwnerPreferred",
        },
    },
);
