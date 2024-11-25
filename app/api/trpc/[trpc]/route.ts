import { appRouter } from "@/app/server/trpc";
import { createContext } from "@/app/server/trpc/context";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext,
  });
};

export { handler as GET, handler as POST };


