import { router } from "./init";
import { chatRouter } from "./router/chat-router";
import { userRouter } from "./router/user-router";

export const appRouter = router({
  user: userRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
