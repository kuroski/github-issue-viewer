import camelcaseKeys, { CamelCaseKeys } from "camelcase-keys";
import { z } from "zod";

export const organizationDecoder = z
  .object({
    id: z.number(),
    login: z.string(),
    description: z.string().nullish(),
    avatar_url: z.string().url(),
  })
  .transform((issue) => camelcaseKeys(issue, { deep: true }));
export type Organization = z.TypeOf<typeof organizationDecoder>;

export const organizationsResponseDecoder = z
  .object({
    data: z.array(organizationDecoder),
  })
  .transform(({ data }) => data);
