import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../lib/prisma';

type CreateContextOptions = {
  req: NextApiRequest;
  res: NextApiResponse;
};

export function createContext(opts: CreateContextOptions | CreateWSSContextFnOptions) {
  if ('req' in opts && 'res' in opts) {
    // HTTP request context
    const { req, res } = opts;
    return {
      prisma,
      req,
      res,
    };
  } else {
    // WebSocket context
    return {
      prisma,
    };
  }
}

export type Context = ReturnType<typeof createContext>;
