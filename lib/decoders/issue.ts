import camelcaseKeys from "camelcase-keys";
import { z } from "zod";

export const issueDecoder = z
  .object({
    id: z.number(),
    url: z.string(),
    repository_url: z.string(),
    labels_url: z.string(),
    comments_url: z.string(),
    html_url: z.string(),
    number: z.number(),
    state: z.string(),
    title: z.string(),
    body: z.string().nullish(),
    user: z.object({
      login: z.string(),
      id: z.number(),
      avatar_url: z.string(),
      url: z.string(),
      html_url: z.string(),
    }),
    labels: z.array(
      z.object({
        id: z.number(),
        node_id: z.string(),
        url: z.string(),
        name: z.string(),
        description: z.string(),
        color: z.string(),
        default: z.boolean(),
      })
    ),
    assignee: z.object({
      login: z.string(),
      id: z.number(),
      avatar_url: z.string(),
      gravatar_id: z.string(),
      url: z.string(),
      html_url: z.string(),
    }),
    assignees: z.array(
      z.object({
        login: z.string(),
        id: z.number(),
        avatar_url: z.string(),
        gravatar_id: z.string(),
        url: z.string(),
        html_url: z.string(),
      })
    ),
    locked: z.boolean(),
    comments: z.number(),
    pull_request: z
      .object({
        url: z.string(),
        html_url: z.string(),
        diff_url: z.string(),
        patch_url: z.string(),
      })
      .nullish(),
    closed_at: z.string().nullish(),
    created_at: z.string(),
    updated_at: z.string(),
    repository: z.object({
      id: z.number(),
      name: z.string(),
      full_name: z.string(),
    }),
  })
  .transform((issue) => camelcaseKeys(issue, { deep: true }));
export type IssueDecoder = z.TypeOf<typeof issueDecoder>;

export const issuesResponseDecoder = z
  .object({
    data: z.array(issueDecoder),
  })
  .transform(({ data }) => data);
