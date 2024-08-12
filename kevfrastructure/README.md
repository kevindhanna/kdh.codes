# Kefrastructure

This is the infrastructure for building deploying Webkev and handling contact form submissions. Probably some other stuff later too.

[Pulumi](https://www.pulumi.com) IAC, which Bun doesn't support due to missing some node compatibility stuff, so this module uses [Yarn](https://yarnpkg.com). The lambdas all run on Bun though

## IAC

The root of this repo and the `/modules` dir is the IAC. It creates a few things:
 - an AWS API Gateway
 - a bucket to store the built Webkev files
 - a Cloudfront deployment in front of that bucket
 - a lambda behind the API Gateway that clones this repo, builds the Webkev component, drops the resultant files into an S3 bucket and invalidates the Cloudfront cache. (/lambdevins/compile-deploy-webkev)
 - the kdh.codes certs and DNS records (dns lives on Cloudflare since AWS charges for Route 53 zones)
 - another bucket for logs
 - configures a github webhook on this repo to call the `compile-deploy-webkev` lambdevin when new commits are pushed
 - another lambda to handle the webkev contact form submissions
 - an SNS topic that emails me the contact form details
 
 ## dev
 
 There is no local dev
 
 ## test
 The two lambdevins have tests, but otherwise...
 
 you can run `bun test` in their dirs to see em in action
 
 ## deploy
 
 - Create an AWS account and Cloudflare account
 - fork this repo and clone
 - `yarn install` in this dir
 - `pulumi config add` these keys: 
   - aws:accessKey
   - aws:allowedAccountIds (your AWS account ID to make sure we're working on the right one)
   - aws:region 
   - aws:secretKey
   - cloudflare:apiToken
   - github:owner
   - github:token
   - webkev-contact-email (where contact emails go)
   - webkev:compile-deploy-webkev-lambda-github-token
 - `pulumi up`
 
 It probably won't work the first time as there's a few circular dependencies. But maybe if you keep trying it'll work eventually? I've not blown away the whole stack to try this yet.
 
## TODO

- a lambda proxy for github, as the build takes longer than the request timeout so Github sees 504 responses
- smarter compile-deploy-webkev that only deploys when changes are detected
- a better way to handle lambda builds. I feel like something with [Dynamic Resources](https://www.pulumi.com/docs/concepts/resources/dynamic-providers/) could do it but couldn't get it to work (see resources/LocalCodeArchive)
