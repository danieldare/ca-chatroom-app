# Chatroom App

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It is a chatroom application that uses tRPC for API routes and WebSocket for real-time communication.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.

This project uses next/font to automatically optimize and load Geist, a new font family for Vercel.

Features
User Authentication: Users can sign in using a username. Authentication is managed using cookies.
Real-time Communication: WebSocket is used for real-time updates and messaging.
tRPC Integration: API routes are handled using tRPC.
Prisma ORM: Database interactions are managed using Prisma.

```
.
├── app
│   ├── (client)
│   │   ├── (protected)
│   │   │   └── chatrooms
│   │   │       ├── [id]
│   │   │       │   └── page.tsx
│   │   │       └── page.tsx
│   │   ├── (public)
│   │   │   └── sign-in
│   │   │       └── page.tsx
│   │   ├── store
│   │   │   ├── chat.ts
│   │   │   └── useUserStore.ts
│   │   └── globals.css
│   ├── api
│   │   └── trpc
│   │       └── [trpc]
│   │           └── route.ts
│   ├── server
│   │   ├── lib
│   │   │   ├── prisma.ts
│   │   │   └── query-client.ts
│   │   ├── middlewares
│   │   │   └── auth.ts
│   │   ├── prisma
│   │   │   ├── migrations
│   │   │   │   └── migration_lock.toml
│   │   │   ├── schema.prisma
│   │   │   ├── seed.ts
│   │   │   └── queries.tsx
│   │   ├── trpc
│   │   │   ├── context.ts
│   │   │   ├── index.ts
│   │   │   ├── procedures.ts
│   │   │   └── router
│   │   │       ├── chat-router.ts
│   │   │       └── user-router.ts
│   │   └── events
│   │       └── event-emitter.ts
│   └── page.tsx
├── [.env.example](http://_vscodecontentref_/0)
├── [package.json](http://_vscodecontentref_/1)
└── [README.md](http://_vscodecontentref_/2)
```

## Technologies Used
**Next.js**: A React framework for building server-side rendered and statically generated web applications.

**tRPC**: End-to-end typesafe APIs made easy.

**Prisma**: Next-generation ORM for Node.js and TypeScript.

**WebSocket**: A protocol for full-duplex communication channels over a single TCP connection.

**Zustand**: A small, fast, and scalable bearbones state-management solution using simplified flux principles.

**Tailwind CSS**: A utility-first CSS framework for rapid UI development.

**TypeScript**: A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.

## Environment Variables
Ensure you have the following environment variables set up in your .env file:


## How to Start the Project

**Install Dependencies**: Ensure you have all the necessary dependencies installed. Run the following command in the root directory of your project:

```
npm install
```


```
cp .env.example .env
```

```
npm run prisma:generate
```

```
npm run prisma:migrate
```


```
npm run seed
```

-----

```
npm run dev
```

```
npm run websocket:start
```
or 

```
npm run start:servers
```
------
