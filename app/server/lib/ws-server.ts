import { WebSocketServer, WebSocket, Data } from "ws";
import { prisma } from "./prisma";
import { OnlineUsersMessage } from "@/app/types";

class WebSocketManager {
  private static instance: WebSocketManager;
  public wss: WebSocketServer;
  private clients: Map<number, Set<WebSocket>>;
  private users: Map<number, Set<number>>;

  private constructor(port: number) {
    this.wss = new WebSocketServer({ port });
    this.clients = new Map();
    this.users = new Map();
    this.setupConnectionHandler();
  }

  public static getInstance(port: number = 8080): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager(port);
    }
    return WebSocketManager.instance;
  }

  private setupConnectionHandler() {
    this.wss.on("connection", (ws) => {
      console.log("Client connected");

      ws.on("message", (message) => this.handleMessage(ws, message));
      ws.on("close", () => this.handleClose(ws));
    });
  }

  private async handleMessage(ws: WebSocket, message: Data) {
    const { chatroomId, userId, content, type } = JSON.parse(message.toString());

    if (!this.clients.has(chatroomId)) {
      this.clients.set(chatroomId, new Set());
    }
    this.clients.get(chatroomId)?.add(ws);

    if (!this.users.has(chatroomId)) {
      this.users.set(chatroomId, new Set());
    }

    if (type === "join") {
      this.users.get(chatroomId)?.add(userId);
      this.broadcastMessage(chatroomId, {
        type: "join",
        userId,
      });
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const systemMessage = {
          type: 'system',
          content: `${user.username} just joined the chatroom.`,
        };
        this.broadcastMessage(chatroomId,systemMessage);
      }
      this.broadcastOnlineUsers(chatroomId);
    } else if (type === "leave") {
      this.users.get(chatroomId)?.delete(userId);
      this.broadcastMessage(chatroomId, {
        type: "leave",
        userId,
      });
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const systemMessage = {
          type: 'system',
          content: `${user.username} just left the chatroom.`,
        };
        this.broadcastMessage(chatroomId,systemMessage);
      }
      this.broadcastOnlineUsers(chatroomId);
    } else if (type === "message") {
      const savedMessage = await prisma.message.create({
        data: { chatroomId, userId, content },
      });

      this.broadcastMessage(chatroomId, {
        type: "message",
        chatroomId,
        userId,
        content,
        id: savedMessage.id,
        createdAt: savedMessage.createdAt,
      });
    }
  }

  private handleClose(ws: WebSocket) {
    this.clients.forEach((clients, chatroomId) => {
      if (clients.has(ws)) {
        clients.delete(ws);
        if (clients.size === 0) {
          this.clients.delete(chatroomId);
        }
      }
    });
    console.log("Client disconnected");
  }

  private broadcastMessage(chatroomId: number, message: any) {
    const clients = this.clients.get(chatroomId);
    if (clients) {
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }
  }

  private async broadcastOnlineUsers(chatroomId: number) {
    const userIds = Array.from(this.users.get(chatroomId) || []);

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, username: true },
    });

    const message: OnlineUsersMessage = {
      type: "onlineUsers",
      users,
    };
    this.broadcastMessage(chatroomId, message);
  }

  public broadcastUpdate(chatroomId: number) {
    prisma.chatroom
      .findUnique({
        where: { id: chatroomId },
        select: { id: true, userCount: true },
      })
      .then((chatroom) => {
        if (chatroom) {
          this.broadcastMessage(chatroomId, {
            type: "update",
            data: chatroom,
          });
        }
      });
  }
}

const wsManager = WebSocketManager.getInstance();
console.log("WebSocket server is running on ws://localhost:8080");

export { wsManager };
