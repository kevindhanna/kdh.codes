Bun.serve({
    port: 8080,
    fetch(req) {
        const url = new URL(req.url);
        if (url.pathname === "/") {
            url.pathname = "/index.html";
        }
        return new Response(Bun.file(`./dist/${url.pathname}`));
    },
});
