import { OrderDetails } from '../types';

export const INITIAL_ORDERS: OrderDetails[] = [
  {
    orderId: 'SMC-8921',
    trackingId: 'SMC-TRK-8921',
    createdAt: '2026-08-30 02:45 PM',
    customerName: 'Tanvir Hossain',
    phone: '01712345678',
    email: 'tanvir.hossain@gmail.com',
    address: 'House #42, Road #11, Sector 4, Uttara, Dhaka',
    cityZone: 'inside_dhaka',
    paymentMethod: 'Cash On Delivery (COD)',
    paymentStatus: 'cod_pending',
    status: 'out_for_delivery',
    courierName: 'Steadfast Courier BD',
    estimatedDelivery: 'Today by 6:00 PM',
    notes: 'Please call before delivery.',
    items: [
      {
        productId: 1,
        name: 'Aura Pro Wireless ANC Headphones',
        bnName: 'অরা প্রো ওয়্যারলেস এএনসি হেডফোন',
        qty: 1,
        unitPrice: 2450,
        totalPrice: 2450,
        color: 'Space Gray',
        sku: 'SMC-AUD-001',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 2450,
    deliveryCharge: 60,
    discount: 0,
    grandTotal: 2510,
    currency: 'BDT',
    whatsappRecipient: '01794608874',
    timeline: [
      {
        status: 'pending',
        title: 'Order Placed & Confirmed',
        description: 'Customer submitted order via WhatsApp Checkout',
        timestamp: 'Aug 30, 2026 02:45 PM',
        completed: true
      },
      {
        status: 'processing',
        title: 'Fulfillment & QC Inspection',
        description: 'Items packed and sealed at SMARTCART Central Hub Dhaka',
        timestamp: 'Aug 30, 2026 05:30 PM',
        completed: true
      },
      {
        status: 'shipped',
        title: 'Dispatched to Courier Hub',
        description: 'Handed over to Steadfast Courier (Consignment #ST-98214)',
        timestamp: 'Aug 31, 2026 09:15 AM',
        completed: true
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Rider Rahim (01899123456) is out for delivery to Uttara Sector 4',
        timestamp: 'Sep 01, 2026 11:30 AM',
        completed: true
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Package handed to recipient with Cash on Delivery collection',
        timestamp: 'Pending Delivery',
        completed: false
      }
    ]
  },
  {
    orderId: 'SMC-7450',
    trackingId: 'SMC-TRK-7450',
    createdAt: '2026-08-29 11:20 AM',
    customerName: 'Nusrat Jahan',
    phone: '01898765432',
    email: 'nusrat.jahan@yahoo.com',
    address: 'Flat 4B, Green View Tower, GEC Circle, Chittagong',
    cityZone: 'outside_dhaka',
    paymentMethod: 'bKash Online',
    paymentStatus: 'paid',
    status: 'delivered',
    courierName: 'Pathao Courier BD',
    estimatedDelivery: 'Delivered on Aug 31',
    items: [
      {
        productId: 2,
        name: 'EchoDot Pulse Smart Speaker',
        bnName: 'ইকোডট পালস স্মার্ট স্পিকার',
        qty: 2,
        unitPrice: 3890,
        totalPrice: 7780,
        color: 'Charcoal Black',
        sku: 'SMC-AUD-002',
        image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 7780,
    deliveryCharge: 120,
    discount: 0,
    grandTotal: 7900,
    currency: 'BDT',
    whatsappRecipient: '01794608874',
    timeline: [
      {
        status: 'pending',
        title: 'Order Placed & Confirmed',
        description: 'Online payment received via bKash TrxID: 8N2K90P',
        timestamp: 'Aug 29, 2026 11:20 AM',
        completed: true
      },
      {
        status: 'processing',
        title: 'Quality Check & Packed',
        description: 'Package boxed securely with bubble wrap at Dhaka Hub',
        timestamp: 'Aug 29, 2026 03:00 PM',
        completed: true
      },
      {
        status: 'shipped',
        title: 'Inter-District Dispatch',
        description: 'Departed Dhaka Sorting Facility to Chittagong Hub',
        timestamp: 'Aug 30, 2026 08:00 AM',
        completed: true
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Rider assigned for GEC Circle delivery',
        timestamp: 'Aug 31, 2026 10:45 AM',
        completed: true
      },
      {
        status: 'delivered',
        title: 'Successfully Delivered',
        description: 'Delivered to Nusrat Jahan (Received & Verified)',
        timestamp: 'Aug 31, 2026 02:15 PM',
        completed: true
      }
    ]
  },
  {
    orderId: 'SMC-6239',
    trackingId: 'SMC-TRK-6239',
    createdAt: '2026-08-31 06:10 PM',
    customerName: 'Shakil Ahmed',
    phone: '01911223344',
    email: 'shakil.ahmed@gmail.com',
    address: 'Shapla Square, Station Road, Sylhet Sadar',
    cityZone: 'outside_dhaka',
    paymentMethod: 'Cash On Delivery (COD)',
    paymentStatus: 'cod_pending',
    status: 'shipped',
    courierName: 'RedX Delivery BD',
    estimatedDelivery: 'Sep 02, 2026',
    items: [
      {
        productId: 7,
        name: 'Veloce Ultra Smartwatch AMOLED',
        bnName: 'ভেলোস আল্ট্রা স্মার্টওয়াচ অ্যামোলেড',
        qty: 1,
        unitPrice: 2890,
        totalPrice: 2890,
        color: 'Titanium Black',
        sku: 'SMC-GDT-001',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
      },
      {
        productId: 10,
        name: 'HyperCharge 65W GaN Power Adapter',
        bnName: 'হাইপারচার্জ ৬৫ ওয়াট ফাস্ট চার্জার',
        qty: 1,
        unitPrice: 1450,
        totalPrice: 1450,
        color: 'White',
        sku: 'SMC-GDT-004',
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 4340,
    deliveryCharge: 120,
    discount: 0,
    grandTotal: 4460,
    currency: 'BDT',
    whatsappRecipient: '01794608874',
    timeline: [
      {
        status: 'pending',
        title: 'Order Placed',
        description: 'Customer confirmed order for Sylhet',
        timestamp: 'Aug 31, 2026 06:10 PM',
        completed: true
      },
      {
        status: 'processing',
        title: 'Packed & Barcoded',
        description: 'Assigned RedX Tracking #REDX-SYL-44120',
        timestamp: 'Aug 31, 2026 09:30 PM',
        completed: true
      },
      {
        status: 'shipped',
        title: 'In Transit to Sylhet Hub',
        description: 'En route from Dhaka Central Hub to Sylhet regional center',
        timestamp: 'Sep 01, 2026 06:00 AM',
        completed: true
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Awaiting arrival at destination delivery depot',
        timestamp: 'Expected Sep 02, 2026',
        completed: false
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Cash on delivery payment collection at doorstep',
        timestamp: 'Pending Delivery',
        completed: false
      }
    ]
  }
];

export const INITIAL_USER: import('../types').UserAccount = {
  id: 'USR-ADMIN-01',
  fullName: 'Joy Chowdhury',
  username: 'admin',
  role: 'admin',
  status: 'active',
  phone: '01794608874',
  email: 'admin@smartcart.com',
  deliveryAddress: 'House #12, Road #4, Dhanmondi, Dhaka',
  city: 'Dhaka',
  joinedDate: 'January 2026',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  membershipLevel: 'VIP Platinum',
  assignedDuties: 'Full Store Control, Catalog, Settings, Financials & Staff Access'
};

