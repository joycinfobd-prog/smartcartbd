import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatCurrency } from '../utils/whatsapp';
import { WhatsAppIcon } from './WhatsAppIcon';
import { ProductIcon } from './ProductIcon';
import { WHATSAPP_NUMBER } from '../data/products';

interface HeroProps {
  featuredProduct: Product;
  /** Daraz-style slider items. Falls back to the single featured product. */
  featuredProducts?: Product[];
  currency: Currency;
  onAddToCart: (product: Product) => void;
  onDirectWhatsAppOrder: (product: Product) => void;
}

export const Hero: React.FC<HeroProps> = ({
  featuredProduct,
  featuredProducts = [],
  currency,
  onAddToCart,
  onDirectWhatsAppOrder
}) => {
  // Build the slide deck (unique products, hero product always first)
  const slides = useMemo(() => {
    const deck: Product[] = [];
    const seen = new Set<number>();
    [featuredProduct, ...featuredProducts].forEach((p) => {
      if (p && !seen.has(p.id)) {
        seen.add(p.id);
        deck.push(p);
      }
    });
    return deck.slice(0, 6);
  }, [featuredProduct, featuredProducts]);

  const [slideIndex, setSlideIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setSlideIndex(0);
  }, [slides.length]);

  // Auto-rotate the slider (Daraz style banner behaviour)
  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const timer = setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length, paused]);

  const featured = slides[slideIndex] || featuredProduct;
  const goPrev = () => setSlideIndex((i) => (i - 1 + slides.length) % slides.length);
  const goNext = () => setSlideIndex((i) => (i + 1) % slides.length);

  const currentPrice = currency === 'BDT' ? featured.priceBDT : featured.priceUSD;
  const oldPrice = currency === 'BDT' ? featured.oldPriceBDT : featured.oldPriceUSD;
  const discount = oldPrice > currentPrice
    ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
    : 0;

  return (
    <section id="home" className="w-full px-4 py-8 sm:px-8 max-w-7xl mx-auto">
      <div className="grid w-full lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        {/* Left Column: Hero Narrative & Key Points */}
        <div className="lg:col-span-7 flex min-w-0 max-w-full flex-col justify-between py-2">
          <div>
            <div className="inline-flex max-w-full flex-wrap items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] sm:text-xs font-bold text-emerald-700 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>100% Genuine • Direct WhatsApp Checkout</span>
            </div>

            <h1 className="text-[26px] sm:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight leading-[1.15] break-words">
              Smart Shopping with <span className="text-emerald-600">Geometric Balance</span> & Instant WhatsApp
            </h1>

            <p className="mt-5 text-[13px] sm:text-base text-slate-500 leading-relaxed max-w-xl font-medium break-words">
              আপনার পছন্দের প্রিমিয়াম জুতো, গ্যাজেট ও ইলেকট্রনিক্স অর্ডার করুন কোনো অ্যাকাউন্ট ছাড়াই। 
              ডেলিভারি ঠিকানা ও ফোন নম্বর প্রদান করে সরাসরি <strong className="text-slate-800">WhatsApp ({WHATSAPP_NUMBER})</strong>-এ ১-ক্লিকে নিশ্চিত করুন ক্যাশ অন ডেলিভারি।
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => onDirectWhatsAppOrder(featured)}
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-7 py-4 rounded-2xl shadow-md flex items-center justify-center gap-3 font-bold text-sm uppercase tracking-wider transition-transform active:scale-[0.98] cursor-pointer"
              >
                <WhatsAppIcon size={20} />
                <span>Order on WhatsApp</span>
              </button>

              <a
                href="#products"
                className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-2xs transition"
              >
                <span>Browse Collection</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Value Props Row */}
          <div className="mt-10 pt-6 border-t border-slate-200 grid w-full max-w-full grid-cols-3 gap-2 sm:gap-4">
            <div className="border-l-2 border-slate-200 pl-3">
              <p className="text-lg sm:text-2xl font-black text-slate-800 truncate">45K+</p>
              <p className="text-[9px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wide sm:tracking-wider break-words">Orders Sent</p>
            </div>
            <div className="border-l-2 border-emerald-600 pl-3">
              <p className="text-lg sm:text-2xl font-black text-emerald-600 truncate">100%</p>
              <p className="text-[9px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wide sm:tracking-wider break-words">Cash on Delivery</p>
            </div>
            <div className="border-l-2 border-slate-200 pl-3">
              <p className="text-lg sm:text-2xl font-black text-slate-800 truncate">4.9 ★</p>
              <p className="text-[9px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wide sm:tracking-wider break-words">Reviews</p>
            </div>
          </div>
        </div>

        {/* Right Column: Geometric Featured Card */}
        <div className="lg:col-span-5 flex min-w-0 max-w-full">
          <div
            className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
          >
            {/* Visual Header Box */}
            <div className="h-64 sm:h-72 bg-slate-100 flex items-center justify-center relative border-b border-slate-200 overflow-hidden">
              <div className="w-full h-full relative overflow-hidden group">
                {featured.image ? (
                  <img
                    src={featured.image}
                    alt={featured.name}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = parent.querySelector('.hero-fallback');
                        if (fallback) fallback.classList.remove('hidden');
                      }
                    }}
                  />
                ) : null}

                <div className={`hero-fallback w-full h-full flex items-center justify-center ${featured.image ? 'hidden' : ''}`}>
                  <ProductIcon name={featured.iconName} className="w-32 h-32 text-emerald-700 drop-shadow-md" />
                </div>

                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs border border-slate-200 text-slate-800 px-3 py-1 rounded-lg text-xs font-bold shadow-2xs">
                  Featured Choice
                </span>

                {discount > 0 && (
                  <span className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-black shadow-2xs">
                    {discount}% OFF
                  </span>
                )}

                {/* Slider arrows */}
                {slides.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      aria-label="Previous product"
                      className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-slate-700 shadow-xs transition hover:bg-white cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="Next product"
                      className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-slate-700 shadow-xs transition hover:bg-white cursor-pointer"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Daraz-style slide thumbnails (multiple products visible) */}
            {slides.length > 1 && (
              <div className="no-scrollbar flex items-center gap-2 overflow-x-auto border-b border-slate-100 px-3 py-2.5">
                {slides.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSlideIndex(i)}
                    aria-label={p.name}
                    className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 bg-slate-100 transition cursor-pointer ${
                      i === slideIndex
                        ? 'border-emerald-500 ring-2 ring-emerald-100'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">
                        <ProductIcon name={p.iconName} className="h-6 w-6 text-emerald-700" />
                      </span>
                    )}
                  </button>
                ))}
                <div className="ml-auto flex shrink-0 items-center gap-1 pl-2">
                  {slides.map((p, i) => (
                    <span
                      key={`dot-${p.id}`}
                      className={`h-1.5 rounded-full transition-all ${
                        i === slideIndex ? 'w-4 bg-emerald-600' : 'w-1.5 bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Card Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      {featured.category}
                    </span>
                    <h2 className="text-xl font-bold text-slate-800">
                      {featured.name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-600 block">
                      {formatCurrency(currentPrice, currency)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {formatCurrency(oldPrice, currency)}
                    </span>
                  </div>
                </div>

                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4">
                  {featured.description}
                </p>

                {/* Geometric Pill Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                    Stock: {featured.stock}
                  </div>
                  <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                    Rating: {featured.rating} ★ ({featured.reviews})
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onDirectWhatsAppOrder(featured)}
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl shadow-xs font-bold text-xs flex items-center justify-center gap-2 uppercase tracking-wider transition cursor-pointer"
                >
                  <WhatsAppIcon size={16} />
                  <span>WhatsApp Buy</span>
                </button>

                <button
                  onClick={() => onAddToCart(featured)}
                  className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

