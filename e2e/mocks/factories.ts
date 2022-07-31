import { generateMock } from '@anatine/zod-mock';
import fs from "node:fs"
import path from "node:path"
import snakecaseKeys from 'snakecase-keys';
import { z } from 'zod';

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

const githubIssuesDecoder = issuesResponseDecoder.transform(snakeCaseObject)
const githubOrgsDecoder = orgsResponseDecoder.transform(snakeCaseObject)
const githubReposDecoder = reposResponseDecoder.transform(snakeCaseObject)


class Factories {
  private static instance: Factories
  #issues: z.TypeOf<typeof githubIssuesDecoder>
  #orgs: z.TypeOf<typeof githubOrgsDecoder>
  #repos: z.TypeOf<typeof githubReposDecoder>

  private constructor() {
    this.#issues = generateMock(githubIssuesDecoder, options)
    this.#orgs = generateMock(githubOrgsDecoder, options)
    this.#repos = generateMock(githubReposDecoder, options)

    fs.writeFile(
      path.resolve(__dirname, './_snapshots/issues.json'),
      JSON.stringify(this.#issues),
      (err) => {
        if (err) throw new Error(err.message)
      })

    fs.writeFile(
      path.resolve(__dirname, './_snapshots/orgs.json'),
      JSON.stringify(this.#orgs),
      (err) => {
        if (err) throw new Error(err.message)
      })

    fs.writeFile(
      path.resolve(__dirname, './_snapshots/repos.json'),
      JSON.stringify(this.#repos),
      (err) => {
        if (err) throw new Error(err.message)
      })
  }

  public static getInstance(): Factories {
    if (!Factories.instance) {
      Factories.instance = new Factories();
    }

    return Factories.instance;
  }

  get issues() {
    return this.#issues
  }

  get orgs() {
    return this.#orgs
  }

  get repos() {
    return this.#repos
  }
}

export default Factories

