import { Message } from '@prisma/client';
import { create } from 'zustand';

// interface ChatState {
//   chatrooms: Array<{ id: number; name: string }>;
//   messages: Record<number, string[]>;
//   addMessage: (chatroomId: number, message: string) => void;
// }

// export const useChatStore = create<ChatState>((set) => ({
//   chatrooms: [],
//   messages: {},
//   addMessage: (chatroomId, message) =>
//     set((state) => ({
//       messages: {
//         ...state.messages,
//         [chatroomId]: [...(state.messages[chatroomId] || []), message],
//       },
//     })),
// }));


interface ChatState {
  messages: Record<number, Message[]>; 
  reactions: Record<number, { like: number; dislike: number }>;
  addMessage: (chatroomId: number, message: Message) => void;
  updateReactions: (
    messageId: number,
    reactions: { like: number; dislike: number }
  ) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: {},
  reactions: {},
  addMessage: (chatroomId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatroomId]: [...(state.messages[chatroomId] || []), message],
      },
    })),
  updateReactions: (messageId, reactions) =>
    set((state) => ({
      reactions: { ...state.reactions, [messageId]: reactions },
    })),
}));
