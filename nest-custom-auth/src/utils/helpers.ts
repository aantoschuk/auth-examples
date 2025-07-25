import { and, desc, eq, gt } from 'drizzle-orm';

import { TClient } from '../types/types';
import { refreshTokenTable } from '../db/schema';

export const getRefreshTokensFromDB = async (db: TClient, email: string) => {
  const tokens = await db
    .select()
    .from(refreshTokenTable)
    .where(
      and(
        eq(refreshTokenTable.userEmail, email),
        eq(refreshTokenTable.revoked, false),
        gt(refreshTokenTable.expires_at, new Date()),
      ),
    )
    .orderBy(desc(refreshTokenTable.created_at));

  return tokens;
};
