import React from 'react';
import { Heart, Plus, Star, Eye, ShoppingCart } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatCurrency, getWhatsAppInquiryUrl } from '../utils/whatsapp';
import { ProductIcon } from './ProductIcon';
import { WhatsAppIcon } from './WhatsAppIcon';
import { WHATSAPP_INTERNATIONAL } from '../data/products';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (id: number) => void;
  onAddToCart: (product: Product, qty?: number, color?: string, size?: string) => void;
  onDirectWhatsAppOrder: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onDirectWhatsAppOrder,
  onViewDetails
}) => {
  const currentPrice = currency === 'BDT' ? product.priceBDT : product.priceUSD;
  const oldPrice = currency === 'BDT' ? product.oldPriceBDT : product.oldPriceUSD;
  const discountPercent = Math.round(((oldPrice - currentPrice) / oldPrice) * 100);

  const handleInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getWhatsAppInquiryUrl(product, currency, WHATSAPP_INTERNATIONAL);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 p-2 sm:p-3.5 flex flex-col justify-between transition-all duration-200 group">
      {/* Product Image Stage */}
      <div 
        onClick={() => onViewDetails(product)}
        className="relative aspect-square sm:aspect-4/3 w-full bg-slate-100 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer group/img"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const fallback = parent.querySelector('.icon-fallback');
                if (fallback) fallback.classList.remove('hidden');
              }
            }}
          />
        ) : null}

        {/* Fallback Product Icon if no image or error */}
        <div className={`icon-fallback text-emerald-700 transition-transform duration-300 group-hover:scale-110 ${product.image ? 'hidden' : 'flex items-center justify-center h-full w-full'}`}>
          <ProductIcon name={product.iconName} className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-xs" />
        </div>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute left-1.5 top-1.5 sm:left-2.5 sm:top-2.5 z-10 rounded-md bg-emerald-600 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black text-white shadow-xs">
            -{discountPercent}%
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute right-1.5 top-1.5 sm:right-2.5 sm:top-2.5 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/90 backdrop-blur-xs border border-slate-200 flex items-center justify-center transition hover:bg-white shadow-xs"
          aria-label="Wishlist"
        >
          <Heart
            size={13}
            className={isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-rose-500'}
          />
        </button>

        {/* Quick View Button (Desktop hover) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(product);
          }}
          className="hidden sm:flex absolute bottom-2 left-2 z-10 items-center gap-1 bg-white/95 border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-700 shadow-xs opacity-0 translate-y-1 transition duration-200 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-slate-50"
        >
          <Eye size={11} className="text-emerald-600" />
          <span>Quick View</span>
        </button>

        {/* Quick Add Button (Desktop hover) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="hidden sm:flex absolute bottom-2 right-2 z-10 items-center gap-1 rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 translate-y-1 transition duration-200 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-black shadow-xs"
        >
          <Plus size={11} />
          <span>Cart</span>
        </button>
      </div>

      {/* Product Content Details */}
      <div className="pt-2 sm:pt-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
              {product.category}
            </span>
            <span className="text-[8px] sm:text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1 sm:px-1.5 py-0.5 rounded border border-emerald-100/70 shrink-0">
              {product.stock}
            </span>
          </div>

          <h3 
            onClick={() => onViewDetails(product)}
            className="font-bold text-slate-800 text-[11px] sm:text-[13px] line-clamp-2 leading-snug hover:text-emerald-600 cursor-pointer transition min-h-[2rem] sm:min-h-[2.25rem]" 
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-1 mt-0.5">{product.bnName}</p>

          {/* Rating */}
          <div className="mt-1 flex items-center gap-1 text-[10px] sm:text-xs">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                />
              ))}
            </div>
            <span className="font-bold text-slate-700 text-[10px] sm:text-[11px]">{product.rating}</span>
            <span className="text-slate-400 text-[9px] sm:text-[10px]">({product.reviews})</span>
          </div>
        </div>

        {/* Pricing Block */}
        <div className="mt-2 pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-sm sm:text-lg font-black text-emerald-600 tracking-tight">
              {formatCurrency(currentPrice, currency)}
            </span>
            {oldPrice > currentPrice && (
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 line-through">
                {formatCurrency(oldPrice, currency)}
              </span>
            )}
          </div>

          {/* Action Buttons Section */}
          <div className="space-y-1.5">
            {/* Direct WhatsApp Order Button */}
            <button
              onClick={() => onDirectWhatsAppOrder(product)}
              className="w-full flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] py-1.5 sm:py-2 px-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-2xs transition cursor-pointer"
              title="Click to directly checkout this product via WhatsApp"
            >
              <WhatsAppIcon size={13} className="shrink-0" />
              <span className="truncate">WhatsApp Order</span>
            </button>

            {/* Bottom Row: Add to Cart + Instant Inquiry */}
            <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
              <button
                onClick={() => onAddToCart(product)}
                className="flex items-center justify-center gap-1 rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 py-1.5 px-1 text-[10px] sm:text-xs font-bold text-slate-700 transition"
              >
                <ShoppingCart size={11} className="text-slate-500" />
                <span>+ Cart</span>
              </button>

              <button
                onClick={handleInquiry}
                className="flex items-center justify-center gap-1 rounded-lg sm:rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 py-1.5 px-1 text-[10px] sm:text-xs font-bold text-emerald-800 transition"
                title="Ask question on WhatsApp"
              >
                <WhatsAppIcon size={11} className="text-[#25D366]" />
                <span className="truncate">Ask Info</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

