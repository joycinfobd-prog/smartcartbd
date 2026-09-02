import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  ShoppingBag,
  CreditCard,
  Plus,
  Minus,
  Check
} from 'lucide-react';
import { Product, CartItem, Currency, CheckoutFormData, OrderDetails, UserAccount } from '../types';
import { DELIVERY_OPTIONS, WHATSAPP_NUMBER, WHATSAPP_INTERNATIONAL } from '../data/products';
import { formatCurrency, generateWhatsAppOrderMessage, getWhatsAppOrderUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './WhatsAppIcon';
import { ProductIcon } from './ProductIcon';
import { saveOrderToFirestore, saveLiveChatMessage } from '../lib/api-client';

interface WhatsAppCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  directProduct: Product | null;
  cartItems: CartItem[];
  currency: Currency;
  currentUser?: UserAccount | null;
  onOrderSuccess: (order: OrderDetails) => void;
  onOpenTracking?: (trackingId: string) => void;
}

export const WhatsAppCheckoutModal: React.FC<WhatsAppCheckoutModalProps> = ({
  isOpen,
  onClose,
  directProduct,
  cartItems,
  currency,
  currentUser,
  onOrderSuccess,
  onOpenTracking
}) => {
  const [directQty, setDirectQty] = useState(1);
  const [directColor, setDirectColor] = useState<string>('');
  const [directSize, setDirectSize] = useState<string>('');

  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    address: currentUser?.deliveryAddress || '',
    cityZone: 'inside_dhaka',
    paymentMethod: 'cod',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (directProduct) {
        setDirectQty(1);
        setDirectColor(directProduct.colors?.[0] || '');
        setDirectSize(directProduct.sizes?.[0] || '');
      }
      if (currentUser) {
        setFormData((prev) => ({
          ...prev,
          customerName: currentUser.fullName || prev.customerName,
          phone: currentUser.phone || prev.phone,
          address: currentUser.deliveryAddress || prev.address
        }));
      }
      setCompletedOrder(null);
      setFormErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, directProduct, currentUser]);

  if (!isOpen) return null;

  const orderItemsList = directProduct
    ? [
        {
          productId: directProduct.id,
          name: directProduct.name,
          bnName: directProduct.bnName,
          qty: directQty,
          unitPrice: currency === 'BDT' ? directProduct.priceBDT : directProduct.priceUSD,
          totalPrice: (currency === 'BDT' ? directProduct.priceBDT : directProduct.priceUSD) * directQty,
          color: directColor,
          size: directSize,
          sku: directProduct.sku,
          image: directProduct.image,
          iconName: directProduct.iconName,
          tint: directProduct.tint
        }
      ]
    : cartItems.map(item => ({
        productId: item.productId,
        name: item.product.name,
        bnName: item.product.bnName,
        qty: item.qty,
        unitPrice: currency === 'BDT' ? item.product.priceBDT : item.product.priceUSD,
        totalPrice: (currency === 'BDT' ? item.product.priceBDT : item.product.priceUSD) * item.qty,
        color: item.selectedColor,
        size: item.selectedSize,
        sku: item.product.sku,
        image: item.product.image,
        iconName: item.product.iconName,
        tint: item.product.tint
      }));

  const subtotal = orderItemsList.reduce((sum, it) => sum + it.totalPrice, 0);
  const selectedDelivery = DELIVERY_OPTIONS.find(d => d.id === formData.cityZone) || DELIVERY_OPTIONS[0];
  const deliveryCharge = currency === 'BDT' ? selectedDelivery.chargeBDT : selectedDelivery.chargeUSD;
  const grandTotal = subtotal + deliveryCharge;

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.customerName.trim()) {
      errors.customerName = 'Please enter customer name';
    }
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Valid phone number required (e.g. 017XXXXXXXX)';
    }
    if (!formData.address.trim()) {
      errors.address = 'Full street address and delivery location required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmOrder = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedOrderId = 'SMC-' + randomSuffix;
    const generatedTrackingId = 'SMC-TRK-' + randomSuffix;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const courier = formData.cityZone === 'inside_dhaka' ? 'Steadfast Courier BD' : 'Pathao Courier BD';

    const newOrder: OrderDetails = {
      orderId: generatedOrderId,
      trackingId: generatedTrackingId,
      createdAt: formattedDate,
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      email: currentUser?.email || `${formData.phone.replace(/\D/g, '')}@smartcart.com`,
      address: formData.address.trim(),
      cityZone: formData.cityZone,
      paymentMethod: formData.paymentMethod === 'cod' ? 'Cash On Delivery (COD)' : formData.paymentMethod === 'bkash' ? 'bKash Online' : 'Nagad Payment',
      paymentStatus: formData.paymentMethod === 'cod' ? 'cod_pending' : 'paid',
      status: 'pending',
      courierName: courier,
      estimatedDelivery: selectedDelivery.estimatedTime,
      notes: formData.notes.trim(),
      items: orderItemsList.map(it => ({
        productId: it.productId,
        name: it.name,
        bnName: it.bnName,
        qty: it.qty,
        unitPrice: it.unitPrice,
        totalPrice: it.totalPrice,
        color: it.color,
        size: it.size,
        sku: it.sku,
        image: it.image
      })),
      subtotal,
      deliveryCharge,
      discount: 0,
      grandTotal,
      currency,
      whatsappRecipient: WHATSAPP_NUMBER,
      timeline: [
        {
          status: 'pending',
          title: 'Order Placed & Transmitted',
          description: `Order transmitted to WhatsApp (${WHATSAPP_NUMBER})`,
          timestamp: formattedDate,
          completed: true
        },
        {
          status: 'processing',
          title: 'Packaging & Barcoding',
          description: 'Awaiting QC packing at SMARTCART Hub',
          timestamp: 'Upcoming',
          completed: false
        },
        {
          status: 'shipped',
          title: 'Dispatch to Courier',
          description: `Assigned to ${courier}`,
          timestamp: 'Upcoming',
          completed: false
        },
        {
          status: 'out_for_delivery',
          title: 'Out for Delivery',
          description: 'Delivery rider en route to doorstep',
          timestamp: 'Upcoming',
          completed: false
        },
        {
          status: 'delivered',
          title: 'Delivered',
          description: 'Payment collected upon parcel delivery',
          timestamp: 'Upcoming',
          completed: false
        }
      ]
    };

    const waUrl = getWhatsAppOrderUrl(newOrder, WHATSAPP_INTERNATIONAL);
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Asynchronously persist to Firebase Firestore
    try {
      saveOrderToFirestore(newOrder);
      saveLiveChatMessage({
        senderName: newOrder.customerName,
        senderPhone: newOrder.phone,
        senderRole: 'customer',
        text: `🛍️ New Order #${newOrder.orderId} placed for ${newOrder.items.length} items (${newOrder.grandTotal} ${newOrder.currency}). Tracking: ${newOrder.trackingId}`,
        createdAt: formattedDate,
        source: 'checkout'
      });
    } catch (e) {
      console.warn('Firebase order persist notice:', e);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setCompletedOrder(newOrder);
      onOrderSuccess(newOrder);
    }, 600);
  };

  const handleCopyReceipt = () => {
    if (!completedOrder) return;
    const msg = generateWhatsAppOrderMessage(completedOrder);
    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 w-full max-w-2xl my-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl text-slate-800"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <WhatsAppIcon size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-800 flex items-center gap-2">
                {completedOrder ? 'Order Transmitted Successfully' : 'WhatsApp Direct Checkout'}
                {!completedOrder && (
                  <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Instant COD
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Direct dispatch support to WhatsApp: <strong className="text-emerald-600 font-bold">{WHATSAPP_NUMBER}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        {!completedOrder ? (
          <div className="max-h-[80vh] overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Products Summary Box */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <ShoppingBag size={14} className="text-emerald-600" /> 
                  {directProduct ? 'Selected Item' : `Cart Items (${orderItemsList.length})`}
                </span>
                {directProduct && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                    Direct 1-Click Order
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                {orderItemsList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="w-12 h-12 shrink-0 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-emerald-700">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <ProductIcon name={item.iconName || 'Package'} className="w-6 h-6" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800 truncate">{item.name}</h4>
                      {item.bnName && <p className="text-[11px] text-slate-400 truncate">{item.bnName}</p>}
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                        <span>{formatCurrency(item.unitPrice, currency)} × {item.qty}</span>
                        {item.color && (
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-700 font-bold">
                            Color: {item.color}
                          </span>
                        )}
                        {item.size && (
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-700 font-bold">
                            Size: {item.size}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-sm text-slate-800">
                        {formatCurrency(item.totalPrice, currency)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Product Tuning */}
              {directProduct && (
                <div className="mt-4 pt-3 border-t border-slate-200 grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Quantity</label>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-white px-2 py-1 w-fit">
                      <button
                        type="button"
                        onClick={() => setDirectQty(Math.max(1, directQty - 1))}
                        className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-slate-800">{directQty}</span>
                      <button
                        type="button"
                        onClick={() => setDirectQty(directQty + 1)}
                        className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {directProduct.colors && directProduct.colors.length > 0 && (
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Color</label>
                      <select
                        value={directColor}
                        onChange={(e) => setDirectColor(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-600"
                      >
                        {directProduct.colors.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {directProduct.sizes && directProduct.sizes.length > 0 && (
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Size/Variant</label>
                      <select
                        value={directSize}
                        onChange={(e) => setDirectSize(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-600"
                      >
                        {directProduct.sizes.map(sz => (
                          <option key={sz} value={sz}>{sz}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Delivery Information Section */}
            <div className="space-y-4">
              <div className="border-l-4 border-emerald-600 pl-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800">
                  1. Delivery Details
                </h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <User size={13} className="text-slate-400" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tanvir Hasan"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className={`w-full rounded-xl border ${formErrors.customerName ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 bg-slate-50 focus:bg-white'} px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-emerald-600 transition`}
                  />
                  {formErrors.customerName && (
                    <p className="mt-1 text-[11px] font-bold text-rose-500">{formErrors.customerName}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Phone size={13} className="text-slate-400" />
                    Phone Number (WhatsApp Active) *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 017XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full rounded-xl border ${formErrors.phone ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 bg-slate-50 focus:bg-white'} px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-emerald-600 transition`}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-[11px] font-bold text-rose-500">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Delivery Zone Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Truck size={13} className="text-slate-400" />
                  Select Delivery Zone *
                </label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {DELIVERY_OPTIONS.map((opt) => {
                    const isSelected = formData.cityZone === opt.id;
                    const fee = currency === 'BDT' ? opt.chargeBDT : opt.chargeUSD;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setFormData({ ...formData, cityZone: opt.id as any })}
                        className={`text-left p-3 rounded-xl border transition ${
                          isSelected
                            ? 'border-2 border-emerald-600 bg-emerald-50/40 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{opt.name}</span>
                          <span className="text-xs font-black text-emerald-600">{formatCurrency(fee, currency)}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{opt.bnName}</p>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1">⏳ {opt.estimatedTime}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin size={13} className="text-slate-400" />
                  Full Delivery Address *
                </label>
                <textarea
                  rows={2}
                  placeholder="House number, road number, area, thana & district details..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full rounded-xl border ${formErrors.address ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 bg-slate-50 focus:bg-white'} px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-emerald-600 transition`}
                />
                {formErrors.address && (
                  <p className="mt-1 text-[11px] font-bold text-rose-500">{formErrors.address}</p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <div className="border-l-4 border-emerald-600 pl-3 mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800">
                    2. Payment Option
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'cod', label: 'Cash on Delivery', sub: 'Pay upon arrival', badge: 'Most Popular' },
                    { id: 'bkash', label: 'bKash Payment', sub: 'Instant mobile pay', badge: 'Fast' },
                    { id: 'nagad', label: 'Nagad Payment', sub: 'Easy mobile pay', badge: 'Fast' }
                  ].map((p) => {
                    const isSelected = formData.paymentMethod === p.id;
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setFormData({ ...formData, paymentMethod: p.id as any })}
                        className={`p-3 rounded-xl border text-left transition ${
                          isSelected
                            ? 'border-2 border-emerald-600 bg-emerald-50/40 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{p.label}</span>
                          {p.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              {p.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{p.sub}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <FileText size={13} className="text-slate-400" />
                  Order Notes / Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leave package with front desk if unavailable..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium outline-none focus:border-emerald-600 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Bill Summary */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 text-xs">
                <span>Subtotal ({orderItemsList.length} items):</span>
                <span className="font-bold text-slate-800">{formatCurrency(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-xs">
                <span>Delivery Charge ({selectedDelivery.name}):</span>
                <span className="font-bold text-emerald-600">{formatCurrency(deliveryCharge, currency)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-sm text-slate-800">Total Payable:</span>
                  <p className="text-[10px] text-slate-400">Cash on delivery eligible</p>
                </div>
                <span className="text-2xl font-black text-emerald-600">
                  {formatCurrency(grandTotal, currency)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] py-4 px-6 font-bold text-white text-sm uppercase tracking-wider shadow-md transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                <WhatsAppIcon size={20} className="shrink-0" />
                <span>
                  {isSubmitting ? 'Transmitting to WhatsApp...' : 'Submit Order on WhatsApp'}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-500 font-medium">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Your order is directly dispatched to WhatsApp Hotline <strong className="text-slate-800">{WHATSAPP_NUMBER}</strong></span>
              </div>
            </div>
          </div>
        ) : (
          /* Order Completed Screen */
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="rounded-md bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                  Order #{completedOrder.orderId}
                </span>
                <span className="rounded-md bg-indigo-50 border border-indigo-200 px-3 py-1 font-mono text-xs font-black text-indigo-800">
                  Tracking: {completedOrder.trackingId}
                </span>
              </div>
              <h3 className="mt-3 text-xl sm:text-2xl font-black text-slate-800">
                Thank you, your order has been transmitted!
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto font-medium">
                Your order details have been routed to WhatsApp <strong className="text-emerald-600 font-bold">{WHATSAPP_NUMBER}</strong> for immediate dispatch confirmation.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left font-mono text-xs text-slate-700 space-y-1.5 max-h-48 overflow-y-auto">
              <p className="font-bold text-slate-900 border-b border-slate-200 pb-1">Order Details &amp; Parcel ID:</p>
              <p>📦 Tracking ID: <strong className="text-indigo-600 font-bold">{completedOrder.trackingId}</strong></p>
              <p>👤 Customer: {completedOrder.customerName} ({completedOrder.phone})</p>
              <p>📍 Address: {completedOrder.address}</p>
              <p>🚚 Courier: {completedOrder.courierName}</p>
              <p>📦 Items: {completedOrder.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</p>
              <p className="font-bold text-emerald-600">💰 Grand Total: {formatCurrency(completedOrder.grandTotal, completedOrder.currency)} (incl. delivery)</p>
            </div>

            {/* Action buttons */}
            <div className="grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => {
                  if (onOpenTracking) {
                    onClose();
                    onOpenTracking(completedOrder.trackingId);
                  }
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition"
              >
                <Truck size={15} />
                <span>Track Parcel</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const url = getWhatsAppOrderUrl(completedOrder, WHATSAPP_INTERNATIONAL);
                  window.open(url, '_blank');
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition"
              >
                <WhatsAppIcon size={16} />
                <span>Open WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopyReceipt}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <Copy size={15} />
                <span>{copied ? 'Copied!' : 'Copy Receipt'}</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 underline transition"
              >
                Continue Browsing Store
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

