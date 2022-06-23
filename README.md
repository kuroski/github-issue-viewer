## Project template

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with some additions of common dependencies and configuration to start a new project.

I was a bit tired on having to install the same dependencies or comming up with some "base" for authentication/routing/etc, so this template is an all-in-one repo to quickly bootstrap projects.

Within this template you have:

- [chakra](https://chakra-ui.com/) as component UI framework
- [trpc](https://trpc.io/) e2e solution to handle API requests safely + it integrates with [react-query](https://react-query.tanstack.com/) to handle requests
- [zod](https://github.com/colinhacks/zod) schema validation with static type inference [[1]](https://medium.com/homeday/confident-js-series-part-1-encoding-and-decoding-payloads-for-saner-applications-814d03608926)
- [fp-ts](https://github.com/gcanti/fp-ts) our "utility library" to help us handle some things in a more "functional way"
- [tanstack table](https://tanstack.com/table/v8) library to help us handle tables
- [react-hook-form](https://react-hook-form.com/) to help us handle forms + validation [[1]](https://tkdodo.eu/blog/react-query-and-forms)
- [prisma](https://www.prisma.io/) our ORM + seeders + authentication + protected routes are already there + zod integration + docker-compose in place for dev database
  - [next-auth](https://next-auth.js.org/) to handle authentication
- [envsafe](https://github.com/KATT/envsafe) to make sure you don't accidentally deploy apps with missing or invalid environment variables
- [next-translate](https://github.com/vinissimus/next-translate) i18n solution
- eslint is already there
- some examples of common things you usually have to do
  - form + validation + mutations
  - protected routes + routes with simple role validation
  - dark/light mode
- `TODO:` testing environmnet set up + mock server for integration tests

## Getting Started

First, run the development server:

```bash
pnpm i

cp .env.sample .env # and add the missing variables
docker-compose up -d

pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Notes

### Auth config

Open up `lib/auth.ts` and go nuts with [next-auth](https://next-auth.js.org/) configuration

### Customise themes

Open up `lib/theme.ts` and go nuts with [chakra](https://chakra-ui.com/docs/styled-system/customize-theme) configuration

### i18n

I'm following the defaults of [next-translate](https://github.com/vinissimus/next-translate), so just follow they're guide

### Layouts

While we wayt for [Next Layouts rfc](https://nextjs.org/blog/layouts-rfc)...

If you have a common layout, just add to the `/layouts` folder and wrap your with your `pages` components

### ORM

I'm using [prisma](https://www.prisma.io/) here, no customisation, just change the schema, follow they're documentation and you are good to go.

### tRPC

I like strong typing, and usually I would use a combination with `next-connect` + `fp-ts` + `io-ts` + `react-query`, but `tRPC` is a cool solution that despite not being so "FP-hardcore", it is very cool on how much you can achieve with that.

I actually don't customize anything from they're guide, so if you [read them](https://trpc.io/docs/nextjs) you should be at home

Everything is within `/server` folder and `/lib/trpc.ts` file.

If you need new routes, just create a new file within `/server/routers/product.ts`

```typescript
import { Prisma } from "@prisma/client";
import { createRouter } from "@/server/create-router";
import { createProtectedRouter } from "@/server/create-protected-router";
import { z } from "zod";

const productRoute = createRouter()
  .query("list", {
    input: z.object({
      name: z.string().nullish(),
    }),
    resolve: async ({ input, ctx }) => {
      const where: Prisma.ProductWhereInput = {
        name: {
          contains: input?.name ?? undefined,
        },
      };

      const [products, productCount] = await Promise.all([
        ctx.prisma.product.findMany({
          where,
        }),
        ctx.prisma.product.count({ where }),
      ]);

      return {
        products,
        productCount,
      };
    },
  })
  // if you want protected routes
  .merge(
    "admin.",
    createProtectedRouter().mutation("create", {
      input: z.object({
        name: z.string().min(1),
        description: z.string().min(1),
      }),
      resolve: async ({ ctx, input }) => {
        const product = await ctx.prisma.product.create({
          data: {
            name: input.name,
            description: input.description,
          },
        });

        return product;
      },
    })
  );

export default productRoute;
```

Connect it to the main router

```ts
// server/routers/_app.ts
import superjson from "superjson";

import { createRouter } from "@/server/create-router";
import healthRoute from "@/server/routers/health";
import productRoute from "@/server/routers/product";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("health.", healthRoute)
  .merge("product.", productRoute);

export type AppRouter = typeof appRouter;
```

And then use it:

```tsx
const Home: NextPageWithAuth = () => {
  const [query, setQuery] = useQueryParams({
    name: StringParam,
  });

  const productQuery = trpc.useQuery(["product.list", { ...query }]);

  // ... from now on just follow the flow https://trpc.io/docs/nextjs#6-make-api-requests
};
```

## Custom features

### Paths

Since I'm using TS, you can directly import files through an alias instead of relative path

`@/` maps to `<project_root>/`

### Logger

I installed [pino](https://github.com/pinojs/pino) as a logger tool which is what is recommended within [next.js documentation](https://nextjs.org/docs/going-to-production#logging)

Just import `/lib/pino.ts` and use it

### Protected routes

By opening `/lib/types.ts` you'll see `NextPageWithAuth`, this is a special type you can give to your `pages` components to include automatic authentication validation.

I could rely on `next-auth` middlewares, but I don't want to, I would have to enable `JWT` option and it seemed straightforward to just solve this in the component layer... that would work for simple projects.

You can check the examples of `/pages/only-admin.tsx` or `/pages/private.tsx` files, the system is raw and simple:

```tsx
import NextLink from "next/link";
import { NextPageWithAuth } from "@/lib/types";

const Private: NextPageWithAuth = () => {
  return <div>This is a private route</div>;
};

Private.auth = true; // just add this property and 🪄

export default Private;
```

If you need to validate roles, I have added a **very naive and simple role system** since most times I just needed regular/admin users, then:

```tsx
import NextLink from "next/link";
import { NextPageWithAuth } from "@/lib/types";

const Private: NextPageWithAuth = () => {
  return <div>This is a private route</div>;
};

Private.auth = {
  can: ["ADMIN"],
}; // just add this property and 🪄

export default Private;
```

TS will help you out there =D

To understand better how that works, check `/pages/_app.tsx`, this is just a HoC that checks for that `auth` property and render a component that checks for authenticated users 😉.

### Utils

Well... `/lib/utils.ts` is slim, I just have a function to show a "placeholder image" and to `slugify` some text, no real reason on why only those two, usually I end up needing that every time 😅

### Components

- `/components/FieldErrors.tsx` is a component that... display field errors, just send an `react-hook-form` error variable and it will handle it (please add the remaining validations/translations if you need)
- `/components/FormSection.tsx` I like [Laravel Jetstream](https://jetstream.laravel.com/2.x/features/profile-management.html) way on handling forms, so this component just represents a section of a form where you can provide a `title` and `description` on what that section is
- `/components/Header.tsx` ... is the header of the app, light/dark mode toggle button + user auth login/logout link are there

## Why I'm not using all dependencies?

I'm not providing an example with everything, I just need/want eventually handle some operations and I will use `fp-ts` for example for some things... I just want to already have some dependencies I use by default.

## PS

I know, **its a lot of dependencies and config**, JS/TS world is insane, but yeah, I could build a project with just Next.js or plain JS, go on with Solid/Svelte/etc or go to Laravel not worry with anything 😂 ... I could build something strict [[1]](https://github.com/kuroski/hackernews) [[2]](https://github.com/kuroski/expense-jar-next) but until now, this template contains everything you'll probably need (and more) for most projects and it's free, spin up Vercel or Railway, provision a database (maybe with Planetscale) and pay nothing, which is amazing.

> Still... It wouldn't be as good as [Elm](https://elm-lang.org/) [[1]](https://elm.land/) 🥲
>
> "sdds Elm", right Sunsi?

![Image: It ain't much, but it's honest work](https://i.kym-cdn.com/entries/icons/mobile/000/028/021/work.jpg)
