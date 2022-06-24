import { Octokit } from "octokit";

import { issuesResponseDecoder } from "@/lib/decoders/issue";

export function issues(octokit: Octokit) {
  return (options?: { pagination?: number }) =>
    octokit.rest.issues
      .list({
        orgs: true,
        owned: true,
        per_page: 100,
        pulls: true,
        collab: true,
        state: "all",
      })
      // .listForAuthenticatedUser({
      //   per_page: 100,

      // })
      .then(issuesResponseDecoder.parse)
      .catch((e) => {
        console.log(e);
        return Promise.reject(e);
      });
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