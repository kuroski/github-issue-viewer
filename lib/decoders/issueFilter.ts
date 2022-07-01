import { z } from "zod";

import { stateDecoder, visibilityDecoder } from "@/lib/decoders/issue";

export const issueTypeDecoder = z.union([z.literal("created"), z.literal("assigned"), z.literal("mentioned")]);
export type IssueType = z.TypeOf<typeof issueTypeDecoder>;

export const issueFilterDecoder = z.object({
  state: stateDecoder.nullish(),
  type: issueTypeDecoder.nullish(),
  visibility: visibilityDecoder.nullish(),
})
export type IssueFilter = z.TypeOf<typeof issueFilterDecoder>

export const issueMetaDecoder = z.object({
  closedCount: z.number(),
  openCount: z.number()
})
export type IssueMeta = z.TypeOf<typeof issueMetaDecoder>
