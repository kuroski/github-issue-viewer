// import { rest } from "msw";

// import { mockServer } from "./server";
import { expect, test } from "./test";

test.describe("A demo of playwright-msw's functionality", () => {
  // test.beforeAll(() => mockServer.listen({ onUnhandledRequest: 'error' }))
  // test.afterEach(() => mockServer.resetHandlers())
  // test.afterAll(() => mockServer.close())

  test("should use the default handlers without requiring handlers to be specified on a per-test basis", async ({
    page,
  }) => {
    // port.listen({ onUnhandledRequest: 'error' })
    // port.resetHandlers()
    page.on('request', request =>
      console.log('>>', request.method(), request.url()));

    await page.context().clearCookies()
    await page.context().addCookies([
      {
        name: 'next-auth.session-token',
        value: '04456e41-ec3b-4edf-92c1-48c14e57cacd2',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax'
      }
    ])

    await page.goto(`/`);
    // console.log(port)
    // await page.goto(`http://localhost:3000/`);

    await Promise.all([
      page.waitForResponse('**/api/auth/session'),
      // page.waitForResponse('**/api/trpc/github.issues.list**')
    ])

    await page.waitForTimeout(20000)
    await page.screenshot()
  });
});
