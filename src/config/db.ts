import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";

// Load DATABASE_URL dari .env
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables");
}

// Buat koneksi ke database menggunakan DATABASE_URL
const client = postgres(DATABASE_URL);

export const db = drizzle(client);
