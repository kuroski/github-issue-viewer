import Factories from '@/e2e/mocks/factories';
import mockServer from "@/e2e/mocks/mockServer";
import { expect, test } from "@/e2e/test";

test.describe("Github issues app", () => {
  test.afterEach(() => mockServer.resetHandlers())

  test("a user can see a list of issues", async ({
    page,
  }) => {
    await page.goto(`/?state=all&type&visibility`);

    await Promise.all([
      page.waitForResponse('**/api/auth/session'),
      page.waitForResponse('**/api/trpc/github.issues.list*'),
    ])

    await Promise.all(
      Factories().issues.map(async (issue) => {
        const issueTitle = page.locator('h3', { hasText: issue.title })
        return expect(issueTitle).toBeVisible();
      })
    )

    await page.pause();
  });
});
