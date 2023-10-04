import postgres from 'postgres';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } = process.env as any;
export const sql = postgres({
  host: PGHOST,
  port: PGPORT,
  database: PGDATABASE,
  password: PGPASSWORD,
  username: PGUSER,
});
