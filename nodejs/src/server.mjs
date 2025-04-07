import Koa from "koa";
import logger from "koa-logger";
import serve from "koa-static";
import session from "koa-session";
import * as crypto from "crypto";
import path from "path";
import send from "koa-send";
import { fileURLToPath } from "url";

import config from "./config.mjs";
import { router } from "./router.mjs";

// Create in-memory session store
function createInMemorySessionStore() {
  const map = new Map();
  return {
    get: map.get.bind(map),
    set: map.set.bind(map),
    destroy: map.delete.bind(map),
  };
}

// Setup __dirname (since this is an ES module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Koa app
const app = new Koa();

// Log all requests
app.use(logger());

// Session middleware
app.keys = [crypto.randomBytes(8).toString("hex")];
app.use(
  session(
    {
      store: createInMemorySessionStore(),
      sameSite: "lax",
      httpOnly: true,
    },
    app
  )
);

// Static frontend build from Vue (adjust this path if needed)
const vueDistPath = path.resolve(__dirname, "../../dist");
console.log("[INFO]: Serving Vue frontend from:", vueDistPath);
app.use(serve(vueDistPath));

// Backend API routes (e.g. /login, /callback, /user)
app.use(router.routes());

// Fallback to index.html for Vue SPA routes
app.use(async (ctx) => {
  await send(ctx, "index.html", { root: vueDistPath });
});

// Start server
app.listen(config.SERVER_PORT, () => {
  console.log(
    `[INFO]: Server started at http://localhost:${config.SERVER_PORT}`
  );
});
