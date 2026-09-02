export type Currency = 'BDT' | 'USD';

export interface Product {
  id: number;
  name: string;
  bnName: string;
  category: string;
  priceBDT: number;
  oldPriceBDT: number;
  priceUSD: number;
  oldPriceUSD: number;
  rating: number;
  reviews: number;
  image: string;
  iconName: string;
  tint: string;
  stock: string;
  stockCount: number;
  description: string;
  bnDescription: string;
  tags: string[];
  colors?: string[];
  sizes?: string[];
  sku: string;
  isFlashDeal?: boolean;
}

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string;
  whatsappInternational: string;
  announcementText: string;
  insideDhakaFeeBDT: number;
  subDhakaFeeBDT: number;
  outsideDhakaFeeBDT: number;
  exchangeRateBDT: number;
  heroHeadline?: string;
  heroSubheadline?: string;
}

export interface CartItem {
  id: string; // unique cart item id (product id + variant)
  productId: number;
  product: Product;
  qty: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface DeliveryOption {
  id: string;
  name: string;
  bnName: string;
  chargeBDT: number;
  chargeUSD: number;
  estimatedTime: string;
}

export interface CheckoutFormData {
  customerName: string;
  phone: string;
  address: string;
  cityZone: 'inside_dhaka' | 'outside_dhaka' | 'sub_dhaka';
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  notes: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: number;
  name: string;
  bnName?: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  color?: string;
  size?: string;
  sku?: string;
  image?: string;
}

export interface OrderDetails {
  orderId: string;
  trackingId: string; // e.g. SMC-TRK-7492
  createdAt: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  cityZone: string;
  paymentMethod: string;
  paymentStatus: 'unpaid' | 'paid' | 'cod_pending';
  status: OrderStatus;
  courierName: string; // e.g. Steadfast Courier, Pathao, RedX
  estimatedDelivery: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  grandTotal: number;
  currency: Currency;
  whatsappRecipient: string;
  timeline?: {
    status: OrderStatus;
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }[];
}

export interface Category {
  name: string;
  bnName: string;
  icon: string;
  count: number;
  color: string;
}

export interface Review {
  id: number;
  name: string;
  initials: string;
  color: string;
  text: string;
  stars: number;
  verified: boolean;
  date: string;
}

export type UserRole = 'admin' | 'moderator' | 'support' | 'customer';

export interface UserPermissions {
  manageProducts?: boolean;
  manageOrders?: boolean;
  manageDiscounts?: boolean;
  manageSupport?: boolean;
  manageStaffAccess?: boolean;
  viewFinancials?: boolean;
  editStoreSettings?: boolean;
}

export interface UserAccount {
  id: string;
  fullName: string;
  username?: string;
  password?: string;
  phone: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  deliveryAddress: string;
  city: string;
  joinedDate: string;
  avatarUrl?: string;
  membershipLevel: 'SMART Club Member' | 'VIP Platinum';
  orderHistory?: OrderDetails[];
  assignedDuties?: string;
  lastActive?: string;
  permissions?: UserPermissions;
  notificationPrefs?: {
    smsAlerts: boolean;
    emailAlerts: boolean;
    orderAlerts: boolean;
    customerMsgAlerts: boolean;
    dailySummary: boolean;
  };
}

export interface SupportInquiryReply {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isStaff: boolean;
}

export interface SupportInquiry {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'normal' | 'urgent';
  category: 'Order Status' | 'Product Question' | 'Return / Refund' | 'Delivery Issue' | 'General';
  createdAt: string;
  replies: SupportInquiryReply[];
  assignedTo?: string; // staff name
}

export interface StaffNotification {
  id: string;
  type: 'order' | 'inquiry' | 'sales_summary' | 'system';
  title: string;
  message: string;
  targetRole: UserRole | 'all';
  timestamp: string;
  read: boolean;
  channels: ('SMS' | 'Email' | 'System')[];
  data?: {
    orderId?: string;
    trackingId?: string;
    phone?: string;
    customerName?: string;
    amount?: number;
    inquiryId?: string;
  };
}

