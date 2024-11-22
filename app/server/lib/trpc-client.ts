import { createTRPCReact, createWSClient, httpBatchLink, wsLink, splitLink } from "@trpc/react-query";
import { AppRouter } from "../trpc";


export const trpc = createTRPCReact<AppRouter>();

const wsClient = createWSClient({
  url: "ws://localhost:8080",
});

export const trpcClient = trpc.createClient({
  links: [
    splitLink({
      condition(op) {
        return op.type === 'subscription';
      },
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: "/api/trpc",
      }),
    }),
  ],
});
