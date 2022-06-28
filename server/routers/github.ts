import * as trpc from "@trpc/server";

import { issueFilterDecoder, IssueMeta } from "@/lib/decoders/issueFilter";
import octokit from "@/lib/octokit";
import prisma from "@/lib/prisma";
import { createProtectedRouter } from "@/server/create-protected-router";

const githubRoute = createProtectedRouter()
  .query("issues.list", {
    input: issueFilterDecoder,
    async resolve({ ctx, input }) {
      const account = await prisma.account.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
        rejectOnNotFound: true,
      });

      if (!account.access_token) {
        throw new trpc.TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have access token",
        });
      }

      const issues = await octokit(account.access_token).issues()

      const meta: IssueMeta = {
        closedCount: issues.reduce((acc, issue) => issue.state === 'closed' ? acc + 1 : acc, 0),
        openCount: issues.reduce((acc, issue) => issue.state === 'open' ? acc + 1 : acc, 0),
      }

      return {
        issues: issues.filter((issue) => {
          if (!input.state) return issue.state === 'open'
          if (input.state === 'all') return true
          return issue.state === input.state
        }),
        meta
      };
    },
  })
  .query("repos.list", {
    async resolve({ ctx }) {

      const account = await prisma.account.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
        rejectOnNotFound: true,
      });

      if (!account.access_token) {
        throw new trpc.TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have access token",
        });
      }

      const repos = await octokit(account.access_token).repos()

      return repos;
    }
  });

export default githubRoute;
