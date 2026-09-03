import { NextResponse } from "next/server";
import { getSnapshot, upsertOrders } from "@/lib/server-store";
import type { OrderDetails } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snap = await getSnapshot();
    return NextResponse.json({ orders: snap.orders });
  } catch (error) {
    console.error("GET /api/orders failed", error);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const order = (await request.json()) as OrderDetails;
    if (!order?.orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }
    await upsertOrders([order]);
    return NextResponse.json({ ok: true, orderId: order.orderId });
  } catch (error) {
    console.error("POST /api/orders failed", error);
    return NextResponse.json({ error: "order_save_failed" }, { status: 500 });
  }
}
