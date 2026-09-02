import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Database client. Lazy + tolerant so that:
 *   - Importing this module never throws at build time (Vercel runs
 *     `next build` which evaluates route modules for metadata).
 *   - If DATABASE_URL is not configured (e.g. preview deploy without a
 *     Postgres add-on), runtime callers can detect `isAvailable === false`
 *     and fall back to an in-memory store instead of crashing.
 */
const databaseUrl = process.env.DATABASE_URL?.trim() || "";

export const isAvailable = Boolean(databaseUrl);

let pool: Pool | null = null;

function getOrCreatePool(): Pool | null {
  if (!isAvailable) return null;
  if (pool) return pool;

  const globalForDb = globalThis as typeof globalThis & {
    __smartcartPgPool?: Pool;
  };

  const created =
    globalForDb.__smartcartPgPool ??
    new Pool({
      connectionString: databaseUrl,
      // Serverless-friendly settings (Neon / Supabase / Vercel Postgres).
      max: 1,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });

  if (!globalForDb.__smartcartPgPool) {
    globalForDb.__smartcartPgPool = created;
  }
  pool = created;
  return pool;
}

export function getPool(): Pool | null {
  return getOrCreatePool();
}

/** The drizzle db instance. Throws only if you call it and there is no DB URL. */
export function getDb() {
  const p = getOrCreatePool();
  if (!p) {
    throw new Error(
      "DATABASE_URL is not configured. Please provision a Postgres database (Vercel Postgres / Neon / Supabase) and add DATABASE_URL to your environment variables.",
    );
  }
  return drizzle(p);
}

/** Convenience re-export for code paths that already assume a DB exists. */
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return Reflect.get(getDb(), prop);
  },
});
