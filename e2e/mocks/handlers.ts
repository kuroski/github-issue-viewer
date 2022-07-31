import { generateMock } from '@anatine/zod-mock';
import { rest } from 'msw';
import snakecaseKeys from 'snakecase-keys';

import { issuesResponseDecoder } from '@/lib/decoders/issue';
import { orgsResponseDecoder } from '@/lib/decoders/org';
import { reposResponseDecoder } from '@/lib/decoders/repo';
import { dateFrom } from '@/lib/utils';

const snakeCaseObject = <T>(obj: T) => snakecaseKeys(obj, { deep: true })
const options = {
  stringMap: {
    created_at: () => dateFrom((new Date()).toISOString()).toString(),
    closed_at: () => dateFrom((new Date()).toISOString()).toString(),
    updated_at: () => dateFrom((new Date()).toISOString()).toString(),
  }
}
const handlers = [
  rest.get('https://api.github.com/user/issues', (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json(generateMock(issuesResponseDecoder.transform(snakeCaseObject), options))
  )),
  rest.get('https://api.github.com/user/orgs', (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json(generateMock(orgsResponseDecoder.transform(snakeCaseObject), options))
  )),
  rest.get('https://api.github.com/user/repos', (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json(generateMock(reposResponseDecoder.transform(snakeCaseObject), options))
  )),
]

export default handlers
