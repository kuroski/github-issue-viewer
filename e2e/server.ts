import Koa from "koa"
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import next from "next";
import path from "node:path"
import { parse } from "node:url";

const handlers = [
  rest.all('https://github.com*', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ error: 'Oops' })
    )
  }),
  rest.get('/api/auth/session', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ error: 'Oops' })
    )
  }),
  // rest.all('*', (req, res, ctx) => {
  //   console.log({ req, res })
  //   return res(
  //     ctx.status(200),
  //     ctx.json({ error: 'Oops' })
  //   )
  // }),
]

const mockServer = setupServer(...handlers)
mockServer.listen({ onUnhandledRequest: 'warn' })

const app = next({ dev: true });
const handle = app.getRequestHandler();
// const app = next({ dev: true, dir: path.resolve(__dirname, "..") });
const port = process.env.PORT || 3000;


(async () => {
  try {
    await app.prepare();

    const server = await new Promise((resolve) => {
      const s = new Koa();
      s.use(ctx => {
        const parsedUrl = parse(ctx.req.url!, true);
        return (handle(ctx.req, ctx.res, parsedUrl))
      });
      s.listen(port, (err?: any) => {
        if (err) throw err;

        console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
        resolve(s)
      });
    })
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
