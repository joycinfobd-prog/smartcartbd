import React from 'react';
import { Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { WHATSAPP_NUMBER } from '../data/products';

export const TrustBadges: React.FC = () => {
  return (
    <section className="px-4 sm:px-8 my-8 max-w-7xl mx-auto">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Fast Courier */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4.5 flex items-center gap-3.5 hover:border-slate-300 transition">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Truck size={20} />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-800">Express Delivery</p>
            <p className="text-xs text-slate-500 font-medium">Nationwide 24-72 hours</p>
          </div>
        </div>

        {/* 24/7 WhatsApp Support */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4.5 flex items-center gap-3.5 hover:border-slate-300 transition">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <WhatsAppIcon size={20} />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-800">WhatsApp Support</p>
            <p className="text-xs text-emerald-600 font-bold">{WHATSAPP_NUMBER}</p>
          </div>
        </div>

        {/* 7-Day Return */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4.5 flex items-center gap-3.5 hover:border-slate-300 transition">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <RotateCcw size={20} />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-800">7 Days Return</p>
            <p className="text-xs text-slate-500 font-medium">Easy replacement guarantee</p>
          </div>
        </div>

        {/* Cash on delivery */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4.5 flex items-center gap-3.5 hover:border-slate-300 transition">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-800">Cash on Delivery</p>
            <p className="text-xs text-slate-500 font-medium">Pay upon receiving product</p>
          </div>
        </div>
      </div>
    </section>
  );
};

