import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Injectable, OnModuleInit } from '@nestjs/common';

import configuration from '../../config/configuration';

import { TClient } from '../../types/types';

@Injectable()
export class DBService implements OnModuleInit {
  #db: TClient;

  // connect to the db on the start of the app
  async onModuleInit() {
    const config = configuration().database;

    const pool = new Pool({
      connectionString: config.url,
      ssl: config.ssl,
    });

    await pool.connect();
    this.#db = drizzle(pool);
    console.log('Connected to the database');
  }

  // allows to get our connection to the any place in the app
  getDB() {
    if (!this.#db) throw new Error('DB is not initialized');
    return this.#db;
  }
}
