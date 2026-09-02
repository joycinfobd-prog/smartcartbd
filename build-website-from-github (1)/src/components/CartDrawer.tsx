import React from 'react';
import { motion } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { CartItem, Currency } from '../types';
import { formatCurrency } from '../utils/whatsapp';
import { ProductIcon } from './ProductIcon';
import { WhatsAppIcon } from './WhatsAppIcon';
import { WHATSAPP_NUMBER } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: Currency;
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onOpenWhatsAppCheckout: () => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  onUpdateQty,
  onRemoveItem,
  onOpenWhatsAppCheckout,
  onClearCart
}) => {
  const totalCount = cartItems.reduce((sum, it) => sum + it.qty, 0);
  const subtotal = cartItems.reduce((sum, it) => {
    const p = currency === 'BDT' ? it.product.priceBDT : it.product.priceUSD;
    return sum + p * it.qty;
  }, 0);
  const oldSubtotal = cartItems.reduce((sum, it) => {
    const p = currency === 'BDT' ? it.product.oldPriceBDT : it.product.oldPriceUSD;
    return sum + p * it.qty;
  }, 0);
  const saved = Math.max(0, oldSubtotal - subtotal);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 transition-opacity"
      />

      {/* Drawer */}
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl text-slate-800"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              <ShoppingBag size={16} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">Shopping Cart</h3>
              <p className="text-xs font-medium text-slate-400">
                {totalCount} {totalCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-600 px-2 py-1 rounded transition"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
              aria-label="Close cart"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Info bar */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-2 flex items-center justify-between text-xs">
          <span className="font-bold text-emerald-800 flex items-center gap-1.5">
            <Sparkles size={13} className="text-emerald-600" />
            WhatsApp Direct Order Available
          </span>
          <span className="text-[11px] font-bold text-emerald-700">{WHATSAPP_NUMBER}</span>
        </div>

        {/* Cart Item List */}
        <div className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="mt-20 text-center px-4">
              <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                <ShoppingBag size={28} />
              </div>
              <h4 className="text-sm font-black text-slate-700">Your cart is empty</h4>
              <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto font-medium">
                Add products from the catalog to proceed with WhatsApp checkout.
              </p>
              <button
                onClick={onClose}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const unitPrice = currency === 'BDT' ? item.product.priceBDT : item.product.priceUSD;
              const itemTotal = unitPrice * item.qty;

              return (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl p-3 border border-slate-200 bg-white shadow-2xs transition hover:border-slate-300"
                >
                  <div className="w-14 h-14 shrink-0 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-700">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover object-center"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <ProductIcon name={item.product.iconName} className="w-7 h-7" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="truncate text-xs sm:text-sm font-bold text-slate-800">{item.product.name}</h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 transition p-0.5"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium truncate">
                        {item.selectedColor ? `Color: ${item.selectedColor}` : ''}
                        {item.selectedSize ? ` | Size: ${item.selectedSize}` : ''}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      {/* Quantity Controller */}
                      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-1.5 py-0.5">
                        <button
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="text-slate-500 hover:text-emerald-600 transition p-0.5"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-4 text-center text-xs font-black text-slate-800">{item.qty}</span>
                        <button
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="text-slate-500 hover:text-emerald-600 transition p-0.5"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      {/* Total price for item */}
                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-black text-slate-900">
                          {formatCurrency(itemTotal, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-800">{formatCurrency(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className="font-medium text-slate-400">Calculated at next step</span>
              </div>
              {saved > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Total Discount Saved:</span>
                  <span>-{formatCurrency(saved, currency)}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cart Total:</span>
              <span className="text-xl font-black text-slate-900">{formatCurrency(subtotal, currency)}</span>
            </div>

            {/* Dynamic WhatsApp Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onOpenWhatsAppCheckout();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] py-3.5 px-4 font-bold text-white text-xs uppercase tracking-wider shadow-sm transition active:scale-[0.99] cursor-pointer"
            >
              <WhatsAppIcon size={18} />
              <span>WhatsApp Checkout - {formatCurrency(subtotal, currency)}</span>
              <ArrowRight size={15} />
            </button>

            <p className="text-center text-[10px] font-medium text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>Cash on delivery available nationwide</span>
            </p>
          </div>
        )}
      </motion.aside>
    </div>
  );
};

