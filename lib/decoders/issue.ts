import camelcaseKeys, { CamelCaseKeys } from "camelcase-keys";
import { z } from "zod";

import { dateFrom, isISODate } from "@/lib/utils";

export const stateDecoder = z.union([z.literal("all"), z.literal("open"), z.literal("closed")]);
export type State = z.TypeOf<typeof stateDecoder>;

export const visibilityDecoder = z.union([z.literal("all"), z.literal("public"), z.literal("private")]);
export type Visibility = z.TypeOf<typeof visibilityDecoder>;

const userDecoder = z.object({
  login: z.string(),
  id: z.number(),
  avatar_url: z.string().url(),
  gravatar_id: z.string(),
  url: z.string().url(),
  html_url: z.string().url(),
})
export type User = CamelCaseKeys<z.TypeOf<typeof userDecoder>>

const isoDateDecoder = z
  .string()
  .refine(isISODate, { message: "Not a valid ISO string date " })
  .transform(dateFrom);

export const issueDecoder = z
  .object({
    id: z.number(),
    html_url: z.string().url(),
    url: z.string().url(),
    repository_url: z.string().url(),
    number: z.number(),
    state: stateDecoder,
    title: z.string(),
    body: z.string().nullish(),
    user: userDecoder,
    labels: z.array(
      z.object({
        id: z.number(),
        url: z.string().url(),
        name: z.string(),
        description: z.string().nullish(),
        color: z.string(),
      })
    ),
    assignees: z.array(
      userDecoder
    ),
    comments: z.number(),
    pull_request: z
      .object({
        url: z.string().url(),
        html_url: z.string().url(),
      })
      .nullish(),
    closed_at: isoDateDecoder.nullish(),
    created_at: isoDateDecoder,
    updated_at: isoDateDecoder,
    repository: z.object({
      id: z.number(),
      name: z.string(),
      full_name: z.string(),
      description: z.string().nullish(),
      html_url: z.string().url(),
      private: z.boolean(),
      visibility: visibilityDecoder.nullish(),
    }),
    timeline_url: z.string().url(),
  })
  .transform((issue) => camelcaseKeys(issue, { deep: true }));
export type IssueDecoder = z.TypeOf<typeof issueDecoder>;

export const issuesResponseDecoder = z
  .object({
    data: z.array(issueDecoder),
  })
  .transform(({ data }) => data);
