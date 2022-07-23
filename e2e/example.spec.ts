import { rest } from "msw";

// import { server } from "./server";
import { expect, test } from "./test";

test.describe("A demo of playwright-msw's functionality", () => {
  // test.beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
  // test.afterEach(() => server.resetHandlers())
  // test.afterAll(() => server.close())

  test("should use the default handlers without requiring handlers to be specified on a per-test basis", async ({
    page,
    playwright,
    context,
    browser
  }) => {
    page.on('request', request =>
      console.log('>>', request.method(), request.url()));

    await context.route('https://www.github.com/*', async (route) => {
      console.log('=====================')
      return route.fulfill({
        status: 200,
        body: JSON.stringify({
          hello: 'WORLD'
        }),
      });
    });

    await context.route('https://api.github.com/*', async (route) => {
      console.log('+++++++++++++++++')
      return route.fulfill({
        status: 200,
        body: JSON.stringify({
          hello: 'WORLD'
        }),
      });
    });

    // await page.route('https://github.com**', route => route.fulfill({
    //   status: 200,
    //   body: JSON.stringify({
    //     hello: 'WORLD'
    //   }),
    // }));

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

    await page.goto("/");

    await Promise.all([
      page.waitForResponse('**/api/auth/session'),
      // page.waitForResponse('**/api/trpc/github.issues.list**')
    ])

    await page.waitForTimeout(20000)
    await page.screenshot()
  });
});
