import React, { useState } from 'react';
import { ShoppingBag, CheckCircle, Send, Phone, MapPin, Mail } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { StoreSettings } from '../types';
import { getWhatsAppDirectChatUrl } from '../utils/whatsapp';

interface FooterProps {
  storeSettings: StoreSettings;
}

export const Footer: React.FC<FooterProps> = ({ storeSettings }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleOpenWhatsApp = () => {
    const url = getWhatsAppDirectChatUrl(`Hello! I am inquiring about ${storeSettings.storeName} products and orders.`, storeSettings.whatsappInternational);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer id="contact" className="px-4 pb-28 pt-8 sm:px-8 sm:pb-12 max-w-7xl mx-auto">
      {/* Newsletter Promo Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">
            Special Newsletter Offer
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Get 10% Discount on Your First WhatsApp Order
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
            Subscribe with your email for weekly flash sales, or connect directly on WhatsApp with our team.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
              <input
                required
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs sm:text-sm text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition"
              />
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-xs transition cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-2.5 text-xs sm:text-sm font-bold text-emerald-800">
              <CheckCircle size={16} className="text-emerald-600" />
              <span>Thank you! Discount voucher code has been sent to your email.</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Columns */}
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 border-t border-slate-200 pt-10">
        {/* Col 1: Brand Info */}
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-base">
              S
            </div>
            <span className="text-xl font-black tracking-tight text-slate-800">
              {storeSettings.storeName ? (
                <>
                  {storeSettings.storeName.split(' ')[0]}
                  <span className="text-emerald-600">
                    {storeSettings.storeName.split(' ').slice(1).join(' ') || ''}
                  </span>
                </>
              ) : (
                <>SMART<span className="text-emerald-600">CART</span></>
              )}
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500 font-medium">
            A balanced modern e-commerce storefront with streamlined 1-click WhatsApp order confirmation and nationwide cash on delivery.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-700">
            <Phone size={14} className="text-emerald-600" />
            <span>Hotline: </span>
            <strong className="text-emerald-600">{storeSettings.whatsappNumber}</strong>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <p className="font-bold text-xs uppercase tracking-widest text-slate-400">Navigation</p>
          <ul className="mt-3 space-y-2 text-xs font-medium text-slate-600">
            <li><a href="#products" className="hover:text-emerald-600 transition">Featured Catalog</a></li>
            <li><a href="#deals" className="hover:text-emerald-600 transition">Flash Deals Countdown</a></li>
            <li><a href="#categories" className="hover:text-emerald-600 transition">Collections</a></li>
            <li><a href="#reviews" className="hover:text-emerald-600 transition">Customer Testimonials</a></li>
          </ul>
        </div>

        {/* Col 3: Customer Service */}
        <div>
          <p className="font-bold text-xs uppercase tracking-widest text-slate-400">Support & WhatsApp</p>
          <ul className="mt-3 space-y-2 text-xs font-medium text-slate-600">
            <li>
              <button onClick={handleOpenWhatsApp} className="text-emerald-600 hover:underline flex items-center gap-1.5 font-bold">
                <WhatsAppIcon size={14} className="text-[#25D366]" />
                <span>WhatsApp Live Chat</span>
              </button>
            </li>
            <li><span>Delivery Timeline (24-72 hrs)</span></li>
            <li><span>7-Day Return Policy</span></li>
          </ul>
        </div>

        {/* Col 4: Payments & Security */}
        <div>
          <p className="font-bold text-xs uppercase tracking-widest text-slate-400">Accepted Payment</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold">
            <span className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700">
              Cash On Delivery
            </span>
            <span className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-pink-700">
              bKash
            </span>
            <span className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-amber-700">
              Nagad
            </span>
            <span className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-blue-700">
              Visa / MasterCard
            </span>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            🔒 256-bit SSL encrypted secure transactional workflow.
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-slate-400">
        <p>© 2026 {storeSettings.storeName}. All rights reserved.</p>
        <p className="flex items-center gap-1">
          WhatsApp Checkout System for <strong className="text-emerald-600">{storeSettings.whatsappNumber}</strong>
        </p>
      </div>
    </footer>
  );
};

