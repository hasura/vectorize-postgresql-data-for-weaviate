import pkg from 'pg';
const { Pool } = pkg;
import { config } from 'dotenv';
config();

const connectionString = process.env.POSTGRESQL_CONNECTION_STRING;

const db = new Pool({
  connectionString: connectionString,
});

export { db };
