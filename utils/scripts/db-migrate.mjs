import { join } from 'path';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import chalk from 'chalk';

void config();
const { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } = process.env;

const sql = postgres({
  host: PGHOST,
  port: PGPORT,
  database: PGDATABASE,
  password: PGPASSWORD,
  username: PGUSER,
});
const db = drizzle(sql);

(async () => {
  console.log(chalk.cyan(' 🐶 Start Migrating \n'));
  await migrate(db, { migrationsFolder: join(process.cwd(), 'migrations') });
  console.log(chalk.bgCyan.black('\n ⚡Migrate Success ⚡ '));
  process.exit(0)
})();
