import { faker } from '@faker-js/faker';
import { factory, manyOf, nullable, oneOf, primaryKey } from '@mswjs/data';
import type { ENTITY_TYPE, PRIMARY_KEY } from "@mswjs/data/lib/glossary";
import { rest } from 'msw';

export const db = factory({
  label: {
    id: primaryKey(faker.datatype.number),
    url: faker.internet.url,
    name: faker.random.words,
    description: nullable(faker.hacker.phrase),
    color: faker.internet.color,
  },
  assignee: {
    id: primaryKey(faker.datatype.number),
    url: faker.internet.url,
    login: faker.internet.userName,
    html_url: faker.internet.url,
    avatar_url: faker.internet.avatar,
    gravatar_id: faker.datatype.uuid,
  },
  pullRequest: {
    id: primaryKey(faker.datatype.number),
    url: faker.internet.url,
    html_url: faker.internet.url,
  },
  repository: {
    id: primaryKey(faker.datatype.number),
    name: faker.random.words,
    full_name: faker.random.words,
    description: nullable(faker.hacker.phrase),
    html_url: faker.internet.url,
    private: faker.datatype.boolean,
    visibility: nullable(() => faker.helpers.arrayElement<'all' | 'public' | 'private'>(['all', 'public', 'private'])),
  },
  issue: {
    number: faker.datatype.number,
    id: primaryKey(faker.datatype.number),
    html_url: faker.internet.url,
    url: faker.internet.url,
    repository_url: faker.internet.url,
    state: () => faker.helpers.arrayElement<'open' | 'closed'>(["open", "closed"]),
    title: faker.random.words,
    body: nullable(faker.hacker.phrase),
    user: {
      id: faker.datatype.number,
      url: faker.internet.url,
      login: faker.internet.userName,
      html_url: faker.internet.url,
      avatar_url: faker.internet.avatar,
      gravatar_id: faker.datatype.uuid,
    },
    labels: manyOf('label'),
    assignees: manyOf('assignee'),
    comments: faker.datatype.number,
    pull_request: nullable(oneOf('pullRequest')),
    closed_at: nullable(() => faker.date.recent().getTime()),
    created_at: () => faker.date.recent().getTime(),
    updated_at: () => faker.date.recent().getTime(),
    repository: oneOf('repository', { nullable: false }),
    timeline_url: faker.internet.url,
  },
  repo: {
    id: primaryKey(faker.datatype.number),
    full_name: faker.random.words,
    description: nullable(faker.hacker.phrase),
    url: faker.internet.url,
  },
  org: {
    id: primaryKey(faker.datatype.number),
    login: faker.internet.userName,
    description: nullable(faker.hacker.phrase),
    avatar_url: faker.internet.avatar,
  }
})
type DB = typeof db;

export type FactoryValue<Key extends keyof DB> = Omit<
  ReturnType<DB[Key]['create']>,
  typeof ENTITY_TYPE | typeof PRIMARY_KEY
>;

export const issuesHandler = () =>
  rest.get('https://api.github.com/user/issues', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        db.issue.create({
          state: 'open',
          repository: db.repository.create(),
          pull_request: db.pullRequest.create(),
          assignees: [...Array(3)].map(db.assignee.create),
          labels: [],
        }),
        db.issue.create({
          state: 'open',
          repository: db.repository.create(),
          pull_request: null,
          assignees: [],
          labels: [],
        }),
        db.issue.create({
          state: 'closed',
          repository: db.repository.create(),
          pull_request: db.pullRequest.create(),
          assignees: [...Array(3)].map(db.assignee.create),
          labels: [],
        }),
        db.issue.create({
          state: 'closed',
          repository: db.repository.create(),
          pull_request: null,
          assignees: [],
          labels: [],
        }),
      ])
    )
  })

const handlers = [
  issuesHandler(),
  rest.get('https://api.github.com/user/orgs', (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json([...Array(5)].map(db.org.create))
  )),
  rest.get('https://api.github.com/user/repos', (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json([...Array(5)].map(db.repo.create))
  )),
]

export default handlers
