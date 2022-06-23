import { Octokit } from "octokit";

function bootstrap(token: string) {
  return new Octokit({
    auth: token,
  });
}

export default bootstrap;
