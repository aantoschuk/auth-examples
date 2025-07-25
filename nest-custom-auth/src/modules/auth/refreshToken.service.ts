import Redis from 'ioredis';
import { eq } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';

import { DBService } from '../database/db.service';
import { getRefreshTokensFromDB } from '../../utils/helpers';
import { generateRefreshToken, verifyRefreshToken } from '../../utils/auth';

import { TClient } from '../../types/types';
import { refreshTokenTable } from '../../db/schema';
import { CreateRefreshTokenDTO } from './dto/auth.dto';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly dbService: DBService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async create(
    createDto: Omit<CreateRefreshTokenDTO, 'createdAt' | 'expiresAt' | 'hash'>,
  ) {
    const { hash, rawToken } = await generateRefreshToken();

    const now = new Date();
    // access token lives whole week
    const expires = new Date(now.getTime() + 1000 * 60 * 60 * 25 * 7);

    const token = {
      ...createDto,
      created_at: now,
      expires_at: expires,
      hash,
    };

    const db = this.dbService.getDB();
    db.insert(refreshTokenTable).values(token);

    this.storeTokenInRedis(rawToken, createDto.userEmail);

    // revoke acccess tokens user exeec the limit
    await this.revokeOldTokens(createDto.userEmail, db);

    return { rawToken };
  }

  async validate(email: string, rawToken: string) {
    const cached = await this.redis.get(`refresh:${rawToken}`);

    if (cached) {
      const data = JSON.parse(cached);
      if (data.email === email) return data;
    }

    const db = this.dbService.getDB();
    const tokens = await getRefreshTokensFromDB(db, email);

    for (const token of tokens) {
      const isValid = await verifyRefreshToken(token.hash, rawToken);
      if (isValid) {
        this.storeTokenInRedis(rawToken, email);
        return token;
      }
    }
  }

  private async revokeOldTokens(email: string, db: TClient, keepLatest = 4) {
    const tokens = await getRefreshTokensFromDB(db, email);

    const tokensToRevoke = tokens.slice(keepLatest);

    for (const token of tokensToRevoke) {
      await this.revoke(token.id);
    }
  }

  async deleteRevokedTokens() {
    const db = this.dbService.getDB();

    await db
      .delete(refreshTokenTable)
      .where(eq(refreshTokenTable.revoked, true));
  }

  async revoke(id: number ) {

    try {
        const db = this.dbService.getDB()
      const token = await db
        .select()
        .from(refreshTokenTable)
        .where(eq(refreshTokenTable.id, id))
        .limit(1)
        .then((rows) => rows[0]);

      if (!token) {
        return false;
      }

      await db
        .update(refreshTokenTable)
        .set({ revoked: true })
        .where(eq(refreshTokenTable.id, id));

      await this.redis.del(`refresh:${token.hash}`);

      return true;
    } catch {
      return false;
    }
  }

  // helper function which writes token to redis
  private async storeTokenInRedis(rawToken: string, email: string) {
    await this.redis.set(
      `refresh:${rawToken}`,
      JSON.stringify({ email }),
      'EX',
      7 * 24 * 60 * 60,
    );
  }
}
