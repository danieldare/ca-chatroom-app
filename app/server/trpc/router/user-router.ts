import { z } from "zod";
import { serialize } from "cookie";
import { procedure, router } from "../init";
import { prisma } from "../../lib/prisma";

export const userInputSchema = z.object({
  username: z.string().min(1, { message: "username is required" }),
});

export type userInput = z.infer<typeof userInputSchema>;

export const userRouter = router({
  signIn: procedure.input(userInputSchema).mutation(async ({ input, ctx: { req } }) => {
    try {
      const user = await prisma.user.upsert({
        where: { username: input.username },
        update: {},
        create: { username: input.username },
      });

      const cookie = serialize('user', JSON.stringify({ id: user.id, username: user.username }), {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60, // 1 hr
      });

      if (req && req.headers) {
        req.headers.cookie = cookie;
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
