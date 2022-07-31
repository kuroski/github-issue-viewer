import { rest } from 'msw';

import Factories from '@/e2e/mocks/factories';

const handlers = [
  rest.get('https://api.github.com/user/issues', (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json(Factories.getInstance().issues)
  )),
  rest.get('https://api.github.com/user/orgs', (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json(Factories.getInstance().orgs)
  )),
  rest.get('https://api.github.com/user/repos', (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json(Factories.getInstance().repos)
  )),
]

export default handlers
