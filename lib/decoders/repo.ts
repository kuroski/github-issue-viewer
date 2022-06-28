import camelcaseKeys from "camelcase-keys";
import { z } from "zod";

export const repoDecoder = z.object({
  id: z.number(),
  full_name: z.string()
})
  .transform((repo) => camelcaseKeys(repo));
export type RepoDecoder = z.TypeOf<typeof repoDecoder>

export const reposResponseDecoder = z
  .object({
    data: z.array(repoDecoder),
  })
  .transform(({ data }) => data);

