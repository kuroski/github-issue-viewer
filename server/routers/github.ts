import * as trpc from "@trpc/server";

import octokit from "@/lib/octokit";
import prisma from "@/lib/prisma";
import { createProtectedRouter } from "@/server/create-protected-router";

const githubRoute = createProtectedRouter().query("issues.list", {
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

    return octokit(account.access_token).issues();
  },
});

export default githubRoute;
