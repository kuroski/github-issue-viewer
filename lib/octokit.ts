import { Octokit } from "octokit";

import { issuesResponseDecoder } from "@/lib/decoders/issue";
import { IssueType } from "@/lib/decoders/issueFilter";

export function issues(octokit: Octokit) {
  return (options?: { pagination?: number, filter: IssueType }) =>
    octokit.rest.issues
      .list({
        per_page: 100,
        orgs: true,
        owned: true,
        pulls: false,
        collab: true,
        state: "all",
        filter: "created",
        ...options,
      })
      .then(issuesResponseDecoder.parse);
}

function bootstrap(token: string) {
  const octokit = new Octokit({
    auth: token,
  });
  return {
    octokit,
    issues: issues(octokit),
  };
}

export default bootstrap;
