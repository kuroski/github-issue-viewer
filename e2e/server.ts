import Koa from "koa"
import next from "next";
import { parse } from "node:url";

import mockServer from "./mock";

const server = new Koa()
const app = next({ dev: true })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000;

(async () => {
  try {
    await app.prepare()
    mockServer.listen({ onUnhandledRequest: 'warn' })
    server.use(ctx => {
      const parsedUrl = parse(ctx.req.url!, true);
      return handle(ctx.req, ctx.res, parsedUrl)
    });
    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})()
