import superjson from "superjson";

import { createRouter } from "@/server/create-router";
import healthRoute from "@/server/routers/health";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("health.", healthRoute);

export type AppRouter = typeof appRouter;
