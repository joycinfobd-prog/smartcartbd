/**
 * SMARTCART data layer.
 *
 * The original repository talked to Firebase Firestore directly from the
 * browser. In this Next.js build every write goes through our own REST API
 * which persists into PostgreSQL through Drizzle ORM.
 */
import {
  OrderDetails,
  SupportInquiry,
  SupportInquiryReply,
  UserAccount,
  Review,
  StoreSettings,
  Product,
} from '../types';

export interface ChatMessageRecord {
  id?: string;
  senderName: string;
  senderPhone?: string;
  senderRole?: 'customer' | 'support' | 'admin' | 'moderator';
  text: string;
  createdAt: string;
  source: 'whatsapp_widget' | 'support_ticket' | 'checkout' | 'live_chat';
}

export interface SyncSnapshot {
  products: Product[];
  orders: OrderDetails[];
  users: UserAccount[];
  inquiries: SupportInquiry[];
  reviews: Review[];
  settings: StoreSettings | null;
}

async function request<T>(
  url: string,
  init?: RequestInit,
): Promise<T | null> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    });
    if (!res.ok) {
      console.warn(`SmartCart API notice (${url}):`, res.status);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.warn(`SmartCart API offline notice (${url}):`, error);
    return null;
  }
}

/** Fetch the full store snapshot from PostgreSQL. */
export async function fetchStoreSnapshot(): Promise<SyncSnapshot | null> {
  return request<SyncSnapshot>('/api/sync', { method: 'GET' });
}

/** Push the current store state back to PostgreSQL. */
export async function pushStoreSnapshot(
  payload: Partial<SyncSnapshot>,
): Promise<void> {
  await request('/api/sync', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Save a live chat / WhatsApp widget message. */
export async function saveLiveChatMessage(
  message: ChatMessageRecord,
): Promise<string | null> {
  const result = await request<{ id: number }>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      ...message,
      createdAt: message.createdAt || new Date().toLocaleString('en-GB'),
    }),
  });
  return result ? String(result.id) : null;
}

export async function fetchLiveChatMessages(): Promise<ChatMessageRecord[]> {
  const result = await request<{ messages: ChatMessageRecord[] }>('/api/chat');
  return result?.messages ?? [];
}

/** Persist (create or update) a support ticket. */
export async function saveSupportInquiry(inquiry: SupportInquiry): Promise<void> {
  await pushStoreSnapshot({ inquiries: [inquiry] });
}

/** Backwards compatible alias used by the original components. */
export const saveSupportInquiryToFirestore = saveSupportInquiry;

export async function addInquiryReply(
  inquiryId: string,
  reply: SupportInquiryReply,
  currentInquiry?: SupportInquiry,
): Promise<void> {
  if (!currentInquiry) return;
  await saveSupportInquiry({
    ...currentInquiry,
    replies: [...(currentInquiry.replies || []), reply],
  });
}

/** Persist a placed order. */
export async function saveOrder(order: OrderDetails): Promise<void> {
  await request('/api/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });
}

export const saveOrderToFirestore = saveOrder;

export async function updateOrder(
  orderId: string,
  updates: Partial<OrderDetails>,
): Promise<void> {
  await request(`/api/orders/${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function saveProduct(product: Product): Promise<void> {
  await pushStoreSnapshot({ products: [product] });
}

export async function saveUser(user: UserAccount): Promise<void> {
  await pushStoreSnapshot({ users: [user] });
}

export async function saveReview(review: Review): Promise<void> {
  await pushStoreSnapshot({ reviews: [review] });
}

export async function saveStoreSettings(settings: StoreSettings): Promise<void> {
  await pushStoreSnapshot({ settings });
}
