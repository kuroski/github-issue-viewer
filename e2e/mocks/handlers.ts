import { rest } from 'msw';

import Factories from '@/e2e/mocks/factories';

const {
  issues,
  orgs,
  repos
} = Factories()

const handlers = [
  rest.get('https://api.github.com/user/issues', (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json(issues)
  )),
  rest.get('https://api.github.com/user/orgs', (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json(orgs)
  )),
  rest.get('https://api.github.com/user/repos', (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json(repos)
  )),
]

export default handlers
