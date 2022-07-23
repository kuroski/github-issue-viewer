import { expect, test as base } from "@playwright/test";
// import type { MockServiceWorker } from "playwright-msw";
// import { createServer, createWorkerFixture } from "playwright-msw";

// import handlers from "./mocks/handlers";
// import { server } from './server.js'

const test = base.extend<{
  // worker: MockServiceWorker;
}>({
  // worker: createWorkerFixture(...handlers),
  // worker: [
  //   async ({ page }, use) => {
  //     page.on('request', request =>
  //       console.log('>>', request.method(), request.url()));

  //     await page.context().clearCookies()
  //     await page.context().addCookies([
  //       {
  //         name: 'next-auth.session-token',
  //         value: '04456e41-ec3b-4edf-92c1-48c14e57cacd2',
  //         domain: 'localhost',
  //         path: '/',
  //         httpOnly: true,
  //         sameSite: 'Lax'
  //       }
  //     ])

  //     server.listen()
  //     const s = await createServer(page, ...handlers);
  //     // Test has not started to execute...
  //     await use(s);
  //     server.resetHandlers()
  //     // Test has finished executing...
  //     // [insert any cleanup actions here]
  //   },
  //   {
  //     /**
  //      * Scope this fixture on a per test basis to ensure that each test has a
  //      * fresh copy of MSW. Note: the scope MUST be "test" to be able to use the
  //      * `page` fixture as it is not possible to access it when scoped to the
  //      * "worker".
  //      */
  //     scope: "test",
  //     /**
  //      * By default, fixtures are lazy; they will not be initalised unless they're
  //      * used by the test. Setting `true` here means that the fixture will be auto-
  //      * initialised even if the test doesn't use it.
  //      */
  //     auto: true,
  //   },
  // ],
});

export { expect, test };
