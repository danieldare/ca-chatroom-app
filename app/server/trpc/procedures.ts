import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";
import { User } from "@prisma/client";
import { cookies } from "next/headers";

const t = initTRPC.context<Context>().create();

export const router = t.router;

export const isAuthenticated = t.middleware(async (opts) => {
 const userCookie =  (await cookies()).get("user");
 const user: User =  JSON.parse(userCookie?.value || "{}")

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
