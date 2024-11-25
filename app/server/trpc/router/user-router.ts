import { z } from "zod";

import {  publicProcedure, router } from "../procedures";
import { prisma } from "../../lib/prisma";
import { cookies } from 'next/headers';


export const userInputSchema = z.object({
  username: z.string().min(1, { message: "username is required" }),
});

export type userInput = z.infer<typeof userInputSchema>;

export const userRouter = router({
  signIn: publicProcedure.input(userInputSchema).mutation(async ({ input }) => {
    try {
      const user = await prisma.user.upsert({
        where: { username: input.username },
        update: {},
        create: { username: input.username },
      });

      (await cookies()).set("user", JSON.stringify({ id: user.id, username: user.username }) )

      return user;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during sign-in:", error);
        throw new Error(error.message || "Internal Server Error");
      }
    }
  }),
});
