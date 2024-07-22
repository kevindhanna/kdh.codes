import { bunLambdaLayer } from "./bunLayer";
import { compileDeployWebkevlambdaRole } from "./iam";
import compileDeployWebkev from "./compileDeployWebkev";

export const bunLambdaLayerArn = bunLambdaLayer.arn;
export const compileDeployWebkevLambdaRoleArn =
    compileDeployWebkevlambdaRole.arn;
export const compileDeployWebkevLambdaRoleName =
    compileDeployWebkevlambdaRole.name;
export const compileDeployWebkevCodeArchive = compileDeployWebkev.archive;
export const compileDeployWebkevSourceHash =
    compileDeployWebkev.lambda.outputBase64sha256;
