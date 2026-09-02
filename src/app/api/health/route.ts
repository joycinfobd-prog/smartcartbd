import { NextResponse } from "next/server";
import { isAvailable, getDb } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAvailable) {
    return NextResponse.json({
      ok: true,
      mode: "in-memory",
      note: "DATABASE_URL not configured. API routes use in-memory storage. Add Postgres to persist across cold starts.",
    });
  }
  try {
    const db = getDb();
    await db.execute(sql`select 1`);
    return NextResponse.json({ ok: true, mode: "postgres" });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      { ok: false, error: "database_unreachable" },
      { status: 503 },
    );
  }
}
