import { Request } from 'express';
import { drizzle } from 'drizzle-orm/node-postgres';

export type TClient = ReturnType<typeof drizzle>;

export type TRefreshTokenProps = {
  userAgent?: string;
  ipAddress?: string;
};

export interface RequestWithUser extends Request {
  user?: {
    email: string;
  };
}
