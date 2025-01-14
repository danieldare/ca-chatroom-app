
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';
import { appRouter } from '../trpc';
import { createContext } from '../trpc/context';


const port = 5000;;
const wss = new WebSocketServer({
  port,
});
const handler = applyWSSHandler({ wss, router: appRouter, createContext });

wss.on('connection', (ws) => {
  console.log(`Connection (${wss.clients.size})`);
  ws.once('close', () => {
    console.log(`Connection (${wss.clients.size})`);
  });
});
console.log('✅ WebSocket Server listening on ws://localhost:' + port);              

process.on('SIGTERM', () => {
  console.log('SIGTERM');
  handler.broadcastReconnectNotification();
  wss.close();
});
