import { join } from 'path';
import chalk from 'chalk';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

void config();

const sql = postgres(process.env.DATABASE_URL);
const db = drizzle(sql);

(async () => {
  console.log(chalk.cyan(' 🐶 Start Migrating to Cloud \n'));
  await migrate(db, { migrationsFolder: join(process.cwd(), 'migrations') });
  console.log(chalk.bgCyan.black('\n ⚡Migrate Success ⚡ '));
  process.exit(0);
})();
