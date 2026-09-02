import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Calendar,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { OrderDetails, Currency } from '../types';
import { formatCurrency } from '../utils/whatsapp';
import { WHATSAPP_NUMBER } from '../data/products';
import { WhatsAppIcon } from './WhatsAppIcon';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders?: OrderDetails[];
  currency?: Currency;
  whatsappNumber?: string;
  initialTrackingCode?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders = [],
  currency = 'BDT',
  whatsappNumber = WHATSAPP_NUMBER,
  initialTrackingCode = ''
}) => {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const [searchCode, setSearchCode] = useState(initialTrackingCode);
  const [foundOrder, setFoundOrder] = useState<OrderDetails | null>(null);
  const [searched, setSearched] = useState(false);

  // Auto-search if initialTrackingCode is provided
  React.useEffect(() => {
    if (initialTrackingCode && isOpen) {
      setSearchCode(initialTrackingCode);
      handleTrack(initialTrackingCode);
    } else if (isOpen && !foundOrder && safeOrders.length > 0) {
      // Default to first order for instant preview
      setFoundOrder(safeOrders[0]);
      setSearchCode(safeOrders[0].trackingId);
      setSearched(true);
    }
  }, [initialTrackingCode, isOpen, safeOrders.length]);

  if (!isOpen) return null;

  const handleTrack = (codeToSearch?: string) => {
    const query = (codeToSearch || searchCode).trim().toLowerCase();
    if (!query) return;

    setSearched(true);
    const match = safeOrders.find(
      (o) =>
        (o?.trackingId && o.trackingId.toLowerCase() === query) ||
        (o?.orderId && o.orderId.toLowerCase() === query) ||
        (o?.phone && o.phone.replace(/\D/g, '').includes(query.replace(/\D/g, ''))) ||
        (o?.email && o.email.toLowerCase().includes(query))
    );

    setFoundOrder(match || null);
  };

  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const currentStep = foundOrder ? getStatusStepIndex(foundOrder.status) : 0;

  const steps = [
    { title: 'Order Confirmed', desc: 'Order received & verified', icon: Package },
    { title: 'Processing & Packed', desc: 'Quality checked at Dhaka Hub', icon: ShieldCheck },
    { title: 'Dispatched to Courier', desc: foundOrder?.courierName || 'In Courier Transit', icon: Truck },
    { title: 'Out for Delivery', desc: 'Rider on the way', icon: MapPin },
    { title: 'Delivered', desc: 'Handed to recipient', icon: CheckCircle2 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs"
      />

      {/* Tracking Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 w-full max-w-2xl my-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl text-slate-800"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 px-5 sm:px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm ring-2 ring-indigo-400/30">
              <Truck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">Live Parcel & Order Tracking</h2>
                <span className="rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold uppercase">
                  Real-Time
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Track your shipment status across Bangladesh (Steadfast, Pathao & RedX)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white flex items-center justify-center transition hover:bg-slate-700"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto space-y-5">
          {/* Search Input Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
              Enter Parcel Tracking Code or Phone Number
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTrack();
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="e.g. SMC-TRK-8921, SMC-8921, or 01712345678"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600 shadow-2xs"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition flex items-center gap-1.5"
              >
                <Search size={14} />
                <span>Track</span>
              </button>
            </form>

            {/* Quick Demo Tracking Codes */}
            {safeOrders.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="font-bold text-slate-500">Quick Test Codes:</span>
                {safeOrders.slice(0, 3).map((ord) => (
                  <button
                    key={ord.trackingId}
                    type="button"
                    onClick={() => {
                      setSearchCode(ord.trackingId);
                      handleTrack(ord.trackingId);
                    }}
                    className="font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-indigo-700 hover:bg-indigo-50 font-bold transition"
                  >
                    {ord.trackingId}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Result Display */}
          {searched && !foundOrder ? (
            <div className="py-10 text-center rounded-xl border border-dashed border-rose-200 bg-rose-50/50 p-6">
              <AlertCircle size={32} className="mx-auto text-rose-500 mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">No Shipment Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                We couldn't find any parcel matching &quot;<span className="font-mono font-bold text-slate-700">{searchCode}</span>&quot;. Please verify your tracking ID or phone number.
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello%20SMARTCART,%20please%20help%20me%20track%20my%20order:%20${encodeURIComponent(searchCode)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#25D366] text-white text-xs font-bold shadow-xs hover:bg-[#20bd5a] transition"
              >
                <WhatsAppIcon size={14} />
                <span>Ask Support on WhatsApp</span>
              </a>
            </div>
          ) : foundOrder ? (
            <div className="space-y-5">
              {/* Order Meta Bar */}
              <div className="bg-linear-to-r from-indigo-50/80 via-white to-indigo-50/40 p-4 rounded-xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black text-indigo-950 bg-indigo-100/90 px-2 py-0.5 rounded-md border border-indigo-200">
                      Tracking: {foundOrder.trackingId}
                    </span>
                    <span className="text-xs font-bold text-slate-700">Order #{foundOrder.orderId}</span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        foundOrder.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : foundOrder.status === 'out_for_delivery'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}
                    >
                      {foundOrder.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Courier: <strong className="text-slate-800">{foundOrder.courierName}</strong> • Estimated Delivery:{' '}
                    <strong className="text-indigo-700">{foundOrder.estimatedDelivery}</strong>
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Collect On Delivery</span>
                  <span className="text-base font-black text-emerald-600">
                    {formatCurrency(foundOrder.grandTotal, foundOrder.currency)}
                  </span>
                </div>
              </div>

              {/* Visual Progress Stepper */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-1.5">
                  <Truck size={14} className="text-indigo-600" />
                  Shipment Progress Timeline
                </h4>

                {/* Progress Bar Line */}
                <div className="relative">
                  <div className="absolute top-4 left-4 right-4 h-1 bg-slate-100 -z-0 hidden sm:block">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, (currentStep / (steps.length - 1)) * 100))}%` }}
                    />
                  </div>

                  <div className="grid sm:grid-cols-5 gap-3 relative z-10">
                    {steps.map((step, idx) => {
                      const Icon = step.icon;
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div key={step.title} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs transition-all ${
                              isCompleted
                                ? isCurrent
                                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-sm'
                                  : 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                          >
                            <Icon size={14} />
                          </div>
                          <div>
                            <p
                              className={`text-xs font-bold ${
                                isCompleted ? 'text-slate-800' : 'text-slate-400'
                              }`}
                            >
                              {step.title}
                            </p>
                            <p className="text-[10px] text-slate-400 hidden sm:block mt-0.5">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Milestones Log & Recipient Details */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Delivery Address & Customer Details */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <MapPin size={13} className="text-indigo-600" />
                    Delivery Destination
                  </h5>
                  <p className="font-bold text-slate-800">{foundOrder.customerName}</p>
                  <p className="text-slate-600 font-medium">📞 {foundOrder.phone}</p>
                  <p className="text-slate-600 font-medium">📍 {foundOrder.address}</p>
                  <p className="text-[11px] text-slate-400">Payment: {foundOrder.paymentMethod}</p>
                </div>

                {/* Items in Package */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Package size={13} className="text-indigo-600" />
                    Items in Shipment ({foundOrder.items.reduce((acc, i) => acc + i.qty, 0)})
                  </h5>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {foundOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-700 bg-white p-2 rounded-lg border border-slate-100">
                        <span className="font-medium truncate pr-2">
                          {item.name} <span className="text-slate-400 font-bold">x{item.qty}</span>
                        </span>
                        <span className="font-bold shrink-0">{formatCurrency(item.totalPrice, foundOrder.currency)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Timeline History */}
              {foundOrder.timeline && foundOrder.timeline.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Clock size={13} className="text-indigo-600" />
                    Detailed Status Log
                  </h5>
                  <div className="space-y-2.5">
                    {foundOrder.timeline.map((event, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${event.completed ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <div className="flex-1">
                          <div className="flex items-baseline justify-between">
                            <span className={`font-bold ${event.completed ? 'text-slate-800' : 'text-slate-400'}`}>
                              {event.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{event.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=Tracking%20Inquiry%20for%20Parcel%20${foundOrder.trackingId}%20(Order%20${foundOrder.orderId})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition"
                >
                  <WhatsAppIcon size={14} />
                  <span>WhatsApp Delivery Support</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Close Tracker
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};
