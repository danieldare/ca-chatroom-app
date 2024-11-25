import { EventEmitter } from "stream";

export const eventEmitter = new EventEmitter();

export const EVENTS = {
  USER_JOINED: "userJoined",
  USER_LEFT: "userLeft",
  UPDATE: "update",
  NEW_MESSAGE: "newMessage",
  REACTION: "reaction",
};

export const emitEvent = (event: string, data: unknown) => {
  eventEmitter.emit(event, data);
};
