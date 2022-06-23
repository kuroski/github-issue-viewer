import { Role } from "@prisma/client";
import type { NextPage } from "next";

export type NextPageWithAuth = NextPage & {
  auth?:
    | boolean
    | {
        can?: Role[];
      };
};
