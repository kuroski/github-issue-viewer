import superjson from "superjson";

import { createRouter } from "@/server/create-router";
import githubRoute from "@/server/routers/github";
import healthRoute from "@/server/routers/health";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("health.", healthRoute)
  .merge("github.", githubRoute);

export type AppRouter = typeof appRouter;
