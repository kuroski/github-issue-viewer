import * as trpcNext from "@trpc/server/adapters/next";

import logger from "@/lib/logger";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      logger.error(error);
    }
  },
  batching: {
    enabled: true,
  },
});
