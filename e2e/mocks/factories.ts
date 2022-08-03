import { generateMock } from '@anatine/zod-mock';
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys';
import { z } from 'zod';

import { issuesResponseDecoder } from '@/lib/decoders/issue';
import { orgsResponseDecoder } from '@/lib/decoders/org';
import { reposResponseDecoder } from '@/lib/decoders/repo';

function mockFor<T extends z.ZodType>(decoder: T): SnakeCaseKeys<z.TypeOf<T>> {
  const dateFn = () => (new Date()).toISOString()
  const options = {
    stringMap: {
      created_at: dateFn,
      closed_at: dateFn,
      updated_at: dateFn,
    }
  }
  return generateMock(decoder.transform((d) => snakecaseKeys(d, { deep: true })), options)
}

function factory<T extends z.ZodType>(decoder: T) {
  let current = mockFor(decoder)

  return {
    current,
  }
}

const Factories = {
  issues: factory(issuesResponseDecoder),
  repos: factory(reposResponseDecoder),
  orgs: factory(orgsResponseDecoder)
}

export default Factories

