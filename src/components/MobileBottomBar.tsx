import React, { useState } from 'react';
import { Home, LayoutGrid, ShoppingBag, Headphones, User } from 'lucide-react';

interface MobileBottomBarProps {
  cartCount: number;
  supportBadge?: number;
  onGoHome: () => void;
  onOpenCategories: () => void;
  onOpenCart: () => void;
  onOpenSupport: () => void;
  onOpenAccount: () => void;
}

/**
 * Daraz-style mobile tab bar: Home / Categories / Cart / Support / Account.
 * Desktop never sees this (sm:hidden).
 */
export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  cartCount,
  supportBadge = 0,
  onGoHome,
  onOpenCategories,
  onOpenCart,
  onOpenSupport,
  onOpenAccount,
}) => {
  const [active, setActive] = useState('home');

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home size={20} />,
      onClick: onGoHome,
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: <LayoutGrid size={20} />,
      onClick: onOpenCategories,
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: (
        <span className="-mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg ring-4 ring-[#eef1f4]">
          <ShoppingBag size={20} />
        </span>
      ),
      badge: cartCount,
      onClick: onOpenCart,
      elevated: true,
    },
    {
      id: 'support',
      label: 'Support',
      icon: <Headphones size={20} />,
      badge: supportBadge,
      onClick: onOpenSupport,
    },
    {
      id: 'account',
      label: 'Account',
      icon: <User size={20} />,
      onClick: onOpenAccount,
    },
  ];

  return (
    <nav
      aria-label="Mobile tabs"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 shadow-[0_-4px_20px_-8px_rgba(15,23,42,0.18)] backdrop-blur-md sm:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto grid max-w-xl grid-cols-5">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => {
                  setActive(tab.id);
                  tab.onClick();
                }}
                className={`flex w-full flex-col items-center gap-0.5 pb-1.5 pt-2 text-[10px] font-bold transition-colors cursor-pointer ${
                  tab.elevated
                    ? 'text-emerald-700'
                    : isActive
                      ? 'text-emerald-700'
                      : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span className="relative">
                  {tab.icon}
                  {tab.badge && tab.badge > 0 ? (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white ring-2 ring-white">
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </span>
                  ) : null}
                </span>
                <span className="truncate">{tab.label}</span>
                <span
                  className={`h-0.5 w-6 rounded-full transition-colors ${
                    isActive && !tab.elevated ? 'bg-emerald-600' : 'bg-transparent'
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
