import Factories from '@/e2e/mocks/factories';
import mockServer from "@/e2e/mocks/mockServer";
import { expect, test } from "@/e2e/test";
import { dateTimeFormat } from "@/lib/utils";

const date = dateTimeFormat({ day: 'numeric', month: 'short', year: 'numeric' })

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

    for (const issue of Factories().issues) {
      const issueRow = page.locator(`data-testid=issue-${issue.id}`)

      const issueTitle = issueRow.locator('h3', { hasText: issue.title })
      await expect(issueTitle).toBeVisible()

      if (issue.state !== "all") {
        const icon = {
          'open': 'issue-open-icon',
          'closed': 'issue-closed-icon',
        }[issue.state]
        const issueState = issueRow.locator(`data-testid=${icon}`)
        await expect(issueState).toBeVisible()
      }

      if (issue.state === "open") {
        const text = `${issue.repository.full_name} #${issue.number} opened on ${date.format(issue.created_at)} by ${issue.user.login}`
        const issueText = issueRow.locator('p', { hasText: text })
        await expect(issueText).toBeVisible()
      }
    }

    await page.pause();
  });
});
