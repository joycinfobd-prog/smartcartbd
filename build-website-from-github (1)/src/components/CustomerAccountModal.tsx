import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  Package,
  Heart,
  LogOut,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
  Edit2,
  Save,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserAccount, OrderDetails, Product, Currency } from '../types';
import { formatCurrency } from '../utils/whatsapp';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLogin: (user: UserAccount) => void;
  onRegister: (user: UserAccount) => void;
  onUpdateProfile?: (user: UserAccount) => void;
  onUpdateUser?: (user: UserAccount) => void;
  onLogout: () => void;
  orders?: OrderDetails[];
  allOrders?: OrderDetails[];
  wishlistIds?: number[];
  products?: Product[];
  currency?: Currency;
  onOpenTracking?: (trackingCode: string) => void;
  onAddToCart?: (product: Product) => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onRegister,
  onUpdateProfile,
  onUpdateUser,
  onLogout,
  orders = [],
  allOrders = [],
  wishlistIds = [],
  products = [],
  currency = 'BDT',
  onOpenTracking,
  onAddToCart
}) => {
  const currentCurrency: Currency = (currency === 'USD' ? 'USD' : 'BDT');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [userTab, setUserTab] = useState<'orders' | 'address' | 'wishlist' | 'profile'>('orders');
  const [showPassword, setShowPassword] = useState(false);

  // Combine orders / allOrders safely
  const effectiveOrders = (orders && orders.length > 0) ? orders : (allOrders || []);
  const safeProducts = Array.isArray(products) ? products : [];
  const safeWishlistIds = Array.isArray(wishlistIds) ? wishlistIds : [];

  // Login Form
  const [loginPhone, setLoginPhone] = useState('01794608874');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Dhaka');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser?.fullName || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editAddress, setEditAddress] = useState(currentUser?.deliveryAddress || '');
  const [editCity, setEditCity] = useState(currentUser?.city || 'Dhaka');

  const [notificationMsg, setNotificationMsg] = useState('');

  React.useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.fullName);
      setEditPhone(currentUser.phone);
      setEditEmail(currentUser.email);
      setEditAddress(currentUser.deliveryAddress);
      setEditCity(currentUser.city);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  // Filter orders associated with this user
  const userOrders = currentUser && Array.isArray(effectiveOrders)
    ? effectiveOrders.filter(
        (o) =>
          (o?.phone && currentUser?.phone && o.phone.replace(/\D/g, '').includes(currentUser.phone.replace(/\D/g, ''))) ||
          (currentUser?.email && o?.email && o.email.toLowerCase() === currentUser.email.toLowerCase()) ||
          (o?.customerName && currentUser?.fullName && o.customerName.toLowerCase() === currentUser.fullName.toLowerCase())
      )
    : [];

  const wishlistedProducts = safeProducts.filter((p) => safeWishlistIds.includes(p.id));

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone.trim()) return;

    // Simulate authentication
    const matchedUser: UserAccount = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      fullName: loginPhone === '01794608874' ? 'Joy Chowdhury' : 'Valued Customer',
      phone: loginPhone,
      role: 'customer',
      status: 'active',
      email: loginPhone === '01794608874' ? 'joyc.info.bd@gmail.com' : `${loginPhone}@smartcart.com`,
      deliveryAddress: loginPhone === '01794608874' ? 'House #12, Road #4, Dhanmondi, Dhaka' : 'Dhaka, Bangladesh',
      city: 'Dhaka',
      joinedDate: 'August 2026',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      membershipLevel: 'SMART Club Member'
    };

    onLogin(matchedUser);
    setNotificationMsg(`Welcome back, ${matchedUser.fullName}!`);
    setTimeout(() => setNotificationMsg(''), 3000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) return;
    if (regPassword !== regConfirmPassword) {
      alert('Passwords do not match. Please check again.');
      return;
    }

    const newUser: UserAccount = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      fullName: regName,
      phone: regPhone,
      role: 'customer',
      status: 'active',
      email: regEmail || `${regPhone}@smartcart.com`,
      deliveryAddress: regAddress || 'Dhaka, Bangladesh',
      city: regCity,
      joinedDate: 'September 2026',
      membershipLevel: 'SMART Club Member'
    };

    onRegister(newUser);
    setNotificationMsg(`Account created successfully! Welcome, ${newUser.fullName}.`);
    setTimeout(() => setNotificationMsg(''), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updated: UserAccount = {
      ...currentUser,
      fullName: editName,
      phone: editPhone,
      email: editEmail,
      deliveryAddress: editAddress,
      city: editCity
    };

    if (onUpdateProfile) {
      onUpdateProfile(updated);
    } else if (onUpdateUser) {
      onUpdateUser(updated);
    }
    setIsEditingProfile(false);
    setNotificationMsg('Profile details updated successfully!');
    setTimeout(() => setNotificationMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs"
      />

      {/* Main Account Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 w-full max-w-2xl my-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl text-slate-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 px-5 sm:px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-sm ring-2 ring-amber-400/30">
              <User size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  {currentUser ? 'Customer Account Center' : 'SMARTCART Account'}
                </h2>
                <span className="rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold uppercase">
                  Daraz Style
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {currentUser
                  ? `Welcome, ${currentUser.fullName} • Member ID: ${currentUser.id}`
                  : 'Sign in to track orders, manage addresses & fast WhatsApp checkout'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white flex items-center justify-center transition hover:bg-slate-700"
          >
            <X size={16} />
          </button>
        </div>

        {/* Feedback Message */}
        {notificationMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center gap-2 text-xs font-bold text-emerald-800">
            <CheckCircle2 size={15} className="text-emerald-600" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-5 sm:p-6 max-h-[78vh] overflow-y-auto">
          {!currentUser ? (
            /* ================= GUEST AUTH (LOGIN / REGISTER) ================= */
            <div>
              {/* Tab Selector */}
              <div className="flex rounded-xl bg-slate-100 p-1 mb-6 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 rounded-lg transition ${
                    authMode === 'login' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In / Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2 rounded-lg transition ${
                    authMode === 'register' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Register New Account
                </button>
              </div>

              {authMode === 'login' ? (
                /* LOGIN FORM */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Phone size={13} className="text-slate-400" />
                      Phone Number or Email *
                    </label>
                    <input
                      type="text"
                      required
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="e.g. 01794608874 or email"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Lock size={13} className="text-slate-400" />
                        Password *
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('Password reset link sent to your registered phone via SMS.')}
                        className="text-[11px] font-bold text-indigo-600 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                      <span>Remember login on this device</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition mt-2"
                  >
                    Sign In to SMARTCART
                  </button>

                  {/* Quick Fill Test Account */}
                  <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginPhone('01794608874');
                        setLoginPassword('password123');
                      }}
                      className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
                    >
                      ⚡ Quick Fill Demo Account (Joy Chowdhury - 01794608874)
                    </button>
                  </div>
                </form>
              ) : (
                /* REGISTER FORM */
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Tanvir Hasan"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Phone Number (BD) *</label>
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">City / Zone *</label>
                      <select
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none"
                      >
                        <option value="Dhaka">Dhaka City</option>
                        <option value="Gazipur">Gazipur / Savar</option>
                        <option value="Chittagong">Chittagong</option>
                        <option value="Sylhet">Sylhet</option>
                        <option value="Rajshahi">Rajshahi</option>
                        <option value="Khulna">Khulna</option>
                        <option value="Barisal">Barisal</option>
                        <option value="Rangpur">Rangpur</option>
                        <option value="Mymensingh">Mymensingh</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Delivery Home / Office Address *</label>
                    <input
                      type="text"
                      required
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="House, Road, Area, Thana..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Create Password *</label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Confirm Password *</label>
                      <input
                        type="password"
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 pt-1">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span>
                      I agree to SMARTCART <a href="#terms" className="text-indigo-600 underline">Terms of Use</a> &amp; Privacy Policy
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={!agreedTerms}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition mt-2"
                  >
                    Create Free Customer Account
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* ================= LOGGED IN USER DASHBOARD ================= */
            <div className="space-y-5">
              {/* User Profile Card */}
              <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-5 rounded-2xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 text-center sm:text-left">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center overflow-hidden shrink-0 border-2 border-amber-300">
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                    ) : (
                      currentUser.fullName.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                      <h3 className="text-base font-black text-white">{currentUser.fullName}</h3>
                      <span className="bg-amber-500/30 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-400/30">
                        {currentUser.membershipLevel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">📞 {currentUser.phone} • ✉️ {currentUser.email}</p>
                    <p className="text-[11px] text-slate-400">Member since {currentUser.joinedDate}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition shrink-0"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex border-b border-slate-200 gap-2 overflow-x-auto text-xs font-bold pb-1">
                <button
                  onClick={() => setUserTab('orders')}
                  className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition shrink-0 ${
                    userTab === 'orders'
                      ? 'border-indigo-600 text-indigo-700 font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Package size={15} />
                  <span>My Orders &amp; Parcels ({userOrders.length})</span>
                </button>

                <button
                  onClick={() => setUserTab('address')}
                  className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition shrink-0 ${
                    userTab === 'address'
                      ? 'border-indigo-600 text-indigo-700 font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <MapPin size={15} />
                  <span>Saved Addresses</span>
                </button>

                <button
                  onClick={() => setUserTab('wishlist')}
                  className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition shrink-0 ${
                    userTab === 'wishlist'
                      ? 'border-indigo-600 text-indigo-700 font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Heart size={15} />
                  <span>My Wishlist ({wishlistedProducts.length})</span>
                </button>

                <button
                  onClick={() => setUserTab('profile')}
                  className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition shrink-0 ${
                    userTab === 'profile'
                      ? 'border-indigo-600 text-indigo-700 font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <User size={15} />
                  <span>Account Details</span>
                </button>
              </div>

              {/* USER TAB 1: MY ORDERS & TRACKING */}
              {userTab === 'orders' && (
                <div className="space-y-3">
                  {userOrders.length === 0 ? (
                    <div className="py-10 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6">
                      <Package size={28} className="mx-auto text-slate-300 mb-2" />
                      <p className="font-bold text-xs sm:text-sm text-slate-700">No active orders found for this account</p>
                      <p className="text-xs text-slate-400 mt-1">Place an order via WhatsApp Checkout to see live tracking updates here.</p>
                    </div>
                  ) : (
                    userOrders.map((ord) => (
                      <div key={ord.orderId} className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs hover:border-slate-300 transition">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-black text-indigo-950 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                              Tracking: {ord.trackingId}
                            </span>
                            <span className="text-xs font-bold text-slate-700">#{ord.orderId}</span>
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                ord.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'out_for_delivery'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}
                            >
                              {ord.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">{ord.createdAt}</span>
                        </div>

                        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <p className="font-semibold text-slate-800">
                              {ord.items.map((i) => `${i.name} (x${i.qty})`).join(', ')}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Courier: <strong className="text-slate-700">{ord.courierName}</strong> • Destination: {ord.address}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="sm:text-right">
                              <span className="text-[10px] text-slate-400 font-bold block">Total</span>
                              <span className="text-sm font-black text-emerald-600">
                                {formatCurrency(ord.grandTotal, ord.currency)}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpenTracking?.(ord.trackingId);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition"
                            >
                              <Truck size={12} />
                              <span>Track Live</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* USER TAB 2: SAVED ADDRESS */}
              {userTab === 'address' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin size={14} className="text-indigo-600" />
                        Default Home Delivery Address
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Default
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{currentUser.fullName}</p>
                    <p className="text-xs text-slate-600 mt-0.5">📞 {currentUser.phone}</p>
                    <p className="text-xs text-slate-600 mt-0.5">📍 {currentUser.deliveryAddress}, {currentUser.city}</p>
                  </div>
                </div>
              )}

              {/* USER TAB 3: WISHLIST */}
              {userTab === 'wishlist' && (
                <div className="space-y-3">
                  {wishlistedProducts.length === 0 ? (
                    <div className="py-10 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6">
                      <Heart size={28} className="mx-auto text-slate-300 mb-2" />
                      <p className="font-bold text-xs sm:text-sm text-slate-700">Your wishlist is currently empty</p>
                      <p className="text-xs text-slate-400 mt-1">Tap the heart icon on any product to save it here.</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {wishlistedProducts.map((p) => (
                        <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
                          <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded-lg bg-slate-100 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-slate-800 text-xs truncate">{p.name}</h4>
                            <p className="text-xs font-black text-emerald-600 mt-0.5">
                              {formatCurrency(p.priceBDT, currentCurrency)}
                            </p>
                            {onAddToCart && (
                              <button
                                type="button"
                                onClick={() => onAddToCart(p)}
                                className="mt-1.5 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider"
                              >
                                + Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* USER TAB 4: PROFILE SETTINGS */}
              {userTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-3.5">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Full Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Phone Number</label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Email Address</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">City</label>
                      <input
                        type="text"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Delivery Street Address</label>
                    <input
                      type="text"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-xs transition"
                    >
                      <Save size={14} />
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
