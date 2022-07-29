import mockServer from "@/e2e/mock";
import { expect, test } from "@/e2e/test";

test.describe("Github issues app", () => {
  test.afterEach(() => mockServer.resetHandlers())

  test("a user can see a list of issues", async ({
    page,
  }) => {
    await page.goto(`/`);

    await Promise.all([
      page.waitForResponse('**/api/auth/session'),
    ])

    await page.waitForTimeout(20000)
    await page.screenshot()
  });
});
