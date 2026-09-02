import { NextResponse } from "next/server";
import {
  getSnapshot,
  upsertInquiries,
  upsertOrders,
  upsertReviews,
  upsertSettings,
  upsertUsers,
  replaceProducts,
} from "@/lib/server-store";
import type {
  Product,
  OrderDetails,
  UserAccount,
  SupportInquiry,
  Review,
  StoreSettings,
} from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getSnapshot();
    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("GET /api/sync failed", error);
    return NextResponse.json({ error: "sync_failed" }, { status: 500 });
  }
}

interface SyncBody {
  products?: Product[];
  orders?: OrderDetails[];
  users?: UserAccount[];
  inquiries?: SupportInquiry[];
  reviews?: Review[];
  settings?: StoreSettings | null;
  replaceCatalog?: boolean;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SyncBody;

    if (Array.isArray(body.products) && body.products.length) {
      await replaceProducts(body.products);
    }
    if (Array.isArray(body.orders) && body.orders.length) {
      await upsertOrders(body.orders);
    }
    if (Array.isArray(body.users) && body.users.length) {
      await upsertUsers(body.users);
    }
    if (Array.isArray(body.inquiries) && body.inquiries.length) {
      await upsertInquiries(body.inquiries);
    }
    if (Array.isArray(body.reviews) && body.reviews.length) {
      await upsertReviews(body.reviews);
    }
    if (body.settings) {
      await upsertSettings(body.settings);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/sync failed", error);
    return NextResponse.json({ error: "sync_failed" }, { status: 500 });
  }
}
