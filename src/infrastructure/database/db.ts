import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { createPool } from '~/infrastructure/database/create-pool';

config();

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } = process.env as any;

export const db = drizzle(
  createPool({
    host: PGHOST,
    port: PGPORT,
    database: PGDATABASE,
    password: PGPASSWORD,
    username: PGUSER,
    max: 1,
  }),
);
