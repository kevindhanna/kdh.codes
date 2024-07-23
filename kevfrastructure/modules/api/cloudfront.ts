import * as aws from "@pulumi/aws";

// import { kavpiProdStage } from "./apigateway";

// const apiCFDistribution = new aws.cloudfront.Distribution("mydistribution", {
//     origins: [
//         {
//             domainName: kavpiProdStage.invokeUrl,
//             originId: "apiOrigin",
//             customOriginConfig: {
//                 httpPort: 80,
//                 httpsPort: 443,
//                 originProtocolPolicy: "https-only",
//                 originSslProtocols: ["TLSv1.2", "SSLv3"],
//             },
//         },
//     ],
//     enabled: true,
//     isIpv6Enabled: true,
//     priceClass: "PriceClass_100",
//     defaultCacheBehavior: {
//         allowedMethods: ["POST", "HEAD", "OPTIONS"],
//         cachedMethods: ["HEAD"],
//         targetOriginId: kavpiProdStage.arn,
//         cachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6", // CachingOptimized
//         originRequestPolicyId: "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf", // CORS-S3Origin
//         responseHeadersPolicyId: "67f7725c-6f97-4210-82d7-5512b31e9d03", // SecurityHeadersPolicy
//         viewerProtocolPolicy: "redirect-to-https",
//     },
//     restrictions: {
//         geoRestriction: {
//             restrictionType: "none",
//         },
//     },
//     viewerCertificate: {
//         cloudfrontDefaultCertificate: true,
//     },
// });
