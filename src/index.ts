import { Hono } from "hono";
import { RegExpRouter } from "hono/router/reg-exp-router";
import hypf from "hypf";

const hypfFetcher = hypf.init("https://api.end2end.tech", {
    
}, Bun.argv[2] === "--dev");

const app = new Hono({
    router: new RegExpRouter()
});


app.get("/status", async (c) => {
    const beforeTime = performance.now();
    const [err] = await hypfFetcher.get("/", {
        headers: {
            "User-Agent": c.req.header("User-Agent") || "FILE-UPLOADER-API:NO-USER-AGENT",
        },
        cache: "no-store",
        timeout: 8000,
        retries: 3,
        redirect: "error"
    });

    if (err) {
        return c.json({
            status: false,
            error: err.message,
            response_time: 0
        })
    }

    return c.json({
        status: true,
        error: null,
        response_time: performance.now() - beforeTime
    })
})

Bun.serve({
    fetch: app.fetch,
})