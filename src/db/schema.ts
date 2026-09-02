import {
  pgTable,
  text,
  integer,
  jsonb,
  timestamp,
  serial,
  boolean,
} from "drizzle-orm/pg-core";

/**
 * SMARTCART database schema.
 * The original app (Vite + Firestore) stored rich documents, so we keep the
 * document payload in a `data` jsonb column while indexing the useful fields.
 */

export const products = pgTable("products", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  priceBdt: integer("price_bdt").notNull().default(0),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orders = pgTable("orders", {
  orderId: text("order_id").primaryKey(),
  trackingId: text("tracking_id").notNull(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  status: text("status").notNull().default("pending"),
  grandTotal: integer("grand_total").notNull().default(0),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  role: text("role").notNull().default("customer"),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: text("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  subject: text("subject").notNull().default(""),
  status: text("status").notNull().default("open"),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  stars: integer("stars").notNull().default(5),
  verified: boolean("verified").notNull().default(true),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  senderName: text("sender_name").notNull(),
  senderPhone: text("sender_phone"),
  senderRole: text("sender_role").notNull().default("customer"),
  body: text("body").notNull(),
  source: text("source").notNull().default("live_chat"),
  createdAtLabel: text("created_at_label").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
