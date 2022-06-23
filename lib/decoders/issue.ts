import { z } from "zod";

export const issueDecoder = z
  .object({
    viewer: z.object({
      issues: z.object({
        pageInfo: z.object({
          startCursor: z.string(),
          hasNextPage: z.boolean(),
          endCursor: z.string(),
        }),
        totalCount: z.number(),
        nodes: z.array(
          z.union([
            z.object({
              url: z.string(),
              titleHTML: z.string(),
              bodyHTML: z.string(),
              number: z.number(),
              labels: z.object({ nodes: z.array(z.unknown()) }),
            }),
            z.object({
              url: z.string(),
              titleHTML: z.string(),
              bodyHTML: z.string(),
              number: z.number(),
              labels: z.object({
                nodes: z.array(
                  z.object({
                    url: z.string(),
                    color: z.string(),
                    name: z.string(),
                  })
                ),
              }),
            }),
          ])
        ),
      }),
    }),
  })
  .transform(({ viewer }) => viewer.issues);
