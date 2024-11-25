import { z } from "zod";
import { serialize } from "cookie";
import {  publicProcedure, router } from "../procedures";
import { prisma } from "../../lib/prisma";

export const userInputSchema = z.object({
  username: z.string().min(1, { message: "username is required" }),
});

export type userInput = z.infer<typeof userInputSchema>;

export const userRouter = router({
  signIn: publicProcedure.input(userInputSchema).mutation(async ({ input, ctx }) => {
    try {
      const user = await prisma.user.upsert({
        where: { username: input.username },
        update: {},
        create: { username: input.username },
      });

      const cookie = serialize("user", JSON.stringify({ id: user.id, username: user.username }), {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 5 * 60 * 60, // 5 hrs
      });

      if (ctx.res) {
        ctx.res.setHeader("Set-Cookie", cookie);
      }

      return user;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during sign-in:", error);
        throw new Error(error.message || "Internal Server Error");
      }
    }
  }),
});
