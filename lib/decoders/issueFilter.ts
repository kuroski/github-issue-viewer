import { z } from "zod";

import { stateDecoder } from "@/lib/decoders/issue";

export const issueFilterDecoder = z.object({
  state: stateDecoder.nullish()
})
export type IssueFilter = z.TypeOf<typeof issueFilterDecoder>

export const issueMetaDecoder = z.object({
  closedCount: z.number(),
  openCount: z.number()
})
export type IssueMeta = z.TypeOf<typeof issueMetaDecoder>
