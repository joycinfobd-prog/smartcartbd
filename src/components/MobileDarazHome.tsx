import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Flame,
  ChevronRight,
  Zap,
  Truck,
  Headphones,
  Heart,
  Package,
  Clock,
} from 'lucide-react';
import { Product, Currency } from '../types';
import { CATEGORIES } from '../data/products';
import { formatCurrency } from '../utils/whatsapp';
import { ProductIcon } from './ProductIcon';

interface MobileDarazHomeProps {
  products: Product[];
  currency: Currency;
  onSelectCategory: (category: string) => void;
  onViewProduct: (product: Product) => void;
  onOpenSupport: () => void;
  onOpenWishlist: () => void;
  onOpenTracking: () => void;
}

const soldCount = (id: number) => 12 + ((id * 37) % 68);

export const MobileDarazHome: React.FC<MobileDarazHomeProps> = ({
  products,
  currency,
  onSelectCategory,
  onViewProduct,
  onOpenSupport,
  onOpenWishlist,
  onOpenTracking,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(11 * 3600 + 42 * 60 + 19);
  const popularRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
  const mm = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  const flashProducts = useMemo(
    () => products.filter((p) => p.isFlashDeal).slice(0, 8),
    [products],
  );

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const tiles: {
    key: string;
    label: string;
    grad: string;
    icon: React.ReactNode;
    onClick: () => void;
  }[] = [
    ...CATEGORIES.map((c, i) => ({
      key: c.name,
      label: c.name,
      grad: [
        'from-emerald-500 to-teal-600',
        'from-teal-500 to-cyan-600',
        'from-emerald-600 to-lime-600',
        'from-cyan-600 to-sky-600',
        'from-teal-600 to-emerald-500',
        'from-lime-600 to-emerald-600',
      ][i % 6],
      icon: <ProductIcon name={c.icon} className="w-7 h-7 text-white drop-shadow-sm" />,
      onClick: () => {
        onSelectCategory(c.name);
        scrollTo('products');
      },
    })),
    {
      key: 'flash',
      label: 'Flash Sale',
      grad: 'from-amber-500 to-orange-600',
      icon: <Zap size={26} className="text-white drop-shadow-sm" />,
      onClick: () => scrollTo('m-flash'),
    },
    {
      key: 'delivery',
      label: 'Fast Delivery',
      grad: 'from-slate-700 to-slate-900',
      icon: <Truck size={26} className="text-white drop-shadow-sm" />,
      onClick: () => scrollTo('about'),
    },
    {
      key: 'support',
      label: 'Live Support',
      grad: 'from-sky-600 to-teal-600',
      icon: <Headphones size={26} className="text-white drop-shadow-sm" />,
      onClick: onOpenSupport,
    },
    {
      key: 'wishlist',
      label: 'Wishlist',
      grad: 'from-rose-500 to-pink-600',
      icon: <Heart size={26} className="text-white drop-shadow-sm" />,
      onClick: onOpenWishlist,
    },
  ];

  return (
    <div className="sm:hidden bg-[#eef1f4]">
      {/* ---------- Icon tile grid (Daraz-style entry points) ---------- */}
      <section id="m-tiles" className="px-2 pt-2">
        <div className="grid grid-cols-5 gap-x-1.5 gap-y-3 rounded-2xl bg-white px-2 py-3.5 shadow-2xs">
          {tiles.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={t.onClick}
              className="group flex flex-col items-center gap-1.5 cursor-pointer"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${t.grad} shadow-sm transition-transform duration-200 group-active:scale-90`}
              >
                {t.icon}
              </span>
              <span className="line-clamp-2 text-center text-[10px] font-semibold leading-tight text-slate-700">
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ---------- Flash Sale card ---------- */}
      <section id="m-flash" className="px-2 pt-2">
        <div className="rounded-2xl bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2.5">
            <h2 className="flex items-center gap-1.5 text-lg font-black tracking-tight text-slate-900">
              <span className="relative flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-amber-400 to-orange-500">
                <Zap size={14} className="text-white" />
              </span>
              Flash Sale
              <span className="ml-1 flex items-center gap-0.5 rounded-md bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white tabular-nums">
                <Clock size={9} className="text-amber-400" />
                {hh}:{mm}:{ss}
              </span>
            </h2>
            <button
              type="button"
              onClick={() => scrollTo('products')}
              className="flex items-center gap-0.5 text-xs font-bold text-emerald-700 cursor-pointer"
            >
              Shop More
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1">
            {flashProducts.map((p) => {
              const price = currency === 'BDT' ? p.priceBDT : p.priceUSD;
              const old = currency === 'BDT' ? p.oldPriceBDT : p.oldPriceUSD;
              const save = old > price ? Math.round(((old - price) / old) * 100) : 0;
              const sold = soldCount(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onViewProduct(p)}
                  className="w-[42%] shrink-0 snap-start text-left cursor-pointer"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">
                        <ProductIcon name={p.iconName} className="w-12 h-12 text-emerald-700" />
                      </span>
                    )}
                    {save > 0 && (
                      <span
                        className="absolute left-0 top-0 flex flex-col items-center bg-gradient-to-b from-emerald-500 to-teal-600 px-2 py-1 text-white shadow-sm"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)' }}
                      >
                        <span className="text-[8px] font-black uppercase leading-none">Save</span>
                        <span className="text-sm font-black leading-tight">{save}%</span>
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 line-clamp-1 text-[11px] font-semibold text-slate-700">
                    {p.name}
                  </p>
                  <p className="mt-0.5 text-base font-black text-emerald-600">
                    {formatCurrency(price, currency)}
                  </p>
                  {old > price && (
                    <p className="text-[11px] font-medium text-slate-400 line-through">
                      {formatCurrency(old, currency)}
                    </p>
                  )}
                  <div className="mt-1.5 flex h-4 items-center gap-1 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-1.5">
                    <Flame size={10} className="shrink-0 text-amber-300 fill-amber-300" />
                    <span className="truncate text-[9px] font-bold text-white">{sold} Sold</span>
                    <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Popular categories horizontal rail ---------- */}
      <section id="m-cats" className="px-2 pb-3 pt-4">
        <div className="flex items-center justify-between pb-2.5">
          <h2 className="text-lg font-black tracking-tight text-slate-900">
            Popular Categories For You
          </h2>
          <button
            type="button"
            onClick={() =>
              popularRef.current?.scrollBy({ left: 260, behavior: 'smooth' })
            }
            className="flex items-center gap-0.5 text-xs font-bold text-emerald-700 cursor-pointer"
          >
            Scroll More
            <ChevronRight size={14} />
          </button>
        </div>
        <div
          ref={popularRef}
          className="no-scrollbar -mx-2 flex snap-x snap-mandatory gap-2 overflow-x-auto px-2 pb-1"
        >
          {CATEGORIES.map((c) => {
            const sample = products.find((p) => p.category === c.name);
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  onSelectCategory(c.name);
                  scrollTo('products');
                }}
                className="w-24 shrink-0 snap-start cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-2xs">
                  {sample?.image ? (
                    <img
                      src={sample.image}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${'from-emerald-500 to-teal-600'}`}>
                      <ProductIcon name={c.icon} className="w-10 h-10 text-white" />
                    </span>
                  )}
                </div>
                <p className="mt-1.5 truncate text-center text-[11px] font-semibold text-slate-700">
                  {c.name}
                </p>
              </button>
            );
          })}
          <button
            type="button"
            onClick={onOpenTracking}
            className="w-24 shrink-0 snap-start cursor-pointer"
          >
            <div className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 shadow-2xs">
              <Package size={30} className="text-emerald-400" />
            </div>
            <p className="mt-1.5 truncate text-center text-[11px] font-semibold text-slate-700">
              Track Order
            </p>
          </button>
        </div>
      </section>
    </div>
  );
};
