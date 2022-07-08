import { Octokit } from "octokit";

import { IssueType } from "@/lib/decoders/filter";
import { issuesResponseDecoder } from "@/lib/decoders/issue";
import { orgsResponseDecoder } from '@/lib/decoders/org';
import { reposResponseDecoder } from "@/lib/decoders/repo";

export function issues(octokit: Octokit) {
  return (options?: { pagination?: number, filter: IssueType }) =>
    octokit.rest.issues
      .listForAuthenticatedUser({
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

export function orgIssues(octokit: Octokit) {
  return (org: string, options?: { pagination?: number, filter: IssueType }) =>
    octokit.rest.issues
      .listForOrg({ org, per_page: 100, ...options })
      .then(orgsResponseDecoder.parse);
}

export function orgs(octokit: Octokit) {
  return () =>
    octokit.rest.orgs
      .listForAuthenticatedUser({
        per_page: 100,
      })
      .then(orgsResponseDecoder.parse)
}

export function repos(octokit: Octokit) {
  return () =>
    octokit.rest.repos
      .listForAuthenticatedUser({
        per_page: 100,
      })
      .then(reposResponseDecoder.parse)
}

function bootstrap(auth: string) {
  const octokit = new Octokit({
    auth,
  });
  return {
    octokit,
    issues: issues(octokit),
    orgIssues: orgIssues(octokit),
    orgs: orgs(octokit),
    repos: repos(octokit),
  };
}

export default bootstrap;
