import { rest } from 'msw'
import { setupServer } from 'msw/node'

const handlers = [
  rest.all('https://api.github.com*', (_req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ error: 'Oops' })
    )
  }),
]

const mockServer = setupServer(...handlers)
export default mockServer
