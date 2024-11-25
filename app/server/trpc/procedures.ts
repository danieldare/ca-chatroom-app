import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";
import { parse } from "cookie";
import { User } from "@prisma/client";

const t = initTRPC.context<Context>().create();

export const router = t.router;

export const isAuthenticated = t.middleware((opts) => {
  let user: User | null = null;

  const req = opts.ctx.req;

  if (req?.headers.cookie) {
    const cookies = parse(req.headers.cookie);
    if (cookies.user) {
      user = JSON.parse(cookies.user);
    }
  }

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      user,
    },
  });
});

export const authProcedure = t.procedure.use(isAuthenticated);
export const publicProcedure = t.procedure;
