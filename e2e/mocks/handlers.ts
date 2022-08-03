import { rest } from 'msw';

import Factories from '@/e2e/mocks/factories';

const handlers = [
  rest.get('https://api.github.com/user/issues', (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json(Factories.issues.current)
  )),
  rest.get('https://api.github.com/user/orgs', (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json(Factories.orgs.current)
  )),
  rest.get('https://api.github.com/user/repos', (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json(Factories.repos.current)
  )),
]

export default handlers
