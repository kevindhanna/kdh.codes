import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";

const kdh_codes = new digitalocean.Project("kdh.codes", {
    description: "Update your project information under Settings",
    environment: "Production",
    isDefault: true,
    name: "kdh.codes",
    resources: ["do:domain:kdh.codes"],
}, {
    protect: true,
});

// Create a DigitalOcean resource (Domain)
const domain = new digitalocean.Domain("kdh.codes", {
  name: "kdh.codes"
});

// Export the name of the domain
export const domainName = domain.name;
