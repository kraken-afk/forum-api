import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { createPool } from '~/infrastructure/database/create-pool';

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
    ? // @ts-ignore
      createPool(process.env.DATABASE_URL!)
    : createPool({
        host: PGHOST_TEST,
        port: PGPORT_TEST,
        database: PGDATABASE_TEST,
        password: PGPASSWORD_TEST,
        username: PGUSER_TEST,
        max: 1,
      }),
);
