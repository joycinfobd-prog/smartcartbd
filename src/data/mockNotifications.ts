import { StaffNotification } from '../types';

export const INITIAL_NOTIFICATIONS: StaffNotification[] = [
  {
    id: 'NOTIF-01',
    type: 'order',
    title: '🚨 New Order Received: #SMC-8921',
    message: 'Tanvir Hossain placed an order for Aura Pro ANC Headphones (৳2,510). Phone: 01712345678. Immediate call & courier booking required.',
    targetRole: 'moderator',
    timestamp: '5 mins ago',
    read: false,
    channels: ['SMS', 'Email', 'System'],
    data: {
      orderId: 'SMC-8921',
      trackingId: 'SMC-TRK-8921',
      phone: '01712345678',
      customerName: 'Tanvir Hossain',
      amount: 2510
    }
  },
  {
    id: 'NOTIF-02',
    type: 'inquiry',
    title: '💬 New Customer Message: Mehedi Hasan',
    message: 'Customer asked regarding Aura Pro Navy Blue stock and delivery time to Rajshahi. Customer Phone: 01755667788.',
    targetRole: 'support',
    timestamp: '12 mins ago',
    read: false,
    channels: ['Email', 'System'],
    data: {
      inquiryId: 'INQ-901',
      customerName: 'Mehedi Hasan',
      phone: '01755667788'
    }
  },
  {
    id: 'NOTIF-03',
    type: 'sales_summary',
    title: '📊 Daily Operations & Sales Digest',
    message: '3 new orders processed today (৳14,870 Total Revenue). 2 Parcels dispatched via Steadfast Courier & Pathao.',
    targetRole: 'admin',
    timestamp: '1 hour ago',
    read: false,
    channels: ['Email', 'System'],
    data: {
      amount: 14870
    }
  }
];
