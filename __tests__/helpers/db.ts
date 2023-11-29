import { drizzle } from 'drizzle-orm/postgres-js';
import { createPool } from '~/infrastructure/database/create-pool';

import { config } from 'dotenv';
import postgres from 'postgres';

config();

const {
  PGHOST_TEST,
  PGUSER_TEST,
  PGDATABASE_TEST,
  PGPASSWORD_TEST,
  PGPORT_TEST,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
} = process.env as any;

export const db = drizzle(
  process.env.PLATFORM === 'ACTION'
    ? postgres(process.env.DATABASE_URL!)
    : createPool({
        host: PGHOST_TEST,
        port: PGPORT_TEST,
        database: PGDATABASE_TEST,
        password: PGPASSWORD_TEST,
        username: PGUSER_TEST,
        max: 1,
      }),
);
