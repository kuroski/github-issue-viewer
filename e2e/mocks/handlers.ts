import { faker } from '@faker-js/faker';
import { factory, manyOf, nullable, oneOf, primaryKey } from '@mswjs/data'
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
    visibility: nullable(() => faker.helpers.arrayElement(['all', 'public', 'private'])),
  },
  issue: {
    number: faker.datatype.number,
    id: primaryKey(faker.datatype.number),
    html_url: faker.internet.url,
    url: faker.internet.url,
    repository_url: faker.internet.url,
    state: () => faker.helpers.arrayElement(["open", "closed"]),
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

export const issuesHandler = () =>
  rest.get('https://api.github.com/user/issues', (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json([
      db.issue.create({
        repository: db.repository.create(),
        labels: [db.label.create(), db.label.create(), db.label.create(), db.label.create()],
        assignees: [db.assignee.create()],
      }),
      db.issue.create({
        repository: db.repository.create(),
        labels: [db.label.create(), db.label.create(), db.label.create(), db.label.create()],
        assignees: [db.assignee.create()],
      }),
      db.issue.create({
        repository: db.repository.create(),
        labels: [db.label.create(), db.label.create(), db.label.create(), db.label.create()],
        assignees: [db.assignee.create()],
      }),
      db.issue.create({
        repository: db.repository.create(),
        labels: [db.label.create(), db.label.create(), db.label.create(), db.label.create()],
        assignees: [db.assignee.create()],
      }),
      db.issue.create({
        repository: db.repository.create(),
        labels: [db.label.create(), db.label.create(), db.label.create(), db.label.create()],
        assignees: [db.assignee.create()],
      }),
    ])
  ))

const handlers = [
  issuesHandler(),
  rest.get('https://api.github.com/user/orgs', (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json([
      db.org.create(),
      db.org.create(),
      db.org.create(),
      db.org.create(),
      db.org.create()
    ])
  )),
  rest.get('https://api.github.com/user/repos', (_req, res, ctx) => res(
    ctx.status(200),
    ctx.json([
      db.repo.create(),
      db.repo.create(),
      db.repo.create(),
      db.repo.create(),
      db.repo.create()
    ])
  )),
]

export default handlers
