import { SupportInquiry } from '../types';

export const INITIAL_INQUIRIES: SupportInquiry[] = [
  {
    id: 'INQ-901',
    customerName: 'Mehedi Hasan',
    phone: '01755667788',
    email: 'mehedi.h@gmail.com',
    subject: 'Aura Pro ANC Headphone Stock & Color Inquiry',
    message: 'Hello, is the Aura Pro ANC Wireless headphone available in Navy Blue color right now? And how many days will delivery take to Rajshahi?',
    status: 'open',
    priority: 'urgent',
    category: 'Product Question',
    createdAt: 'Today, 10:15 AM',
    assignedTo: 'Rimi Akter',
    replies: [
      {
        id: 'rep-1',
        sender: 'Mehedi Hasan',
        text: 'Hello, is the Aura Pro ANC Wireless headphone available in Navy Blue color right now? And how many days will delivery take to Rajshahi?',
        timestamp: '10:15 AM',
        isStaff: false
      }
    ]
  },
  {
    id: 'INQ-902',
    customerName: 'Sadia Sultana',
    phone: '01899887766',
    email: 'sadia.sultana@yahoo.com',
    subject: 'Order #SMC-7450 Delivery Status Check',
    message: 'I placed an order for EchoDot pulse speaker 2 days ago. Can you check when the Pathao delivery rider will reach Chittagong GEC?',
    status: 'in_progress',
    priority: 'normal',
    category: 'Order Status',
    createdAt: 'Today, 09:30 AM',
    assignedTo: 'Tanvir Rahman',
    replies: [
      {
        id: 'rep-2',
        sender: 'Sadia Sultana',
        text: 'I placed an order for EchoDot pulse speaker 2 days ago. Can you check when the Pathao delivery rider will reach Chittagong GEC?',
        timestamp: '09:30 AM',
        isStaff: false
      },
      {
        id: 'rep-3',
        sender: 'Tanvir Rahman (Support)',
        text: 'আসসালামু আলাইকুম সাদিয়া আপু! আপনার পার্সেলটি অলরেডি চট্টগ্রাম হাব এ পৌঁছেছে। আজ দুপুরের মধ্যে রাইডার ডেলিভারি সম্পন্ন করবেন।',
        timestamp: '09:45 AM',
        isStaff: true
      }
    ]
  },
  {
    id: 'INQ-903',
    customerName: 'Kamrul Islam',
    phone: '01912344321',
    email: 'kamrul.islam@gmail.com',
    subject: 'Exchange Request for Veloce Smartwatch Strap',
    message: 'I received the smartwatch yesterday. I want to change the strap color from Black to Titanium Gray. Is exchange available with rider?',
    status: 'open',
    priority: 'normal',
    category: 'Return / Refund',
    createdAt: 'Yesterday, 04:20 PM',
    assignedTo: 'Rimi Akter',
    replies: [
      {
        id: 'rep-4',
        sender: 'Kamrul Islam',
        text: 'I received the smartwatch yesterday. I want to change the strap color from Black to Titanium Gray. Is exchange available with rider?',
        timestamp: 'Yesterday, 04:20 PM',
        isStaff: false
      }
    ]
  }
];
