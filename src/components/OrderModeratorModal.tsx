import React, { useState } from 'react';
import {
  X,
  Package,
  Phone,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  Bell,
  AlertCircle,
  MapPin,
  Calendar,
  Layers,
  Send,
  User,
  LogOut,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { OrderDetails, OrderStatus, Currency, UserAccount, StaffNotification } from '../types';
import { formatCurrency, getWhatsAppDirectChatUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './WhatsAppIcon';

interface OrderModeratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  orders: OrderDetails[];
  currency: Currency;
  notifications: StaffNotification[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, courierName?: string, notes?: string) => void;
  onLogout: () => void;
  onOpenSwitchAccount: () => void;
}

export const OrderModeratorModal: React.FC<OrderModeratorModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  orders = [],
  currency = 'BDT',
  notifications = [],
  onUpdateOrderStatus,
  onLogout,
  onOpenSwitchAccount
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders[0]?.orderId || null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [internalNote, setInternalNote] = useState('');

  // Selected Order for detail view
  const safeOrders = Array.isArray(orders) ? orders : [];
  const activeOrder = safeOrders.find((o) => o.orderId === selectedOrderId) || safeOrders[0] || null;

  // Filter moderator relevant notifications
  const moderatorNotifications = notifications.filter(
    (n) => n.targetRole === 'moderator' || n.targetRole === 'all'
  );

  if (!isOpen) return null;

  // Filtered orders list
  const filteredOrders = safeOrders.filter((ord) => {
    if (!ord) return false;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (ord.orderId && ord.orderId.toLowerCase().includes(q)) ||
      (ord.trackingId && ord.trackingId.toLowerCase().includes(q)) ||
      (ord.customerName && ord.customerName.toLowerCase().includes(q)) ||
      (ord.phone && ord.phone.includes(searchQuery.trim()));

    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Metrics
  const pendingCount = safeOrders.filter((o) => o.status === 'pending').length;
  const processingCount = safeOrders.filter((o) => o.status === 'processing').length;
  const shippedCount = safeOrders.filter((o) => o.status === 'shipped').length;
  const deliveredCount = safeOrders.filter((o) => o.status === 'delivered').length;

  const handleWhatsAppCallAndConfirm = (order: OrderDetails) => {
    const itemsSummary = order.items.map((i) => `${i.name} (Qty: ${i.qty})`).join(', ');
    const msg = `আসসালামু আলাইকুম ${order.customerName} সাহেব! 

SMARTCART থেকে ${currentUser?.fullName || 'অর্ডার মডারেটর'} বলছি।
আপনার অর্ডারটি নিশ্চিত করতে যোগাযোগ করছি:

📦 অর্ডার নম্বর: #${order.orderId}
🔖 ট্র্যাকিং আইডি: ${order.trackingId}
🛍️ পণ্য: ${itemsSummary}
💰 মোট মূল্য: ${formatCurrency(order.grandTotal, order.currency)} (ক্যাশ অন ডেলিভারি)
📍 ডেলিভারি ঠিকানা: ${order.address}

অর্ডারটি কনফার্ম করতে দয়া করে 'YES' লিখে রিপ্লাই দিন অথবা কোনো তথ্য পরিবর্তন করতে চাইলে জানান। ধন্যবাদ!`;

    const url = getWhatsAppDirectChatUrl(msg, order.phone);
    window.open(url, '_blank', 'noopener,noreferrer');
    
    setActionSuccessMsg(`WhatsApp confirmation chat opened for ${order.customerName}!`);
    setTimeout(() => setActionSuccessMsg(''), 3500);
  };

  const handleStatusChange = (order: OrderDetails, newStatus: OrderStatus, courier?: string) => {
    onUpdateOrderStatus(order.orderId, newStatus, courier || order.courierName, internalNote);
    setActionSuccessMsg(`Order #${order.orderId} status updated to ${(newStatus || '').toUpperCase()}!`);
    setInternalNote('');
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Moderator Portal Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-amber-700 flex items-center justify-center font-black shadow-md shrink-0">
              <Package size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-black/20 text-amber-200 border border-amber-300/30">
                  ORDER MODERATOR PORTAL
                </span>
                <span className="text-[10px] font-bold text-white/90 bg-emerald-500/30 px-2 py-0.5 rounded-full border border-emerald-400/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Staff: {currentUser?.fullName || 'Tushar & Shakib'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                Order Verification &amp; Parcel Dispatch Center
              </h1>
              <p className="text-xs text-amber-100/80">
                Direct customer phone calling, order confirmation, and Steadfast / Pathao courier parcel booking.
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenSwitchAccount}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <User size={14} />
              <span>Switch User</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Automated Alert Ticker for Moderators */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-2 flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-bold shrink-0">Automated SMS &amp; Email Dispatch Alerts:</span>
            <span className="text-slate-600 truncate">
              {moderatorNotifications[0]?.message || 'Instant alerts active for newly placed customer orders.'}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[11px] font-bold text-amber-800 shrink-0">
            <span className="px-2 py-0.5 rounded bg-amber-200/60 border border-amber-300">📱 SMS: 01794608874</span>
            <span className="px-2 py-0.5 rounded bg-amber-200/60 border border-amber-300">📧 Email: orders@smartcart.com</span>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border-b border-slate-200">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-amber-600 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider">Pending Call</span>
              <Clock size={16} />
            </div>
            <p className="text-2xl font-black text-slate-800">{pendingCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Need phone confirmation</p>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-indigo-600 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider">In Packaging</span>
              <Package size={16} />
            </div>
            <p className="text-2xl font-black text-slate-800">{processingCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">QC &amp; packaging ready</p>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-sky-600 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider">Dispatched Hub</span>
              <Truck size={16} />
            </div>
            <p className="text-2xl font-black text-slate-800">{shippedCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">With Steadfast/Pathao</p>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-emerald-600 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider">Delivered</span>
              <CheckCircle2 size={16} />
            </div>
            <p className="text-2xl font-black text-slate-800">{deliveredCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Completed orders</p>
          </div>
        </div>

        {/* Main Content Area: Split View (List on Left, Order Detail & Actions on Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left: Orders Queue (5 columns) */}
          <div className="lg:col-span-5 border-r border-slate-200 flex flex-col overflow-hidden bg-slate-50/50">
            {/* Search & Filter Bar */}
            <div className="p-3 border-b border-slate-200 space-y-2 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Order ID, Phone, Name..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:border-amber-600 outline-none"
                />
              </div>

              {/* Status Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {['all', 'pending', 'processing', 'shipped', 'delivered'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg font-bold capitalize whitespace-nowrap transition ${
                      statusFilter === st
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'all' ? 'All Orders' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Scrollable List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No orders match your filter criteria.
                </div>
              ) : (
                filteredOrders.map((ord) => {
                  const isSelected = selectedOrderId === ord.orderId;
                  const isPending = ord.status === 'pending';
                  const isDelivered = ord.status === 'delivered';

                  return (
                    <button
                      key={ord.orderId}
                      type="button"
                      onClick={() => setSelectedOrderId(ord.orderId)}
                      className={`w-full text-left p-3 rounded-2xl border transition flex flex-col gap-1.5 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono font-bold text-xs text-slate-900 flex items-center gap-1">
                          #{ord.orderId}
                          <span className="text-[10px] text-slate-400 font-normal">({ord.trackingId})</span>
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            isPending
                              ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                              : isDelivered
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-indigo-100 text-indigo-800 border-indigo-300'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 truncate">{ord.customerName}</span>
                        <span className="font-black text-emerald-600">
                          {formatCurrency(ord.grandTotal, ord.currency)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone size={10} className="text-slate-400" />
                          {ord.phone}
                        </span>
                        <span className="text-slate-400 text-[10px]">{ord.createdAt}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Selected Order Action Station (7 columns) */}
          <div className="lg:col-span-7 flex flex-col overflow-y-auto p-4 sm:p-6 bg-white">
            {actionSuccessMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{actionSuccessMsg}</span>
              </div>
            )}

            {activeOrder ? (
              <div className="space-y-5">
                {/* Order Header Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-slate-900">
                        Order #{activeOrder.orderId}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold border border-slate-200">
                        {activeOrder.trackingId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Submitted on {activeOrder.createdAt} • Payment: {activeOrder.paymentMethod}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Grand Total</span>
                    <span className="text-xl font-black text-emerald-600">
                      {formatCurrency(activeOrder.grandTotal, activeOrder.currency)}
                    </span>
                  </div>
                </div>

                {/* Direct Action Hub for Moderators */}
                <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-600" />
                      Moderator Quick Contact &amp; Confirmation
                    </span>
                    <span className="text-[10px] font-bold text-amber-700">
                      Customer Phone: <strong className="font-mono text-slate-900">{activeOrder.phone}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* 1-Click WhatsApp Direct Call/Chat */}
                    <button
                      type="button"
                      onClick={() => handleWhatsAppCallAndConfirm(activeOrder)}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
                    >
                      <WhatsAppIcon size={16} />
                      <span>WhatsApp Order Confirm</span>
                    </button>

                    {/* Direct Telephone Call */}
                    <a
                      href={`tel:${activeOrder.phone}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
                    >
                      <Phone size={15} />
                      <span>Call {activeOrder.phone}</span>
                    </a>
                  </div>
                </div>

                {/* Customer Details & Delivery Destination */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      Customer Info
                    </span>
                    <p className="font-bold text-xs text-slate-800">{activeOrder.customerName}</p>
                    <p className="text-xs text-slate-600 font-mono mt-0.5">{activeOrder.phone}</p>
                    {activeOrder.email && (
                      <p className="text-xs text-slate-500 mt-0.5">{activeOrder.email}</p>
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      Delivery Address
                    </span>
                    <p className="font-medium text-xs text-slate-800">{activeOrder.address}</p>
                    <p className="text-[11px] font-bold text-indigo-600 mt-1 capitalize">
                      Zone: {activeOrder.cityZone.replace('_', ' ')} • Delivery Fee: ৳{activeOrder.deliveryCharge}
                    </p>
                  </div>
                </div>

                {/* Order Items Table */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
                    Ordered Products ({activeOrder.items.reduce((s, i) => s + i.qty, 0)} Items)
                  </h3>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                    {activeOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                            />
                          )}
                          <div>
                            <p className="font-bold text-xs text-slate-800">{item.name}</p>
                            <p className="text-[10px] text-slate-400">
                              SKU: {item.sku || 'N/A'} {item.color ? `• Color: ${item.color}` : ''}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-700">Qty: {item.qty}</span>
                          <p className="text-xs font-black text-slate-900">
                            {formatCurrency(item.totalPrice, activeOrder.currency)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logistics & Courier Parcel Dispatch Action */}
                <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/70">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Truck size={15} className="text-indigo-600" />
                      Courier Parcel Booking &amp; Dispatch Status
                    </span>
                    <span className="text-xs font-bold text-indigo-600 font-mono">
                      Current: {(activeOrder.status || '').toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(activeOrder, 'pending')}
                      className={`py-2 px-3 rounded-xl font-bold text-xs transition ${
                        activeOrder.status === 'pending'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Pending Call
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(activeOrder, 'processing')}
                      className={`py-2 px-3 rounded-xl font-bold text-xs transition ${
                        activeOrder.status === 'processing'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Packaging (QC)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(activeOrder, 'shipped', 'Steadfast Courier BD')}
                      className={`py-2 px-3 rounded-xl font-bold text-xs transition ${
                        activeOrder.status === 'shipped'
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Book Courier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(activeOrder, 'delivered')}
                      className={`py-2 px-3 rounded-xl font-bold text-xs transition ${
                        activeOrder.status === 'delivered'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Mark Delivered
                    </button>
                  </div>

                  {/* Courier Partner Selection */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-slate-500 font-bold">Assigned Delivery Courier:</span>
                    <div className="flex items-center gap-2">
                      {['Steadfast Courier BD', 'Pathao Courier BD', 'RedX BD'].map((cour) => (
                        <button
                          key={cour}
                          type="button"
                          onClick={() => handleStatusChange(activeOrder, activeOrder.status, cour)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                            activeOrder.courierName === cour
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {cour.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                <Package size={40} className="mx-auto mb-2 opacity-40" />
                <p className="text-xs">Select an order from the list to view full customer details and take action.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Footer Note */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <span>Logged in as <strong>{currentUser?.fullName}</strong> (Order Moderator)</span>
          <span>Official Store Helpline: <strong>01794608874</strong></span>
        </div>
      </div>
    </div>
  );
};
