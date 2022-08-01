import { generateMock } from '@anatine/zod-mock';
import { pipe } from 'fp-ts/lib/function';
import fs from 'node:fs';
import path from "node:path"
import snakecaseKeys from 'snakecase-keys';
import { z } from 'zod';

import { issuesResponseDecoder } from '@/lib/decoders/issue';
import { orgsResponseDecoder } from '@/lib/decoders/org';
import { reposResponseDecoder } from '@/lib/decoders/repo';
import { dateFrom } from '@/lib/utils';

function mockFor<T extends z.ZodTypeAny>(decoder: T): snakecaseKeys.SnakeCaseKeys<z.TypeOf<T>> {
  const options = {
    stringMap: {
      created_at: () => dateFrom((new Date()).toISOString()).toString(),
      closed_at: () => dateFrom((new Date()).toISOString()).toString(),
      updated_at: () => dateFrom((new Date()).toISOString()).toString(),
    }
  }
  return generateMock(decoder.transform((d) => snakecaseKeys(d, { deep: true })), options)
}

function Factory<T extends z.ZodTypeAny>(filename: string, decoder: T): snakecaseKeys.SnakeCaseKeys<z.TypeOf<T>> {
  const filePath = `${__dirname}/_snapshots/${filename}`
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })

    const content = mockFor(decoder)
    fs.writeFileSync(filePath, JSON.stringify({ data: content }), 'utf-8')
    return content
  }

  return pipe(
    fs.readFileSync(filePath, 'utf-8'),
    JSON.parse,
    decoder.transform((d) => snakecaseKeys(d, { deep: true })).parse
  )
}

function Factories() {
  const issues = Factory('issues.json', issuesResponseDecoder)
  const repos = Factory('repos.json', reposResponseDecoder)
  const orgs = Factory('orgs.json', orgsResponseDecoder)

  return {
    issues,
    repos,
    orgs
  }
}

export default Factories

