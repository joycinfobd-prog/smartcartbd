import { OrderDetails, Currency, Product } from '../types';
import { WHATSAPP_INTERNATIONAL, WHATSAPP_NUMBER } from '../data/products';

export function formatCurrency(amount: number, currency: Currency): string {
  if (currency === 'BDT') {
    return `৳${Math.round(amount).toLocaleString('en-US')}`;
  }
  return `$${Number(amount).toFixed(2)}`;
}

export function formatPaymentMethod(method: string): string {
  switch (method) {
    case 'cod':
      return 'Cash on Delivery (ক্যাশ অন ডেলিভারি)';
    case 'bkash':
      return 'bKash Send Money / Merchant (বিকাশ)';
    case 'nagad':
      return 'Nagad Payment (নগদ)';
    case 'card':
      return 'Card / Online Payment (অনলাইন)';
    default:
      return method;
  }
}

export function formatCityZone(zone: string): string {
  switch (zone) {
    case 'inside_dhaka':
      return 'ঢাকার ভেতরে (Inside Dhaka)';
    case 'sub_dhaka':
      return 'ঢাকা সাব-এরিয়া (সাভার/গাজীপুর/নারায়ণগঞ্জ)';
    case 'outside_dhaka':
      return 'ঢাকার বাইরে (Outside Dhaka - All Districts)';
    default:
      return zone;
  }
}

export function generateWhatsAppOrderMessage(order: OrderDetails): string {
  const curr = order.currency;
  
  const itemsText = order.items
    .map((item, index) => {
      const variantInfo = [
        item.color ? `Color: ${item.color}` : '',
        item.size ? `Size: ${item.size}` : ''
      ].filter(Boolean).join(' | ');
      
      const variantLine = variantInfo ? `   🔹 ভ্যারিয়েন্ট: ${variantInfo}\n` : '';
      
      return `${index + 1}. *${item.name}* ${item.bnName ? `(${item.bnName})` : ''}
   ▫️ পরিমাণ (Qty): ${item.qty} pcs
${variantLine}   ▫️ দর (Price): ${formatCurrency(item.unitPrice, curr)} x ${item.qty} = *${formatCurrency(item.totalPrice, curr)}*`;
    })
    .join('\n\n');

  const notesSection = order.notes?.trim()
    ? `\n\n📝 *বিশেষ নোট (Special Instructions):*\n"${order.notes.trim()}"`
    : '';

  return `🛍️ *নতুন অর্ডার রিকোয়েস্ট (NEW ORDER)*
━━━━━━━━━━━━━━━━━━━━
🆔 *অর্ডার আইডি:* #${order.orderId}
⏰ *সময়:* ${order.createdAt}

👤 *গ্রাহকের বিবরণ (Customer Details):*
• *নাম:* ${order.customerName}
• *মোবাইল নম্বর:* ${order.phone}
• *ডেলিভারি ঠিকানা:* ${order.address}
• *ডেলিভারি এরিয়া:* ${formatCityZone(order.cityZone)}
• *পেমেন্ট মেথড:* ${formatPaymentMethod(order.paymentMethod)}${notesSection}

📦 *অর্ডারকৃত পণ্যসমূহ (Order Items):*
━━━━━━━━━━━━━━━━━━━━
${itemsText}

💰 *বিল ও হিসাব বিবরণী (Bill Summary):*
━━━━━━━━━━━━━━━━━━━━
• সাবটোটাল (Subtotal): ${formatCurrency(order.subtotal, curr)}
• ডেলিভারি চার্জ (Delivery): ${formatCurrency(order.deliveryCharge, curr)}
${order.discount > 0 ? `• ডিসকাউন্ট (Discount): -${formatCurrency(order.discount, curr)}\n` : ''}━━━━━━━━━━━━━━━━━━━━
✨ *সর্বমোট প্রদেয় বিল (Total Payable):* *${formatCurrency(order.grandTotal, curr)}*
━━━━━━━━━━━━━━━━━━━━

অনুগ্রহ করে অর্ডারটি দ্রুত প্রসেসিং করে ডেলিভারি নিশ্চিত করুন। ধন্যবাদ!`;
}

export function generateWhatsAppProductInquiryMessage(product: Product, currency: Currency): string {
  const price = currency === 'BDT' ? product.priceBDT : product.priceUSD;
  return `👋 আসসালামু আলাইকুম / Hello!
আমি *"${product.name}"* সম্পর্কে জানতে ও অর্ডার করতে আগ্রহী।

📌 *প্রোডাক্ট কোড:* ${product.sku}
💰 *মূল্য:* ${formatCurrency(price, currency)}
📦 *স্টক স্ট্যাটাস:* ${product.stock}

আমাকে কি বিস্তারিত জানাতে পারবেন?`;
}

export function getWhatsAppOrderUrl(order: OrderDetails, phoneOverride?: string): string {
  const rawNumber = phoneOverride || WHATSAPP_INTERNATIONAL;
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const message = generateWhatsAppOrderMessage(order);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppInquiryUrl(product: Product, currency: Currency, phoneOverride?: string): string {
  const rawNumber = phoneOverride || WHATSAPP_INTERNATIONAL;
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const message = generateWhatsAppProductInquiryMessage(product, currency);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppDirectChatUrl(message = 'হ্যালো! আমি আপনাদের অনলাইন স্টোর থেকে কেনাকাটা করতে চাই।', phoneOverride?: string): string {
  const rawNumber = phoneOverride || WHATSAPP_INTERNATIONAL;
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
