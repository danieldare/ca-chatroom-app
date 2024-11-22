import { z } from "zod";
import { procedure, router } from "../init";
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
  findRoomDetails
} from "../../prisma/queries";

export const chatRouter = router({
  list: procedure.query(async () => {
    return findChatrooms();
  }),

  join: procedure
    .input(z.object({ chatroomId: z.number(), userId: z.number() }))
    .mutation(async ({ input }) => {
      await createRoomUser(input.chatroomId, input.userId);
      await updateUserCount(input.chatroomId, true);
      emitEvent(EVENTS.UPDATE, input.chatroomId);
      return { success: true };
    }),

  leave: procedure
    .input(z.object({ chatroomId: z.number(), userId: z.number() }))
    .mutation(async ({ input }) => {
      await deleteRoomUser(input.chatroomId, input.userId);
      await updateUserCount(input.chatroomId, false);
      emitEvent(EVENTS.UPDATE, input.chatroomId);
      return { success: true };
    }),

  sendMessage: procedure
    .input(z.object({ chatroomId: z.number(), userId: z.number(), content: z.string() }))
    .mutation(async ({ input }) => {
      const message = await createMessage(input.chatroomId, input.userId, input.content);
      emitEvent(EVENTS.NEW_MESSAGE, message);
      return message;
    }),

  reactToMessage: procedure
    .input(z.object({ messageId: z.number(), userId: z.number(), type: z.enum(["LIKE", "DISLIKE"]) }))
    .mutation(async ({ input }) => {
      await upsertReaction(input.messageId, input.userId, input.type);
      const newReactions = await groupReactions(input.messageId);
      emitEvent(EVENTS.REACTION, input.messageId);
      return newReactions;
    }),

  getMessages: procedure
    .input(z.object({ chatroomId: z.number() }))
    .query(async ({ input }) => {
      return findMessages(input.chatroomId);
    }),

  getRoomDetails: procedure
    .input(z.object({ chatroomId: z.number() }))
    .query(async ({ input }) => {
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

  // Setup WebSocket subscriptions
  onUpdate: procedure.subscription(() => {
    return observable<string>((emit) => {
      eventEmitter.on(EVENTS.UPDATE, emit.next);
      return () => {
        eventEmitter.off(EVENTS.UPDATE, emit.next);
      };
    });
  }),

  onNewMessage: procedure.subscription(() => {
    return observable<unknown>((emit) => {
      eventEmitter.on(EVENTS.NEW_MESSAGE, emit.next);
      return () => {
        eventEmitter.off(EVENTS.NEW_MESSAGE, emit.next);
      };
    });
  }),

  onReaction: procedure.subscription(() => {
    return observable<unknown>((emit) => {
      eventEmitter.on(EVENTS.REACTION, emit.next);
      return () => {
        eventEmitter.off(EVENTS.REACTION, emit.next);
      };
    });
  }),
});
