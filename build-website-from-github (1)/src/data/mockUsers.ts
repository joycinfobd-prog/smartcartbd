import { UserAccount } from '../types';

export const INITIAL_STAFF_AND_USERS: UserAccount[] = [
  {
    id: 'USR-ADMIN-01',
    fullName: 'Joy Chowdhury',
    username: 'admin',
    password: 'password123',
    phone: '01794608874',
    email: 'admin@smartcart.com',
    role: 'admin',
    status: 'active',
    deliveryAddress: 'House #12, Road #4, Dhanmondi, Dhaka',
    city: 'Dhaka',
    joinedDate: 'January 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    membershipLevel: 'VIP Platinum',
    assignedDuties: 'Full Store Control, Catalog, Settings, Financials & Staff Access',
    lastActive: 'Just now',
    notificationPrefs: {
      smsAlerts: true,
      emailAlerts: true,
      orderAlerts: true,
      customerMsgAlerts: true,
      dailySummary: true
    }
  },
  {
    id: 'USR-MOD-01',
    fullName: 'Tushar Ahmed',
    username: 'tushar',
    password: 'password123',
    phone: '01711223344',
    email: 'tushar@smartcart.com',
    role: 'moderator',
    status: 'active',
    deliveryAddress: 'Mirpur-10, Dhaka-1216',
    city: 'Dhaka',
    joinedDate: 'February 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    membershipLevel: 'VIP Platinum',
    assignedDuties: 'Order Calling, Customer Verification & Steadfast/Pathao Parcel Booking',
    lastActive: '5 mins ago',
    notificationPrefs: {
      smsAlerts: true,
      emailAlerts: true,
      orderAlerts: true,
      customerMsgAlerts: false,
      dailySummary: false
    }
  },
  {
    id: 'USR-MOD-02',
    fullName: 'Shakib Al Hasan',
    username: 'shakib',
    password: 'password123',
    phone: '01811223344',
    email: 'shakib@smartcart.com',
    role: 'moderator',
    status: 'active',
    deliveryAddress: 'Agrabad C/A, Chittagong',
    city: 'Chittagong',
    joinedDate: 'February 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    membershipLevel: 'VIP Platinum',
    assignedDuties: 'Order Processing, Customer Phone Call Confirmation & Logistics Dispatch',
    lastActive: '12 mins ago',
    notificationPrefs: {
      smsAlerts: true,
      emailAlerts: true,
      orderAlerts: true,
      customerMsgAlerts: false,
      dailySummary: false
    }
  },
  {
    id: 'USR-SUP-01',
    fullName: 'Rimi Akter',
    username: 'rimi',
    password: 'password123',
    phone: '01911223344',
    email: 'rimi@smartcart.com',
    role: 'support',
    status: 'active',
    deliveryAddress: 'Uttara Sector 7, Dhaka',
    city: 'Dhaka',
    joinedDate: 'March 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    membershipLevel: 'VIP Platinum',
    assignedDuties: 'Customer Inquiry Response, Live Chat, WhatsApp Support & Ticket Resolution',
    lastActive: 'Active now',
    notificationPrefs: {
      smsAlerts: false,
      emailAlerts: true,
      orderAlerts: false,
      customerMsgAlerts: true,
      dailySummary: false
    }
  },
  {
    id: 'USR-SUP-02',
    fullName: 'Tanvir Rahman',
    username: 'tanvir',
    password: 'password123',
    phone: '01611223344',
    email: 'tanvir@smartcart.com',
    role: 'support',
    status: 'active',
    deliveryAddress: 'Banani Road 11, Dhaka',
    city: 'Dhaka',
    joinedDate: 'March 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    membershipLevel: 'VIP Platinum',
    assignedDuties: 'Customer Query Handling, Exchange & Return Inquiries, Product Assistance',
    lastActive: '18 mins ago',
    notificationPrefs: {
      smsAlerts: false,
      emailAlerts: true,
      orderAlerts: false,
      customerMsgAlerts: true,
      dailySummary: false
    }
  },
  {
    id: 'USR-CUST-01',
    fullName: 'Anita Roy',
    username: 'anita',
    password: 'password123',
    phone: '01712345678',
    email: 'anita.roy@gmail.com',
    role: 'customer',
    status: 'active',
    deliveryAddress: 'House 14, Road 8, Dhanmondi, Dhaka',
    city: 'Dhaka',
    joinedDate: 'April 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    membershipLevel: 'SMART Club Member',
    assignedDuties: 'Valued Customer',
    lastActive: '1 hour ago'
  }
];

export const INITIAL_USER: UserAccount = INITIAL_STAFF_AND_USERS[0];
export const INITIAL_USERS: UserAccount[] = INITIAL_STAFF_AND_USERS;
