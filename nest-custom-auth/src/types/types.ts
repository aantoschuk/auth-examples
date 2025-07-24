import { drizzle } from 'drizzle-orm/node-postgres';

export type TClient = ReturnType<typeof drizzle>;
