import React from 'react';
import { motion } from 'motion/react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatCurrency } from '../utils/whatsapp';
import { ProductIcon } from './ProductIcon';
import { WhatsAppIcon } from './WhatsAppIcon';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds?: number[];
  products?: Product[];
  currency?: Currency;
  onRemoveWishlist: (id: number) => void;
  onAddToCart: (product: Product) => void;
  onDirectWhatsAppOrder: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistIds = [],
  products = [],
  currency = 'BDT',
  onRemoveWishlist,
  onAddToCart,
  onDirectWhatsAppOrder
}) => {
  const currentCurrency: Currency = (currency === 'USD' ? 'USD' : 'BDT');
  if (!isOpen) return null;

  const safeWishlistIds = Array.isArray(wishlistIds) ? wishlistIds : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const wishlistedProducts = safeProducts.filter(p => p && safeWishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
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
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative z-10 w-full max-w-xl my-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl text-slate-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center text-white font-bold">
              <Heart size={16} className="fill-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">Saved Wishlist</h3>
              <p className="text-xs text-slate-400 font-medium">{wishlistedProducts.length} items saved</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-2.5">
          {wishlistedProducts.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 mx-auto flex items-center justify-center text-slate-400 mb-3">
                <Heart size={26} />
              </div>
              <p className="font-bold text-sm text-slate-700">Your wishlist is empty</p>
              <p className="text-xs text-slate-400 mt-1">Tap the heart icon on any product to save it for later.</p>
            </div>
          ) : (
            wishlistedProducts.map((p) => {
              const price = currentCurrency === 'BDT' ? p.priceBDT : p.priceUSD;
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white shadow-2xs"
                >
                  <div className="w-14 h-14 shrink-0 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-700">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover object-center"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <ProductIcon name={p.iconName} className="w-7 h-7" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 truncate">{p.name}</h4>
                    <p className="text-xs font-black text-slate-900 mt-0.5">
                      {formatCurrency(price, currentCurrency)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onClose();
                        onDirectWhatsAppOrder(p);
                      }}
                      className="flex items-center gap-1 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] px-2.5 py-1.5 text-[11px] font-bold text-white shadow-xs uppercase tracking-wider"
                      title="Order via WhatsApp"
                    >
                      <WhatsAppIcon size={12} />
                      <span className="hidden sm:inline">Order</span>
                    </button>

                    <button
                      onClick={() => onAddToCart(p)}
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                      title="Add to cart"
                    >
                      <ShoppingBag size={13} />
                    </button>

                    <button
                      onClick={() => onRemoveWishlist(p.id)}
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 flex items-center justify-center"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
};

