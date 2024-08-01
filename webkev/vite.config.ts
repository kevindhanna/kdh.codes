import { defineConfig, loadEnv } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        plugins: [
            preact({
                prerender: {
                    enabled: true,
                    renderTarget: "#app",
                    additionalPrerenderRoutes: ["/404"],
                },
            }),
        ],
        define: {
            CONTACT_WEBKEV_INVOKE_URL: env.VITE_CONTACT_WEBKEV_INVOKE_URL,
        },
    };
});
