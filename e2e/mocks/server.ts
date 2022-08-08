import Koa from "koa"
import { SetupServerApi } from "msw/lib/node";
import { AddressInfo } from 'net';
import next from "next";
import { parse } from "node:url";

import bootstrapMockServer from '@/e2e/mocks/mockServer';

const server = new Koa()
const app = next({ dev: process.env.CI ? false : true })
const handle = app.getRequestHandler()

async function bootstrap(): Promise<{ mockServer: SetupServerApi, baseURL: string }> {
  return new Promise(async (resolve) => {
    try {
      await app.prepare()
      const mockServer = bootstrapMockServer()
      mockServer.listen({ onUnhandledRequest: 'warn' })
      server.use(ctx => {
        const parsedUrl = parse(ctx.req.url!, true);
        return handle(ctx.req, ctx.res, parsedUrl)
      });
      const s = server.listen(0)
      s.on('listening', () => {
        const port = (<AddressInfo>s.address()).port
        console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
        resolve({
          mockServer,
          baseURL: `http://localhost:${port}`
        })
      });
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  })

}

export default bootstrap
