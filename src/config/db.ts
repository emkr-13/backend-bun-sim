import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

// Add SSL configuration
const client = postgres(connectionString!, {
  ssl: {
    rejectUnauthorized: false // This is for development only!
  }
});

export const db = drizzle(client);