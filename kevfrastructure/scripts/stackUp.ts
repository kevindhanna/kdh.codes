const { LocalWorkspace } = require("@pulumi/pulumi/automation");

const contactWebkevProdEndpointConfigKey =
    "api-gateway:contact-webkev-prod-endpoint";

const run = async () => {
    const stack = await LocalWorkspace.selectStack({
        stackName: "prod",
        workDir: __dirname,
    });
    const output = await stack.outputs();

    if (!output.contactWebkevApiEndpoint) {
        throw new Error(`Missing output of application 'frontend'`);
    }

    console.log("\n\nPost deploy: Updating stack");
    const storedWebkevEndpoint = await stack
        .getConfig(contactWebkevProdEndpointConfigKey)
        .catch(() => {});

    if (
        !storedWebkevEndpoint ||
        storedWebkevEndpoint.value !== output.contactWebkevApiEndpoint.value
    ) {
        console.warn(
            `The ${contactWebkevProdEndpointConfigKey} config needs to be updated!`,
            {
                stored: storedWebkevEndpoint,
                output: output.contactWebkevApiEndpoint.value,
            },
        );
        await stack.setConfig(contactWebkevProdEndpointConfigKey, {
            value: output.contactWebkevApiEndpoint.value,
        });
        const updateResult = await stack.up({
            onOutput: (data: string) => process.stdout.write(data),
        });

        console.log(updateResult.outputs);
    } else {
        console.log("no updates needed =)");
    }
};

run().catch(console.error);
