import mockServer from "@/e2e/mocks/mockServer";
import { expect, test } from "@/e2e/test";

test.describe("Github issues app", () => {
  test.afterEach(() => mockServer.resetHandlers())

  test("a user can see a list of issues", async ({
    page,
  }) => {
    await page.goto(`/`);

    await Promise.all([
      page.waitForResponse('**/api/auth/session'),
      page.waitForResponse('**/api/trpc/github.issues.list'),
    ])

    await page.pause();
  });
});
