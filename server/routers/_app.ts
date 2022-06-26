import superjson from "superjson";

import { createRouter } from "@/server/create-router";
import githubRoute from "@/server/routers/github";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("github.", githubRoute);

export type AppRouter = typeof appRouter;
