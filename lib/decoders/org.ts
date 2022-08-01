import camelcaseKeys from "camelcase-keys";
import { z } from "zod";

export const orgDecoder = z
  .object({
    id: z.number(),
    login: z.string(),
    description: z.string().nullish(),
    avatar_url: z.string().url(),
  })
  .transform((org) => camelcaseKeys(org, { deep: true }));
export type Org = z.TypeOf<typeof orgDecoder>;

export const orgsResponseDecoder = z
  .object({
    data: z.array(orgDecoder),
  })
  .transform(({ data }) => data);
