import { Octokit } from "octokit";

import { issuesDecoder } from "@/lib/decoders/issue";

export function repositories(octokit: Octokit) {
  return octokit.graphql(`
  {
    viewer {
      repositories(first: 100, affiliations: [OWNER, ORGANIZATION_MEMBER, COLLABORATOR], ownerAffiliations: [OWNER, ORGANIZATION_MEMBER, COLLABORATOR]) {
        nodes {
          name
          url
          isPrivate
          owner {
            login
          }
          defaultBranchRef {
            name
          }
        }
      }
    }
  }
  `);
}

export function issues(octokit: Octokit) {
  return (after?: string) =>
    octokit
      .graphql(
        `
    {
    viewer {
      issues(first: 100) {
        pageInfo {
          startCursor
          hasNextPage
          endCursor
        }
        totalCount
        nodes {
          url
          titleHTML
          bodyHTML
          number
          labels(first: 50) {
            nodes {
              url
              color
              name
            }
          }
        }
      }
    }
  }
  `,
        {}
      )
      .then(issuesDecoder.parse);
}

function bootstrap(token: string) {
  const octokit = new Octokit({
    auth: token,
  });
  return {
    octokit,
    repositories: () => repositories(octokit),
    issues: issues(octokit),
  };
}

export default bootstrap;
