import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Star, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Heart,
  Share2
} from 'lucide-react';
import { Product, Currency } from '../types';
import { formatCurrency, getWhatsAppInquiryUrl } from '../utils/whatsapp';
import { ProductIcon } from './ProductIcon';
import { WhatsAppIcon } from './WhatsAppIcon';
import { WHATSAPP_INTERNATIONAL } from '../data/products';

interface ProductDetailsModalProps {
  product: Product | null;
  currency: Currency;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (id: number) => void;
  onAddToCart: (product: Product, qty: number, color?: string, size?: string) => void;
  onDirectWhatsAppOrder: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  currency,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
  onDirectWhatsAppOrder
}) => {
  if (!product) return null;

  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [copiedShare, setCopiedShare] = useState(false);

  const price = currency === 'BDT' ? product.priceBDT : product.priceUSD;
  const oldPrice = currency === 'BDT' ? product.oldPriceBDT : product.oldPriceUSD;
  const discount = Math.round(((oldPrice - price) / oldPrice) * 100);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleInquiry = () => {
    const url = getWhatsAppInquiryUrl(product, currency, WHATSAPP_INTERNATIONAL);
    window.open(url, '_blank', 'noopener,noreferrer');
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

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 w-full max-w-3xl my-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl text-slate-800"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
        >
          <X size={16} />
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {/* Left: Product Visual Presentation */}
          <div className="flex flex-col gap-4">
            <div className="relative h-64 sm:h-80 w-full rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = parent.querySelector('.details-fallback');
                      if (fallback) fallback.classList.remove('hidden');
                    }
                  }}
                />
              ) : null}

              <div className={`details-fallback text-slate-800 ${product.image ? 'hidden' : 'flex items-center justify-center'}`}>
                <ProductIcon name={product.iconName} className="w-28 h-28 sm:w-36 sm:h-36 text-slate-700" />
              </div>

              {discount > 0 && (
                <span className="absolute left-3 top-3 rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-black uppercase text-white shadow-xs">
                  -{discount}% OFF
                </span>
              )}

              <span className="absolute bottom-3 left-3 rounded-md bg-white/90 backdrop-blur-xs border border-slate-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 shadow-2xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {product.stock}
              </span>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-slate-600">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <Truck size={14} className="mx-auto mb-1 text-emerald-600" />
                <span>Fast Dispatch</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <ShieldCheck size={14} className="mx-auto mb-1 text-emerald-600" />
                <span>Genuine Quality</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <RotateCcw size={14} className="mx-auto mb-1 text-emerald-600" />
                <span>7-Day Return</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                  {product.category}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-medium text-slate-400">SKU: {product.sku}</span>
              </div>

              <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-800">{product.name}</h2>
              <p className="text-xs font-semibold text-emerald-700 mt-0.5">{product.bnName}</p>

              {/* Rating */}
              <div className="mt-2 flex items-center gap-2 text-xs">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                    />
                  ))}
                </div>
                <span className="font-bold text-slate-700">{product.rating}</span>
                <span className="text-slate-400">({product.reviews} reviews)</span>
              </div>

              {/* Pricing */}
              <div className="mt-3.5 flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {formatCurrency(price, currency)}
                </span>
                <span className="text-sm font-semibold text-slate-400 line-through">
                  {formatCurrency(oldPrice, currency)}
                </span>
                <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Save {formatCurrency(oldPrice - price, currency)}
                </span>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                {product.description}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                💡 {product.bnDescription}
              </p>

              {/* Color Options */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-3.5">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Select Color: <span className="text-emerald-600">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(col => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          selectedColor === col
                            ? 'bg-slate-800 text-white shadow-xs'
                            : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Options */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-3">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Variant/Size: <span className="text-emerald-600">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(sz => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          selectedSize === sz
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-3.5 flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center rounded-xl border border-slate-200 bg-white px-2 py-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-xs font-black text-slate-800">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="space-y-2.5 pt-4 border-t border-slate-200">
              {/* WhatsApp Checkout Direct Order Button */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDirectWhatsAppOrder(product);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] py-3.5 px-4 font-bold text-white text-xs uppercase tracking-wider shadow-sm transition active:scale-[0.99] cursor-pointer"
              >
                <WhatsAppIcon size={18} />
                <span>Direct 1-Click Order via WhatsApp</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, qty, selectedColor, selectedSize);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-900 py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition"
                >
                  <ShoppingCart size={14} />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={handleInquiry}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2.5 px-4 text-xs font-bold text-slate-700 transition"
                >
                  <WhatsAppIcon size={15} className="text-[#25D366]" />
                  <span>WhatsApp Inquiry</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className="flex items-center gap-1.5 hover:text-rose-600 font-bold transition"
                >
                  <Heart size={14} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
                  <span>{isWishlisted ? 'Wishlisted' : 'Save to Wishlist'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-slate-800 font-bold transition"
                >
                  <Share2 size={14} />
                  <span>{copiedShare ? 'Link Copied!' : 'Share Product'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

