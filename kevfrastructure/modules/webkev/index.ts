import "./cloudfront";
import { webkevCFDistribution } from "./cloudfront";
import "./dns";
import * as iam from "./iam";
import * as s3 from "./s3";

export const webkevBucketId = s3.webkevBucket.id;
export const webkevLogsBucketArn = s3.webkevLogsBucket.arn;
export const compileDeployWebkevLambdaRoleArn =
    iam.compileDeployWebkevLambdaRole.arn;
export const webkevCFDistributionId = webkevCFDistribution.id;
