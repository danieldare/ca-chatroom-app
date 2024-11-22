export interface Message {
  type: "message";
  chatroomId: number;
  userId: number;
  username: string;
  user: {
    username: string;
  };
  content: string;
  createdAt: string;
}

export interface OnlineUsersMessage {
  type: "onlineUsers";
  users: {
    id: number;
    username: string;
  }[];
}

export interface SystemMessage {
  type: "system";
  content: string;
}
