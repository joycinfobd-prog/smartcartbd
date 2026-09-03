import { NextResponse } from "next/server";
import { getSnapshot } from "@/lib/server-store";

export const dynamic = "force-dynamic";

/** Lightweight endpoint used by the live chat widget for polling replies. */
export async function GET() {
  try {
    const snapshot = await getSnapshot();
    return NextResponse.json({ inquiries: snapshot.inquiries });
  } catch (error) {
    console.error("GET /api/inquiries failed", error);
    return NextResponse.json({ inquiries: [] }, { status: 500 });
  }
}
