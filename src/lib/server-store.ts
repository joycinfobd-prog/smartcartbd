import {
  products as productsTable,
  orders as ordersTable,
  users as usersTable,
  inquiries as inquiriesTable,
  reviews as reviewsTable,
  settings as settingsTable,
  chatMessages as chatMessagesTable,
} from "@/db/schema";
import { desc, eq, sql, and } from "drizzle-orm";
import { PRODUCTS, DEFAULT_STORE_SETTINGS, REVIEWS } from "@/data/products";
import { INITIAL_ORDERS } from "@/data/mockOrders";
import { INITIAL_USERS } from "@/data/mockUsers";
import { INITIAL_INQUIRIES } from "@/data/mockInquiries";
import type {
  Product,
  OrderDetails,
  UserAccount,
  SupportInquiry,
  Review,
  StoreSettings,
} from "@/types";
import { getPool, getDb, isAvailable as dbAvailable } from "@/db";

export const SETTINGS_KEY = "store";

/* -------------------------------------------------------------------------- */
/*  Optional in-memory fallback so the app still runs on Vercel when a
    Postgres database is NOT attached. Data resets every cold start, but the
    client keeps its own copy in localStorage, so the storefront is fully
    functional until a real Postgres is provisioned.                       */
/* -------------------------------------------------------------------------- */

interface MemSnapshot {
  products: Map<number, Product>;
  orders: Map<string, OrderDetails>;
  users: Map<string, UserAccount>;
  inquiries: Map<string, SupportInquiry>;
  reviews: Map<number, Review>;
  settings: StoreSettings;
  chat: Array<{
    id: number;
    senderName: string;
    senderPhone: string;
    senderRole: string;
    body: string;
    source: string;
    createdAtLabel: string;
    createdAt: string;
  }>;
  chatSeq: number;
  seeded: boolean;
}

function seedSnapshot(): MemSnapshot {
  const snap: MemSnapshot = {
    products: new Map(PRODUCTS.map((p) => [p.id, p])),
    orders: new Map(INITIAL_ORDERS.map((o) => [o.orderId, o])),
    users: new Map(INITIAL_USERS.map((u) => [u.id, u])),
    inquiries: new Map(INITIAL_INQUIRIES.map((i) => [i.id, i])),
    reviews: new Map(REVIEWS.map((r) => [r.id, r])),
    settings: DEFAULT_STORE_SETTINGS,
    chat: [],
    chatSeq: 0,
    seeded: true,
  };
  return snap;
}

const memory: MemSnapshot = seedSnapshot();

function useMemory() {
  return !dbAvailable;
}

/* -------------------------------------------------------------------------- */
/* Upserts                                                                     */
/* -------------------------------------------------------------------------- */

async function writeThrough<T>(
  key: "products" | "orders" | "users" | "inquiries" | "reviews" | "settings",
  id: string | number,
  value: T,
  persist: () => Promise<void>,
) {
  // Always mirror writes into memory so the process serves fresh data even
  // when Postgres is unreachable.
  if (key === "products") memory.products.set(id as number, value as Product);
  else if (key === "orders") memory.orders.set(id as string, value as OrderDetails);
  else if (key === "users") memory.users.set(id as string, value as UserAccount);
  else if (key === "inquiries") memory.inquiries.set(id as string, value as SupportInquiry);
  else if (key === "reviews") memory.reviews.set(id as number, value as Review);
  else if (key === "settings") memory.settings = value as StoreSettings;

  if (useMemory()) return;
  try {
    await persist();
  } catch (err) {
    console.warn(`[server-store] write-through (${key}) failed, kept in memory:`, err);
  }
}

export async function upsertProducts(list: Product[]) {
  if (!list.length) return;
  for (const p of list) {
    await writeThrough("products", p.id, p, async () => {
      const db = getDb();
      await db
        .insert(productsTable)
        .values({
          id: p.id,
          name: p.name,
          category: p.category,
          priceBdt: Math.round(p.priceBDT || 0),
          data: p,
        })
        .onConflictDoUpdate({
          target: productsTable.id,
          set: {
            name: p.name,
            category: p.category,
            priceBdt: Math.round(p.priceBDT || 0),
            data: p,
            updatedAt: new Date(),
          },
        });
    });
  }
}

export async function replaceProducts(list: Product[]) {
  if (!list.length) return;
  await upsertProducts(list);
  // Mirror the delete into memory too
  const keep = new Set(list.map((p) => p.id));
  for (const id of Array.from(memory.products.keys())) {
    if (!keep.has(id)) memory.products.delete(id);
  }
  if (useMemory()) return;
  try {
    const db = getDb();
    const keepIds = list.map((p) => p.id);
    await db.delete(productsTable).where(
      sql`${productsTable.id} NOT IN (${sql.join(
        keepIds.map((id) => sql`${id}`),
        sql`, `,
      )})`,
    );
  } catch (err) {
    console.warn("[server-store] replaceProducts delete pass failed:", err);
  }
}

export async function upsertOrders(list: OrderDetails[]) {
  for (const o of list) {
    await writeThrough("orders", o.orderId, o, async () => {
      const db = getDb();
      await db
        .insert(ordersTable)
        .values({
          orderId: o.orderId,
          trackingId: o.trackingId,
          customerName: o.customerName,
          phone: o.phone,
          status: o.status,
          grandTotal: Math.round(o.grandTotal || 0),
          data: o,
        })
        .onConflictDoUpdate({
          target: ordersTable.orderId,
          set: {
            trackingId: o.trackingId,
            customerName: o.customerName,
            phone: o.phone,
            status: o.status,
            grandTotal: Math.round(o.grandTotal || 0),
            data: o,
            updatedAt: new Date(),
          },
        });
    });
  }
}

export async function upsertUsers(list: UserAccount[]) {
  for (const u of list) {
    await writeThrough("users", u.id, u, async () => {
      const db = getDb();
      await db
        .insert(usersTable)
        .values({
          id: u.id,
          fullName: u.fullName,
          phone: u.phone || "",
          role: u.role,
          data: u,
        })
        .onConflictDoUpdate({
          target: usersTable.id,
          set: {
            fullName: u.fullName,
            phone: u.phone || "",
            role: u.role,
            data: u,
            updatedAt: new Date(),
          },
        });
    });
  }
}

export async function upsertInquiries(list: SupportInquiry[]) {
  for (const i of list) {
    await writeThrough("inquiries", i.id, i, async () => {
      const db = getDb();
      await db
        .insert(inquiriesTable)
        .values({
          id: i.id,
          customerName: i.customerName,
          subject: i.subject || "",
          status: i.status,
          data: i,
        })
        .onConflictDoUpdate({
          target: inquiriesTable.id,
          set: {
            customerName: i.customerName,
            subject: i.subject || "",
            status: i.status,
            data: i,
            updatedAt: new Date(),
          },
        });
    });
  }
}

export async function upsertReviews(list: Review[]) {
  for (const r of list) {
    await writeThrough("reviews", r.id, r, async () => {
      const db = getDb();
      await db
        .insert(reviewsTable)
        .values({
          id: r.id,
          name: r.name,
          stars: r.stars,
          verified: !!r.verified,
          data: r,
        })
        .onConflictDoUpdate({
          target: reviewsTable.id,
          set: { name: r.name, stars: r.stars, verified: !!r.verified, data: r },
        });
    });
  }
}

export async function upsertSettings(value: StoreSettings) {
  await writeThrough("settings", SETTINGS_KEY, value, async () => {
    const db = getDb();
    await db
      .insert(settingsTable)
      .values({ key: SETTINGS_KEY, data: value })
      .onConflictDoUpdate({
        target: settingsTable.key,
        set: { data: value, updatedAt: new Date() },
      });
  });
}

/* -------------------------------------------------------------------------- */
/* Single-order helpers                                                        */
/* -------------------------------------------------------------------------- */

export async function getOrderByOrderId(orderId: string) {
  if (useMemory()) return memory.orders.get(orderId) ?? null;
  // Prefer memory first (it reflects any writes in this process lifetime),
  // then fall through to Postgres if the order isn't cached yet.
  if (memory.orders.has(orderId)) return memory.orders.get(orderId) ?? null;
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.orderId, orderId))
      .limit(1);
    return (rows[0]?.data as OrderDetails) ?? null;
  } catch (err) {
    console.warn("[server-store] getOrderByOrderId failed:", err);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Seeding + snapshot                                                          */
/* -------------------------------------------------------------------------- */

export async function ensureSeeded() {
  if (useMemory()) return;
  const db = getDb();
  const pool = getPool();
  try {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(productsTable);
    if (count === 0) {
      await upsertProducts(PRODUCTS);
      await upsertReviews(REVIEWS);
      await upsertUsers(INITIAL_USERS);
      await upsertOrders(INITIAL_ORDERS);
      await upsertInquiries(INITIAL_INQUIRIES);
      await upsertSettings(DEFAULT_STORE_SETTINGS);
    }
  } catch (err) {
    // If the tables don't exist yet (first deploy before `drizzle-kit push`),
    // don't crash the request — in-memory fallback covers the edge.
    console.warn("[server-store] ensureSeeded skipped:", err);
    void pool;
  }
}

export async function getSnapshot() {
  if (useMemory()) {
    return {
      products: Array.from(memory.products.values()),
      orders: Array.from(memory.orders.values()),
      users: Array.from(memory.users.values()),
      inquiries: Array.from(memory.inquiries.values()),
      reviews: Array.from(memory.reviews.values()),
      settings: memory.settings,
    };
  }

  await ensureSeeded();
  const db = getDb();

  try {
    const [p, o, u, iq, rv, s] = await Promise.all([
      db.select().from(productsTable).orderBy(productsTable.id),
      db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)),
      db.select().from(usersTable),
      db
        .select()
        .from(inquiriesTable)
        .orderBy(desc(inquiriesTable.createdAt)),
      db.select().from(reviewsTable).orderBy(reviewsTable.id),
      db
        .select()
        .from(settingsTable)
        .where(eq(settingsTable.key, SETTINGS_KEY)),
    ]);

    return {
      products: p.map((row) => row.data as Product),
      orders: o.map((row) => row.data as OrderDetails),
      users: u.map((row) => row.data as UserAccount),
      inquiries: iq.map((row) => row.data as SupportInquiry),
      reviews: rv.map((row) => row.data as Review),
      settings: (s[0]?.data as StoreSettings) ?? DEFAULT_STORE_SETTINGS,
    };
  } catch (err) {
    // Tables missing or DB temporarily unreachable — serve the seeded
    // defaults from memory so the request never fails.
    console.warn("[server-store] getSnapshot falling back to memory:", err);
    return {
      products: PRODUCTS,
      orders: INITIAL_ORDERS,
      users: INITIAL_USERS,
      inquiries: INITIAL_INQUIRIES,
      reviews: REVIEWS,
      settings: DEFAULT_STORE_SETTINGS,
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Chat                                                                        */
/* -------------------------------------------------------------------------- */

export async function insertChatMessage(input: {
  senderName: string;
  senderPhone?: string;
  senderRole?: string;
  text: string;
  source?: string;
  createdAt?: string;
}) {
  const name = input.senderName || "Anonymous";
  const phone = input.senderPhone || "";
  const role = input.senderRole || "customer";
  const body = input.text || "";
  const source = input.source || "live_chat";
  const createdAtLabel = input.createdAt || new Date().toLocaleString("en-GB");
  const createdAt = new Date().toISOString();

  if (useMemory()) {
    memory.chatSeq += 1;
    const row = {
      id: memory.chatSeq,
      senderName: name,
      senderPhone: phone,
      senderRole: role,
      body,
      source,
      createdAtLabel,
      createdAt,
    };
    memory.chat.push(row);
    return { id: row.id };
  }

  try {
    const db = getDb();
    const [row] = await db
      .insert(chatMessagesTable)
      .values({
        senderName: name,
        senderPhone: phone,
        senderRole: role,
        body,
        source,
        createdAtLabel,
      })
      .returning({ id: chatMessagesTable.id });
    return { id: row.id };
  } catch (err) {
    console.warn("[server-store] insertChatMessage falling back to memory:", err);
    memory.chatSeq += 1;
    memory.chat.push({
      id: memory.chatSeq,
      senderName: name,
      senderPhone: phone,
      senderRole: role,
      body,
      source,
      createdAtLabel,
      createdAt: new Date().toISOString(),
    });
    return { id: memory.chatSeq };
  }
}

export async function listChatMessages() {
  if (useMemory()) {
    return memory.chat
      .slice()
      .sort((a, b) => a.id - b.id)
      .map((row) => ({
        id: String(row.id),
        senderName: row.senderName,
        senderPhone: row.senderPhone,
        senderRole: row.senderRole,
        text: row.body,
        createdAt: row.createdAtLabel,
        source: row.source,
      }));
  }
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(chatMessagesTable)
      .orderBy(desc(chatMessagesTable.createdAt))
      .limit(100);

    return rows.reverse().map((row) => ({
      id: String(row.id),
      senderName: row.senderName,
      senderPhone: row.senderPhone ?? "",
      senderRole: row.senderRole,
      text: row.body,
      createdAt: row.createdAtLabel,
      source: row.source,
    }));
  } catch (err) {
    console.warn("[server-store] listChatMessages falling back to memory:", err);
    return memory.chat
      .slice()
      .sort((a, b) => a.id - b.id)
      .map((row) => ({
        id: String(row.id),
        senderName: row.senderName,
        senderPhone: row.senderPhone,
        senderRole: row.senderRole,
        text: row.body,
        createdAt: row.createdAtLabel,
        source: row.source,
      }));
  }
}
