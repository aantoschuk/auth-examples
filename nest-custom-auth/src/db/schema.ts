import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
});

export const refreshTokenTable = pgTable('refresh_token', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userEmail: varchar()
    .notNull()
    .references(() => usersTable.email),
  hash: text().notNull(),
  created_at: timestamp().notNull(),
  expires_at: timestamp().notNull(),
  userAgent: text(),
  ipAddress: text(),
  revoked: boolean().default(false),
});
