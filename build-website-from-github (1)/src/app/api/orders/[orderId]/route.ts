import { NextResponse } from "next/server";
import { upsertOrders, getOrderByOrderId } from "@/lib/server-store";
import type { OrderDetails } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const order = await getOrderByOrderId(orderId);
  if (!order) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ order });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    const updates = (await request.json()) as Partial<OrderDetails>;

    const existing = await getOrderByOrderId(orderId);
    if (!existing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const merged = { ...existing, ...updates };
    await upsertOrders([merged]);
    return NextResponse.json({ ok: true, order: merged });
  } catch (error) {
    console.error("PATCH /api/orders failed", error);
    return NextResponse.json({ error: "order_update_failed" }, { status: 500 });
  }
}
