import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import "./iam";
import {
    kavpi,
    kavpiProdStage,
    compileDeployWebkevMethod,
    compileDeployWebkevResource,
} from "./apigateway";

const awsConfig = new pulumi.Config("aws");
const region = awsConfig.require("region");
const current = aws.getCallerIdentity({});
const accountId = current.then((current) => current.accountId);
export const kavpiLambdasResourceSourceArn = pulumi.interpolate`arn:aws:execute-api:${region}:${accountId}:${kavpi.id}/*/${compileDeployWebkevMethod.httpMethod}${compileDeployWebkevResource.path}`;

export const kavpiProdInvokeUrl = kavpiProdStage.invokeUrl;

export const kavpiId = kavpi.id;
export const kavpiLambdasResourceId = compileDeployWebkevResource.id;
export const kavpiLambdasResourcePath = compileDeployWebkevResource.path;
export const kavpiLambdasHttpMethod = compileDeployWebkevMethod.httpMethod;
