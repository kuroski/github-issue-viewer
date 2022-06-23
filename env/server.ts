import { envsafe, str, url } from "envsafe";

import { browserEnv } from "@/env/browser";

if (process.browser) {
  throw new Error(
    "This should only be included on the client (but the env vars wont be exposed)"
  );
}

export const serverEnv = {
  ...browserEnv,
  ...envsafe({
    DATABASE_URL: str({
      devDefault: "mysql://root:secret@127.0.0.1:3306/prisma",
    }),
    NEXT_APP_URL: url({
      allowEmpty: true,
      devDefault: "http://localhost:3000",
    }),
    NEXT_PUBLIC_API_HOST: url({
      allowEmpty: true,
      devDefault: "http://localhost:3000",
    }),
    NEXTAUTH_SECRET: str({
      devDefault: "++RJ5m59mcK6j9o/CHV89G5isGd93XVNb9VXlqfPggA=",
    }),
    GITHUB_ID: str({ allowEmpty: false }),
    GITHUB_SECRET: str({ allowEmpty: false }),
  }),
};
