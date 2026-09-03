import React, { useState, useEffect } from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { WHATSAPP_INTERNATIONAL } from '../data/products';
import { getWhatsAppDirectChatUrl, formatCurrency } from '../utils/whatsapp';
import { Product, Currency } from '../types';
import { ProductIcon } from './ProductIcon';

interface DealsCountdownProps {
  products?: Product[];
  currency?: Currency;
  onAddToCart?: (product: Product, qty?: number, color?: string, size?: string) => void;
  onDirectWhatsAppOrder?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export const DealsCountdown: React.FC<DealsCountdownProps> = ({
  products = [],
  currency = 'BDT',
  onAddToCart,
  onDirectWhatsAppOrder,
  onViewDetails
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 11,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const target = Date.now() + 11 * 3600 * 1000 + 42 * 60 * 1000 + 19 * 1000;
    const interval = setInterval(() => {
      const remaining = Math.max(0, target - Date.now());
      const totalSec = Math.floor(remaining / 1000);
      setTimeLeft({
        hours: Math.floor(totalSec / 3600),
        minutes: Math.floor((totalSec % 3600) / 60),
        seconds: totalSec % 60
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClaimDealWhatsApp = () => {
    const url = getWhatsAppDirectChatUrl('হ্যালো! আমি আজকের Flash Sale ডিসকাউন্ট অফার সম্পর্কে জানতে ও অর্ডার করতে চাই।', WHATSAPP_INTERNATIONAL);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="deals" className="px-4 py-8 sm:px-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 relative overflow-hidden">
        <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-700">
              <Flame size={14} className="text-emerald-600 fill-emerald-600" />
              <span>Mega Flash Sale Live • Up to 45% Off</span>
            </span>

            <h2 className="mt-4 text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">
              Limited Time Deals & Instant Booking
            </h2>
            <p className="mt-2.5 max-w-md text-xs sm:text-sm text-slate-500 font-medium">
              Order your favorite gadgets before the flash countdown expires. Direct cash on delivery support.
            </p>
          </div>

          {/* Countdown Box & Button */}
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Hours */}
              <div className="w-20 sm:w-24 bg-slate-50 border border-slate-200 rounded-xl px-2 py-3 text-center">
                <p className="text-2xl sm:text-3xl font-black text-slate-800 tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Hours
                </p>
              </div>

              <span className="text-xl font-bold text-slate-300">:</span>

              {/* Minutes */}
              <div className="w-20 sm:w-24 bg-slate-50 border border-slate-200 rounded-xl px-2 py-3 text-center">
                <p className="text-2xl sm:text-3xl font-black text-slate-800 tabular-nums">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Minutes
                </p>
              </div>

              <span className="text-xl font-bold text-slate-300">:</span>

              {/* Seconds */}
              <div className="w-20 sm:w-24 bg-slate-50 border border-slate-200 rounded-xl px-2 py-3 text-center">
                <p className="text-2xl sm:text-3xl font-black text-emerald-600 tabular-nums">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Seconds
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center">
              <button
                onClick={handleClaimDealWhatsApp}
                className="flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-xs transition active:scale-[0.98] cursor-pointer"
              >
                <WhatsAppIcon size={18} />
                <span>Claim on WhatsApp</span>
              </button>

              <a
                href="#products"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-black px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition"
              >
                <span>Browse Products</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>

        {products.length > 0 && (
          <div className="no-scrollbar relative mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible lg:grid-cols-4 xl:grid-cols-6">
            {products.slice(0, 12).map((product) => (
              <div
                key={product.id}
                className="group w-[44%] shrink-0 snap-start rounded-xl border border-slate-200 bg-slate-50/60 p-3 transition hover:border-emerald-300 hover:shadow-sm sm:w-auto sm:shrink"
              >
                <button
                  type="button"
                  onClick={() => onViewDetails?.(product)}
                  className="flex w-full flex-col items-center gap-2 text-left cursor-pointer"
                >
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br ${product.tint || 'from-slate-100 to-slate-50'}`}
                  >
                    <ProductIcon name={product.iconName} className="w-7 h-7" />
                  </div>
                  <p className="line-clamp-2 text-center text-[11px] font-bold text-slate-700 sm:text-xs">
                    {product.name}
                  </p>
                </button>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="text-sm font-black text-emerald-600">
                    {formatCurrency(currency === 'BDT' ? product.priceBDT : product.priceUSD, currency)}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 line-through">
                    {formatCurrency(currency === 'BDT' ? product.oldPriceBDT : product.oldPriceUSD, currency)}
                  </span>
                </div>
                <div className="mt-2.5 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => onAddToCart?.(product, 1)}
                    className="flex-1 rounded-lg bg-slate-900 px-2 py-2 text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-black cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => onDirectWhatsAppOrder?.(product)}
                    className="flex items-center justify-center rounded-lg bg-[#25D366] px-2.5 py-2 text-white transition hover:bg-[#20bd5a] cursor-pointer"
                    aria-label="Order on WhatsApp"
                  >
                    <WhatsAppIcon size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

