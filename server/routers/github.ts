import * as trpc from "@trpc/server";

import { filterDecoder, FilterMeta } from "@/lib/decoders/filter";
import octokit from "@/lib/octokit";
import prisma from "@/lib/prisma";
import { createProtectedRouter } from "@/server/create-protected-router";

const githubRoute = createProtectedRouter()
  .query("issues.list", {
    input: filterDecoder,
    async resolve({ ctx, input }) {
      const account = await prisma.account.findFirstOrThrow({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (!account.access_token) {
        throw new trpc.TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have access token",
        });
      }

      const instance = octokit(account.access_token)
      const [issues, orgs, repos] = await Promise.all([
        instance.issues({
          filter: input.type || 'created',
        }),
        instance.orgs(),
        instance.repos()
      ])

      const filteredRepos = input.repos?.flatMap((f) => !!f ? [f] : []) || []

      const filteredIssues = issues
        .filter((issue) => {
          if (!input.visibility || input.visibility === 'all') return true
          return input.visibility === issue.repository.visibility
        })
        .filter(issue => {
          if (filteredRepos.length === 0) return true
          return filteredRepos.includes(issue.repository.fullName)
        })

      const meta: FilterMeta = {
        closedCount: filteredIssues.reduce((acc, issue) => issue.state === 'closed' ? acc + 1 : acc, 0),
        openCount: filteredIssues.reduce((acc, issue) => issue.state === 'open' ? acc + 1 : acc, 0),
      }

      return {
        issues: filteredIssues.filter((issue) => {
          if (!input.state) return issue.state === 'open'
          if (input.state === 'all') return true
          return issue.state === input.state
        }),
        meta,
        orgs,
        repos
      };
    },
  })

export default githubRoute;
