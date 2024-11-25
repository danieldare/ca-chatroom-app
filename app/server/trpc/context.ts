import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { prisma } from "../lib/prisma";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { parse } from "cookie";

type ContextOptions = CreateNextContextOptions | CreateWSSContextFnOptions;

export type User = {
  username: string;
  id: string;
};

export async function createContext(opts: ContextOptions) {
  if ("readyState" in opts.res) {
    // WebSocket context
    return {
      prisma,
    };
  } else {
    let user: User | null = null;
    const { req, res } = opts;
    // HTTP request context
    if (req.headers.cookie) {
      const cookies = parse(req.headers.cookie);
      console.log("cookies",cookies)
      if (cookies.user) {
        user = JSON.parse(cookies.user);
      }
    }

    return {
      prisma,
      req,
      res,
      user,
    };
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>;
