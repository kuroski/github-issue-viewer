import * as trpc from "@trpc/server";

import { Context } from "@/server/context";

export function createRouter() {
  return trpc.router<Context>();
}
