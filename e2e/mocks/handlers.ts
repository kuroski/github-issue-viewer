import { rest } from 'msw'
const handlers = [
  // Handles a POST /login request
  rest.all('https://github.com*', (req, res, ctx) => {
    console.log({ req, res })
    return res(
      ctx.status(500),
      ctx.json({ error: 'Oops' })
    )
  }),
]

export default handlers
