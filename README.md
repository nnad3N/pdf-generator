# PDF Generator

This is an example app in created using Next.js that allows you to generate dynamic PDF files from a HTML template.

## The Stack
- [Next.js](https://nextjs.org)
- [Lucia](https://lucia-auth.com)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Tests
- Unit: [Vitest](https://vitest.dev/)
- Component and E2E: [Cypress](https://www.cypress.io/)

The tests included in this repo are only for demonstration and should be extended/changed for production use.

## Misc
- You need to have [pnpm](https://pnpm.io/) installed on your system
- This repo uses local SQLite database
- You can login with `root@root.com` and `root` after seeding the database

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
