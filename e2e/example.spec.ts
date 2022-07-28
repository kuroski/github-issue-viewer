import mockServer from "./mock";
import { expect, test } from "./test";

test.describe("A demo of playwright-msw's functionality", () => {
  test.afterEach(() => mockServer.resetHandlers())

  test("should use the default handlers without requiring handlers to be specified on a per-test basis", async ({
    page,
  }) => {
    page.on('request', request =>
      console.log('>>', request.method(), request.url()));

    await page.goto(`/`);

    await Promise.all([
      page.waitForResponse('**/api/auth/session'),
    ])

    await page.waitForTimeout(20000)
    await page.screenshot()
  });
});
