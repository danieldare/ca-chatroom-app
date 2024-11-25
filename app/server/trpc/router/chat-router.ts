import { z } from "zod";
import {  authProcedure, router } from "../procedures";
import { observable } from "@trpc/server/observable";
import { eventEmitter, EVENTS, emitEvent } from "../../lib/event-emitter";
import {
  findChatrooms,
  createRoomUser,
  updateUserCount,
  deleteRoomUser,
  createMessage,
  upsertReaction,
  groupReactions,
  findMessages,
  findRoomDetails,
  findOnlineUsers,
} from "../../prisma/queries";

export const chatRouter = router({
  list: authProcedure.query(async () => {
    return findChatrooms();
  }),

  join: authProcedure
    .input(z.object({ chatroomId: z.number() }))
    .mutation(async ({ input,ctx }) => {
      const user = ctx.user
      await createRoomUser(input.chatroomId, user.id);
      await updateUserCount(input.chatroomId, true);
      emitEvent(EVENTS.USER_JOINED, { chatroomId: input.chatroomId, userId: input.userId });
      emitEvent(EVENTS.UPDATE, input.chatroomId);
      return { success: true };
    }),

  leave: authProcedure
    .input(z.object({ chatroomId: z.number(), userId: z.number() }))
    .mutation(async ({ input,ctx }) => {
      const user = ctx.user;
      await deleteRoomUser(input.chatroomId,  user.id);
      await updateUserCount(input.chatroomId, false);
      emitEvent(EVENTS.USER_LEFT, { chatroomId: input.chatroomId, userId:  ctx.user.id });
      emitEvent(EVENTS.UPDATE, input.chatroomId);
      return { success: true };
    }),

  sendMessage: authProcedure
    .input(z.object({ chatroomId: z.number(), userId: z.number(), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const message = await createMessage(input.chatroomId, ctx.user.id, input.content);
      emitEvent(EVENTS.NEW_MESSAGE, message);
      return message;
    }),

  reactToMessage: authProcedure
    .input(
      z.object({ messageId: z.number(), userId: z.number(), type: z.enum(["LIKE", "DISLIKE"]) }),
    )
    .mutation(async ({ input,ctx }) => {
      await upsertReaction(input.messageId, ctx.user.id, input.type);
      const newReactions = await groupReactions(input.messageId);
      emitEvent(EVENTS.REACTION, input.messageId);
      return newReactions;
    }),

  getMessages: authProcedure.input(z.object({ chatroomId: z.number() })).query(async ({ input }) => {
    return findMessages(input.chatroomId);
  }),

  getRoomDetails: authProcedure.input(z.object({ chatroomId: z.number() })).query(async ({ input }) => {
    const room = await findRoomDetails(input.chatroomId);
    if (!room) {
      throw new Error("Room not found");
    }
    return {
      id: room.id,
      name: room.name,
      userCount: room.userCount,
      users: room.users,
    };
  }),
  getOnlineUsers: authProcedure
    .input(z.object({ chatroomId: z.number() }))
    .query(async ({ input, ctx }) => {
      console.log("loggedInUserId",ctx.user)
      return findOnlineUsers(input.chatroomId, ctx.user.id);
    }),

  // Setup WebSocket subscriptions
  onUpdate: authProcedure.subscription(() => {
    return observable<string>((emit) => {
      eventEmitter.on(EVENTS.UPDATE, emit.next);
      return () => {
        eventEmitter.off(EVENTS.UPDATE, emit.next);
      };
    });
  }),

  onNewMessage: authProcedure.subscription(() => {
    return observable<unknown>((emit) => {
      eventEmitter.on(EVENTS.NEW_MESSAGE, emit.next);
      return () => {
        eventEmitter.off(EVENTS.NEW_MESSAGE, emit.next);
      };
    });
  }),

  onReaction: authProcedure.subscription(() => {
    return observable<unknown>((emit) => {
      eventEmitter.on(EVENTS.REACTION, emit.next);
      return () => {
        eventEmitter.off(EVENTS.REACTION, emit.next);
      };
    });
  }),

  onUserJoined: authProcedure.subscription(() => {
    return observable<unknown>((emit) => {
      eventEmitter.on(EVENTS.USER_JOINED, emit.next);
      return () => {
        eventEmitter.off(EVENTS.USER_JOINED, emit.next);
      };
    });
  }),

  onUserLeft: authProcedure.subscription(() => {
    return observable<unknown>((emit) => {
      eventEmitter.on(EVENTS.USER_LEFT, emit.next);
      return () => {
        eventEmitter.off(EVENTS.USER_LEFT, emit.next);
      };
    });
  }),
});
