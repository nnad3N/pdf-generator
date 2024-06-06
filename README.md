# PDF Generator

This is an example app created using Next.js, that allows you to generate dynamic PDF files from a HTML template.

## The Stack

- [Next.js](https://nextjs.org)
- [Lucia](https://lucia-auth.com)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [shadcn/ui](https://ui.shadcn.com/)

## Tests

- Unit and Components: [Vitest](https://vitest.dev/)
- E2E: [Playwright](https://playwright.dev/)

The tests included in this repo are only for demonstration and should be extended/changed for production use.

## Misc

- You need to have [pnpm](https://pnpm.io/) installed on your system
- This repo uses local SQLite database, but you can use [Turso](https://turso.tech/) for production
- You can sign in with `root@root.com` and `root` after seeding the database

## Getting started

Remember to create a `.env.` file from `.env.example` before installation.

```
git clone https://github.com/nnad3N/pdf-generator.git
```

```
cd pdf-generator
```

```
pnpm i
```

```
pnpm db:push
```

```
pnpm db:seed
```

```
pnpm build
```

```
pnpm start
```
