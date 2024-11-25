import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { parse } from "cookie";

type ContextOptions = CreateNextContextOptions;

export type User = {
  username: string;
  id: string;
};

export async function createContext(opts: ContextOptions) {
  if (opts.req.headers["sec-websocket-key"]) {
    return {
      ...opts,
    };
  } else {
    let user: User | null = null;
    if (opts.req.headers.cookie) {
      const cookies = parse(opts.req.headers.cookie);
      if (cookies.user) {
        user = JSON.parse(cookies.user);
      }
    }
    return {
      user,
      req: opts.req,
      res: opts.res,
    };
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>;
