import { ReactionType } from "@prisma/client";
import { prisma } from "../lib/prisma";


export const findChatrooms = () => {
  return prisma.chatroom.findMany({
    select: { id: true, name: true, userCount: true, createdAt: true },
  });
};

export const createRoomUser = (chatroomId: number, userId: number) => {
  return prisma.roomUser.create({
    data: { chatroomId, userId },
  });
};

export const updateUserCount = (chatroomId: number, increment: boolean) => {
  return prisma.chatroom.update({
    where: { id: chatroomId },
    data: { userCount: { [increment ? 'increment' : 'decrement']: 1 } },
  });
};

export const deleteRoomUser = (chatroomId: number, userId: number) => {
  return prisma.roomUser.delete({
    where: { chatroomId_userId: { chatroomId, userId } },
  });
};

export const createMessage = (chatroomId: number, userId: number, content: string) => {
  return prisma.message.create({
    data: { chatroomId, userId, content },
    include: { user: true },
  });
};

export const upsertReaction = (messageId: number, userId: number, type: ReactionType) => {
  return prisma.reaction.upsert({
    where: { messageId_userId: { messageId, userId } },
    update: { type },
    create: { messageId, userId, type },
  });
};

export const groupReactions = (messageId: number) => {
  return prisma.reaction.groupBy({
    by: ["type"],
    where: { messageId },
    _count: { _all: true },
  });
};

export const findMessages = (chatroomId: number) => {
  return prisma.message.findMany({
    where: { chatroomId },
    orderBy: { createdAt: 'asc' },
    include: { user: true },
  });
};

export const findRoomDetails = (chatroomId: number) => {
  return prisma.chatroom.findUnique({
    where: { id: chatroomId },
    include: { users: true },
  });
};
