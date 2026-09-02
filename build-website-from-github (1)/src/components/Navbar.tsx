import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  Zap,
  Package,
  User,
  LogOut,
  ShieldCheck,
  Headphones,
  ChevronDown
} from 'lucide-react';
import { Currency, StoreSettings, UserAccount } from '../types';

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currency: Currency;
  onToggleCurrency: () => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  storeSettings: StoreSettings;
  currentUser: UserAccount | null;
  unreadNotificationsCount?: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenUnifiedAuth: () => void;
  onOpenTracking: () => void;
  onOpenRoleDashboard: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchTerm,
  onSearchChange,
  currency,
  onToggleCurrency,
  cartCount,
  cartTotal,
  wishlistCount,
  storeSettings,
  currentUser,
  onOpenCart,
  onOpenWishlist,
  onOpenUnifiedAuth,
  onOpenTracking,
  onOpenRoleDashboard,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setUserDropdownOpen(false);
    onLogout();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f8fafc]/95 backdrop-blur-md pt-2.5 pb-2 border-b border-slate-200/60">
      {/* Floating Rounded Pill Navigation Bar (Matching Clean Modern Look) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="bg-white rounded-full border border-slate-200/90 shadow-sm px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 sm:gap-4 transition-all">
          
          {/* SMARTCART Modern Brand Logo with 'S' Emblem */}
          <a href="#home" className="flex items-center gap-2.5 group shrink-0">
            {/* Custom Modern 'S' Emblem */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-sm flex items-center justify-center text-white font-black text-lg transition-transform duration-300 group-hover:scale-105">
              <span>S</span>
            </div>

            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 font-sans flex items-center">
                SMART<span className="text-emerald-600">CART</span>
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.2em] font-extrabold text-slate-400 uppercase -mt-0.5">
                VERIFIED STORE • DHAKA
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <a 
              href="#home" 
              className="bg-[#0b1120] text-white px-4 py-1.5 rounded-full hover:bg-slate-800 transition"
            >
              Home
            </a>
            <a 
              href="#products" 
              className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition"
            >
              Shop
            </a>
            <a 
              href="#deals" 
              className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition flex items-center gap-1"
            >
              <Zap size={13} className="text-amber-500 fill-amber-500" />
              <span>Flash Deals</span>
            </a>
            <a 
              href="#about" 
              className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition"
            >
              About
            </a>
            <a 
              href="#contact" 
              className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition"
            >
              Contact
            </a>
          </nav>

          {/* Rounded Pill Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs xl:max-w-sm items-center gap-2 bg-slate-50 hover:bg-slate-100/80 focus-within:bg-white border border-slate-200 rounded-full px-3.5 py-1.5 text-xs transition-all">
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent text-slate-800 font-medium outline-none placeholder:text-slate-400 text-xs"
              placeholder="Search panjabi, saree, oud, gadgets..."
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Track Order Button */}
            <button
              onClick={onOpenTracking}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-1.5 rounded-full transition cursor-pointer"
            >
              <Package size={14} className="text-emerald-600" />
              <span>Track Order</span>
            </button>

            {/* Currency Toggle (BDT / USD) */}
            <button
              onClick={onToggleCurrency}
              className="hidden xl:flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full border border-slate-200 transition"
              title="Toggle Currency"
            >
              <span className={currency === 'BDT' ? 'text-indigo-600 font-black' : 'text-slate-400'}>৳ BDT</span>
              <span className="text-slate-300">/</span>
              <span className={currency === 'USD' ? 'text-slate-900 font-black' : 'text-slate-400'}>$ USD</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 rounded-full text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition"
              aria-label="Wishlist"
            >
              <Heart size={18} className={wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* SIGN IN / USER PROFILE MENU / SIGN OUT BUTTON */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition border cursor-pointer ${
                    currentUser.role === 'admin'
                      ? 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
                      : currentUser.role === 'moderator'
                      ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                      : currentUser.role === 'support'
                      ? 'bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100'
                      : 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100'
                  }`}
                >
                  <User size={14} className="text-slate-700" />
                  <span className="max-w-[100px] truncate">
                    {currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'Account'}
                  </span>
                  {currentUser.role === 'admin' && (
                    <span className="text-[10px] bg-purple-600 text-white px-1.5 py-0.2 rounded font-mono font-bold">Admin</span>
                  )}
                  <ChevronDown size={12} className="text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fadeIn">
                    <div className="p-3 border-b border-slate-100">
                      <p className="text-xs font-black text-slate-800 truncate">{currentUser.fullName}</p>
                      <p className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email || currentUser.phone}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                        {currentUser.role || 'customer'}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenRoleDashboard();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                      >
                        {currentUser.role === 'admin' ? (
                          <ShieldCheck size={14} className="text-purple-600" />
                        ) : currentUser.role === 'moderator' ? (
                          <Package size={14} className="text-amber-600" />
                        ) : currentUser.role === 'support' ? (
                          <Headphones size={14} className="text-sky-600" />
                        ) : (
                          <User size={14} className="text-indigo-600" />
                        )}
                        <span>{currentUser.role === 'customer' ? 'My Account & Orders' : 'Open Workspace Dashboard'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenTracking();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                      >
                        <Package size={14} className="text-emerald-600" />
                        <span>Track My Order</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>Sign Out (লগআউট)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* CLEAN SIGN IN BUTTON (Matching Demo Screenshot) */
              <button
                onClick={onOpenUnifiedAuth}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 shadow-2xs transition cursor-pointer"
              >
                <User size={14} className="text-slate-600" />
                <span>Sign In</span>
              </button>
            )}

            {/* Cart Bag Icon with Badge */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full text-slate-800 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingBag size={20} className="text-slate-800" />
              {cartCount > 0 ? (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] font-black flex items-center justify-center animate-scaleIn">
                  {cartCount}
                </span>
              ) : (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-indigo-600"></span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar on small screens */}
        <div className="mt-2 md:hidden">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3.5 py-1.5 text-xs shadow-xs">
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent text-slate-800 font-medium outline-none placeholder:text-slate-400 text-xs"
              placeholder="Search products, shoes, headphones..."
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-fadeIn mt-2">
          <nav className="flex flex-col space-y-2 text-sm font-bold text-slate-700">
            <a 
              href="#home" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl bg-slate-100 text-slate-900"
            >
              Home
            </a>
            <a 
              href="#products" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-50"
            >
              Shop Collection
            </a>
            <a 
              href="#deals" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Flash Deals</span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">50% OFF</span>
            </a>
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-50"
            >
              About Us
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-50"
            >
              Contact
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracking();
              }}
              className="text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center gap-2 text-emerald-700 font-bold"
            >
              <Package size={15} />
              <span>Track Order</span>
            </button>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {currentUser ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">{currentUser.fullName}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg"
                >
                  Sign Out (লগআউট)
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenUnifiedAuth();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <User size={15} />
                <span>Sign In / Create Account</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
