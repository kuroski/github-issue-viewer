import { z } from "zod";

import { stateDecoder, visibilityDecoder } from "@/lib/decoders/issue";

export const issueTypeDecoder = z.union([z.literal("created"), z.literal("assigned"), z.literal("mentioned")]);
export type IssueType = z.TypeOf<typeof issueTypeDecoder>;

export const filterArrayValueDecoder = z.array(z.string())

export const filterDecoder = z.object({
  state: stateDecoder.nullish(),
  type: issueTypeDecoder.nullish(),
  visibility: visibilityDecoder.nullish(),
  orgs: z.array(z.string().nullable()).nullish(),
  repos: z.array(z.string().nullable()).nullish(),
})
export type Filter = z.TypeOf<typeof filterDecoder>

export const filterMetaDecoder = z.object({
  closedCount: z.number(),
  openCount: z.number()
})
export type FilterMeta = z.TypeOf<typeof filterMetaDecoder>
