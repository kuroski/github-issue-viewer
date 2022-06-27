import { Role } from "@prisma/client";
import type { NextPage } from "next";

import { State } from "@/lib/decoders/issue";

export type NextPageWithAuth = NextPage & {
  auth?:
  | boolean
  | {
    can?: Role[];
  };
};

