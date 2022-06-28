import { Octokit } from "octokit";

import { issuesResponseDecoder } from "@/lib/decoders/issue";
import { reposResponseDecoder } from "@/lib/decoders/repo";

export function issues(octokit: Octokit) {
  return (options?: { pagination?: number }) =>
    octokit.rest.issues
      .list({
        per_page: 100,
        orgs: true,
        owned: true,
        pulls: false,
        collab: true,
        state: "all",
        ...options,
      })
      .then(issuesResponseDecoder.parse);
}

export function repos(octokit: Octokit) {
  return () =>
    octokit
      .rest
      .repos
      .listForAuthenticatedUser()
      .then(reposResponseDecoder.parse);
}

function bootstrap(token: string) {
  const octokit = new Octokit({
    auth: token,
  });
  return {
    octokit,
    issues: issues(octokit),
    repos: repos(octokit),
  };
}

export default bootstrap;
