import camelcaseKeys from "camelcase-keys";
import { z } from "zod";

export const repoDecoder = z
  .object({
    id: z.number(),
    full_name: z.string(),
    description: z.string().nullish(),
    url: z.string().url(),
  })
  .transform((repo) => camelcaseKeys(repo, { deep: true }));
export type Repo = z.TypeOf<typeof repoDecoder>;

export const reposResponseDecoder = z
  .object({
    data: z.array(repoDecoder),
  })
  .transform(({ data }) => data);
