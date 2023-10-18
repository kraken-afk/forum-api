import { join } from 'path';
import chalk from 'chalk';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

void config();
const {
  PGHOST_TEST,
  PGUSER_TEST,
  PGDATABASE_TEST,
  PGPASSWORD_TEST,
  PGPORT_TEST,
} = process.env;

const sql = postgres({
  host: PGHOST_TEST,
  port: PGPORT_TEST,
  database: PGDATABASE_TEST,
  password: PGPASSWORD_TEST,
  username: PGUSER_TEST,
  max: 1,
});
const db = drizzle(sql);

(async () => {
  console.log(chalk.cyan(' 🐶 Start Migrating for test \n'));
  await migrate(db, { migrationsFolder: join(process.cwd(), 'migrations') });
  console.log(chalk.bgCyan.black('\n ⚡Migrate Success ⚡ '));
  process.exit(0);
})();
