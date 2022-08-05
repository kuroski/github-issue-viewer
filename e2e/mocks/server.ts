import Koa from "koa"
import { SetupServerApi } from "msw/lib/node";
import next from "next";
import { parse } from "node:url";

import bootstrapMockServer from '@/e2e/mocks/mockServer';

const server = new Koa()
const app = next({ dev: process.env.CI ? false : true })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000;

async function bootstrap(): Promise<SetupServerApi> {
  return new Promise(async (resolve) => {
    try {
      await app.prepare()
      const mockServer = bootstrapMockServer()
      mockServer.listen({ onUnhandledRequest: 'warn' })
      server.use(ctx => {
        const parsedUrl = parse(ctx.req.url!, true);
        return handle(ctx.req, ctx.res, parsedUrl)
      });
      server.listen(port, (err?: any) => {
        if (err) throw err;
        console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
        resolve(mockServer)
      });
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  })

}

export default bootstrap
