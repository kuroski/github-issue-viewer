import { expect, test as base } from "@playwright/test";
import Koa from "koa"
import { rest } from 'msw'
import { SetupServerApi } from "msw/node";
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
  rest.all('*', (req, res, ctx) => {
    console.log('+++++++++++++')
    return res(ctx.status(200), ctx.json({}))
  })
]
const mockServer = setupServer(...handlers)

const app = next({ dev: true, dir: path.resolve(__dirname, "..") });
const port = process.env.PORT || 3000;

// const test = base.extend<{
//   port: SetupServerApi;
//   rest: typeof rest;
// }>({
//   // the port function is the same as before
//   port: [
//     async ({ }, use) => {
//       await app.prepare();
//       const handle = await app.getRequestHandler();

//       // start next server on arbitrary port
//       await new Promise((resolve) => {
//         const s = new Koa();
//         s.use(ctx => {
//           const parsedUrl = parse(ctx.req.url!, true);
//           console.log(parsedUrl.href)
//           return (handle(ctx.req, ctx.res, parsedUrl))
//         });
//         s.listen(port, (err?: any) => {
//           if (err) throw err;

//           console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
//           resolve(s)
//         });
//       })
//       mockServer.listen({ onUnhandledRequest: 'error' })


//       // provide port to tests
//       await use(mockServer);
//     },
//     {
//       //@ts-ignore
//       scope: "worker",
//       auto: true,
//     },
//   ],
//   rest,
// });

const test = base.extend<{}>({});

export { expect, test };
