import * as pulumi from "@pulumi/pulumi";

import { kavpiProdStage, compileDeployWebkevIntegration } from "./apigateway";
import "./cloudfront";
import "./cloudwatch";
import "./github";
import "./iam";
import "./lambda";

export const compileDeployWebkevInvokeUrl = pulumi.interpolate`${kavpiProdStage.invokeUrl}/compile-deploy-webkev`;
export const compileDeployWebkevIntegrationUri =
    compileDeployWebkevIntegration.integrationUri;
