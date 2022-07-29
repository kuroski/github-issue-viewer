import { generateMock } from '@anatine/zod-mock';
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { issuesResponseDecoder } from '@/lib/decoders/issue';

const handlers = [
  // rest.all('https://api.github.com*', (_req, res, ctx) => {
  //   return res(
  //     ctx.status(500),
  //     ctx.json({ error: 'Oops' })
  //   )
  // }),

  rest.get('https://api.github.com/user/issues', (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json(generateMock(issuesResponseDecoder))
  ))
]

const mockServer = setupServer(...handlers)
export default mockServer
