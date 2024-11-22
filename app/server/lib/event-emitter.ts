import { EventEmitter } from "stream";

export const eventEmitter = new EventEmitter();

export const EVENTS = {
  UPDATE: "update",
  NEW_MESSAGE: "newMessage",
  REACTION: "reaction",
};

export const emitEvent = (event: string, data: unknown) => {
  eventEmitter.emit(event, data);
};
