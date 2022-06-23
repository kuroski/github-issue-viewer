import { createRouter } from "@/server/create-router";

const healthRoute = createRouter()
  .query("ping", {
    resolve(): Promise<string> {
      return new Promise((resolve) => {
        setTimeout(() => resolve("Pong"), 1000);
      });
    },
  })
  .mutation("pong", {
    resolve(): Promise<string> {
      return new Promise((resolve) => {
        setTimeout(() => resolve("Ping"), 1000);
      });
    },
  });

export default healthRoute;
