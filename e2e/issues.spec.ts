import { drop } from '@mswjs/data';
import { Page } from '@playwright/test';
import { SetupServerApi } from 'msw/lib/node';

import { db, FactoryValue } from '@/e2e/mocks/handlers';
import server from '@/e2e/mocks/server'
import { expect, test } from "@/e2e/test";
import { dateTimeFormat } from "@/lib/utils";

test.describe("Github issues app", () => {
  let props: { mockServer: SetupServerApi, baseURL: string }
  test.beforeAll(async () => {
    props = await server()
  })

  test.afterEach(() => {
    props.mockServer.resetHandlers()
    drop(db)
  })

  const build = async (page: Page) => {
    const date = dateTimeFormat({ day: 'numeric', month: 'short', year: 'numeric' })

    await page.goto(`${props.baseURL}/?state=all&type&visibility`);

    await Promise.all([
      page.waitForResponse('**/api/trpc/github.issues.list*'),
    ])

    const openedIssues = db.issue.findMany({
      where: {
        state: {
          equals: 'open'
        }
      }
    })

    const closedIssues = db.issue.findMany({
      where: {
        state: {
          equals: 'closed'
        }
      }
    })

    return {
      openedIssues,
      closedIssues,
      issuesResponse: () => page.waitForResponse('**/api/trpc/github.issues.list*'),
      locators: {
        openedIssuesCountButton: () => page.locator(`button:has-text("Open ${openedIssues.length}")`),
        closedIssuesCountButton: () => page.locator(`button:has-text("Closed ${closedIssues.length}")`),
        issue: (issue: FactoryValue<'issue'>) => {
          const issueRow = page.locator(`data-testid=issue-${issue.id}`)
          const icon = {
            'open': 'issue-open-icon',
            'closed': 'issue-closed-icon',
          }[issue.state]
          const subtitle = {
            'open': `${issue.repository!.full_name} #${issue.number} opened on ${date.format(issue.created_at)} by ${issue.user.login}`,
            'closed': `${issue.repository!.full_name} #${issue.number} by ${issue.user.login} was closed on ${date.format(issue.closed_at || issue.created_at)}`,
          }[issue.state]

          return {
            title: () => issueRow.locator('h3', { hasText: issue.title }).locator(`a[href="${issue.html_url}"]`),
            icon: () => issueRow.locator(`data-testid=${icon}`),
            subtitle: () => issueRow.locator('p', { hasText: subtitle }),
            prLink: () => issueRow.locator(`data-testid=issue-pull-request-${issue.id}`),
            comments: () => issueRow.locator(`a[href="${issue.html_url}"]`, { hasText: String(issue.comments) }),
            assignee: (assignee: FactoryValue<'assignee'>) => issueRow.locator(`a[href="${assignee.html_url}"]`).locator(`img[src="${assignee.avatar_url}"][alt~="${assignee.login}"]`),
          }
        }
      }
    }
  }

  test("a user can see a list of issues", async ({ page }) => {
    const {
      openedIssues,
      closedIssues,
      locators
    } = await build(page)

    await expect(locators.openedIssuesCountButton()).toBeVisible()
    await expect(locators.closedIssuesCountButton()).toBeVisible()

    for (const issue of [...openedIssues, ...closedIssues]) {
      const issueLocators = locators.issue(issue)
      await expect(issueLocators.title()).toBeVisible()
      await expect(issueLocators.icon()).toBeVisible()
      await expect(issueLocators.subtitle()).toBeVisible()


      if (issue.pull_request) {
        await expect(issueLocators.prLink()).toBeVisible()
      } else {
        await expect(issueLocators.prLink()).not.toBeVisible()
      }


      if (issue.comments > 0) {
        await expect(issueLocators.comments()).toBeVisible()
      } else {
        await expect(issueLocators.comments()).not.toBeVisible()
      }

      for (const assignee of issue.assignees) {
        await expect(issueLocators.assignee(assignee)).toBeVisible()
      }
    }
  });

  test("a user can filter issues", async ({ page }) => {
    const {
      openedIssues,
      closedIssues,
      issuesResponse,
      locators
    } = await build(page)

    await locators.openedIssuesCountButton().click()
    await issuesResponse()

    await Promise.all([
      ...openedIssues.map((issue) => expect(locators.issue(issue).title()).toBeVisible()),
      ...closedIssues.map((issue) => expect(locators.issue(issue).title()).not.toBeVisible()),
    ])

    await locators.closedIssuesCountButton().click()
    await issuesResponse()

    await Promise.all([
      ...openedIssues.map((issue) => expect(locators.issue(issue).title()).not.toBeVisible()),
      ...closedIssues.map((issue) => expect(locators.issue(issue).title()).toBeVisible()),
    ])
  });
});
