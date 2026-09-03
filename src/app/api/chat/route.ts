import { NextResponse } from "next/server";
import { insertChatMessage, listChatMessages } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const messages = await listChatMessages();
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("GET /api/chat failed", error);
    return NextResponse.json({ messages: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      senderName?: string;
      senderPhone?: string;
      senderRole?: string;
      text?: string;
      source?: string;
      createdAt?: string;
    };

    const row = await insertChatMessage({
      senderName: body.senderName || "Anonymous",
      senderPhone: body.senderPhone,
      senderRole: body.senderRole,
      text: body.text || "",
      source: body.source,
      createdAt: body.createdAt,
    });

    return NextResponse.json({ id: row.id });
  } catch (error) {
    console.error("POST /api/chat failed", error);
    return NextResponse.json({ error: "chat_save_failed" }, { status: 500 });
  }
}
