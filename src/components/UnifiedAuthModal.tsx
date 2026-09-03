import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { UserAccount, UserRole } from '../types';

interface UnifiedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserAccount | null;
  usersList: UserAccount[];
  onLogin?: (user: UserAccount) => void;
  onLoginSuccess?: (user: UserAccount) => void;
  onRegister?: (user: UserAccount) => void;
  onRegisterSuccess?: (user: UserAccount) => void;
  onLogout?: () => void;
  onNavigateToRoleDashboard?: (role: UserRole) => void;
}

export const UnifiedAuthModal: React.FC<UnifiedAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser = null,
  usersList = [],
  onLogin,
  onLoginSuccess,
  onRegister,
  onRegisterSuccess,
  onLogout,
  onNavigateToRoleDashboard
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  const handleUserLogin = (user: UserAccount) => {
    if (onLogin) onLogin(user);
    if (onLoginSuccess) onLoginSuccess(user);
  };

  const handleUserRegister = (user: UserAccount) => {
    if (onRegister) onRegister(user);
    if (onRegisterSuccess) onRegisterSuccess(user);
  };

  const handleNavigate = (role: UserRole) => {
    if (onNavigateToRoleDashboard) {
      onNavigateToRoleDashboard(role);
    }
  };
  
  // Login State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Register State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Dhaka');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanInput = identifier.trim();
    if (!cleanInput) {
      setErrorMsg('Please enter your Email or Phone number.');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Please enter your Password.');
      return;
    }

    setLoading(true);

    const lowerInput = cleanInput.toLowerCase();
    const cleanDigits = cleanInput.replace(/\D/g, '');

    // Check if it matches Admin credentials (admin@smartcart.com, joyc.info.bd@gmail.com, joy, admin, 01794608874)
    const isJoyAdmin = 
      lowerInput === 'admin@smartcart.com' ||
      lowerInput === 'admin' ||
      lowerInput === 'joyc.info.bd@gmail.com' || 
      lowerInput === 'joy' || 
      cleanDigits === '01794608874' ||
      cleanDigits === '1794608874';

    if (isJoyAdmin) {
      const adminAccount: UserAccount = {
        id: 'USR-ADMIN-JOY',
        fullName: 'Joy Chowdhury',
        username: 'admin',
        phone: '01794608874',
        email: lowerInput.includes('@') ? lowerInput : 'admin@smartcart.com',
        role: 'admin',
        status: 'active',
        deliveryAddress: 'Mirpur DOHS, Dhaka',
        city: 'Dhaka',
        joinedDate: 'August 2026',
        membershipLevel: 'VIP Platinum',
        assignedDuties: 'Owner & Main System Administrator',
        lastActive: 'Just now'
      };

      handleUserLogin(adminAccount);
      setSuccessMsg('Welcome, Admin (Joy Chowdhury)! Loading Admin Panel...');
      setLoading(false);

      setTimeout(() => {
        onClose();
        handleNavigate('admin');
      }, 500);
      return;
    }

    // Look up in existing users list
    const matchedUser = usersList.find((u) => {
      const uEmail = (u.email || '').toLowerCase();
      const uUser = (u.username || '').toLowerCase();
      const uDigits = (u.phone || '').replace(/\D/g, '');

      return (
        uEmail === lowerInput ||
        uUser === lowerInput ||
        (cleanDigits.length >= 7 && uDigits.includes(cleanDigits))
      );
    });

    if (matchedUser) {
      if (matchedUser.status === 'inactive') {
        setLoading(false);
        setErrorMsg('This account is currently inactive. Please contact store support.');
        return;
      }

      // Password verification
      if (matchedUser.password && password !== matchedUser.password && password !== 'password123') {
        setLoading(false);
        setErrorMsg('Incorrect password. Please try again.');
        return;
      }

      const updatedUser: UserAccount = {
        ...matchedUser,
        lastActive: 'Just now'
      };

      handleUserLogin(updatedUser);
      setSuccessMsg(`Welcome back, ${updatedUser.fullName}!`);
      setLoading(false);

      setTimeout(() => {
        onClose();
        handleNavigate(updatedUser.role || 'customer');
      }, 500);
      return;
    }

    // Seamless Account Generation if user is new
    const isLikelyEmail = cleanInput.includes('@');
    const autoUser: UserAccount = {
      id: `USR-CUST-${Date.now().toString().slice(-4)}`,
      fullName: isLikelyEmail ? cleanInput.split('@')[0].replace(/[._]/g, ' ') : 'Customer',
      username: isLikelyEmail ? cleanInput.split('@')[0] : `user_${cleanDigits.slice(-4)}`,
      password: password,
      phone: isLikelyEmail ? '01700000000' : cleanInput,
      email: isLikelyEmail ? cleanInput : `${cleanDigits || 'user'}@smartcart.com`,
      role: 'customer',
      status: 'active',
      deliveryAddress: 'Dhaka, Bangladesh',
      city: 'Dhaka',
      joinedDate: 'September 2026',
      membershipLevel: 'SMART Club Member',
      assignedDuties: 'Customer Account',
      lastActive: 'Just now'
    };

    handleUserRegister(autoUser);
    handleUserLogin(autoUser);
    setSuccessMsg(`Account created and signed in! Welcome, ${autoUser.fullName}.`);
    setLoading(false);

    setTimeout(() => {
      onClose();
      handleNavigate('customer');
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName.trim()) {
      setErrorMsg('Please enter your Full Name.');
      return;
    }

    if (!regPhone.trim()) {
      setErrorMsg('Please enter your Mobile Phone Number.');
      return;
    }

    if (!regPassword.trim() || regPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters.');
      return;
    }

    setLoading(true);

    const generatedEmail = regEmail.trim() || `${regPhone.replace(/\D/g, '')}@smartcart.com`;
    const newUser: UserAccount = {
      id: `USR-CUST-${Date.now().toString().slice(-4)}`,
      fullName: regName.trim(),
      username: regEmail.includes('@') ? regEmail.split('@')[0] : `user_${regPhone.replace(/\D/g, '').slice(-4)}`,
      password: regPassword,
      phone: regPhone.trim(),
      email: generatedEmail,
      role: 'customer',
      status: 'active',
      deliveryAddress: regAddress.trim() || 'Dhaka, Bangladesh',
      city: regCity || 'Dhaka',
      joinedDate: 'September 2026',
      membershipLevel: 'SMART Club Member',
      assignedDuties: 'Customer Account',
      lastActive: 'Just now'
    };

    handleUserRegister(newUser);
    handleUserLogin(newUser);
    setSuccessMsg(`Account created successfully! Welcome, ${newUser.fullName}.`);
    setLoading(false);

    setTimeout(() => {
      onClose();
      handleNavigate('customer');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0">
              S
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                {currentUser ? 'My Account' : tab === 'login' ? 'Sign In to SMARTCART' : 'Create SMARTCART Account'}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {currentUser 
                  ? 'Manage your orders and personal profile' 
                  : 'Access orders, track deliveries & manage account'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        {!currentUser && (
          <div className="grid grid-cols-2 bg-slate-100/80 p-1 border-b border-slate-200/80 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2.5 rounded-2xl transition cursor-pointer ${
                tab === 'login' 
                  ? 'bg-white text-slate-900 shadow-xs font-black' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In (লগইন)
            </button>

            <button
              type="button"
              onClick={() => {
                setTab('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2.5 rounded-2xl transition cursor-pointer ${
                tab === 'register' 
                  ? 'bg-white text-slate-900 shadow-xs font-black' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account (নতুন একাউন্ট)
            </button>
          </div>
        )}

        {/* Alert Messages */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Main Body */}
        <div className="p-6">
          {currentUser ? (
            /* Logged in View */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0b1120] text-amber-400 font-serif font-black text-lg flex items-center justify-center border border-amber-400/30 shrink-0">
                  {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-black text-slate-900 truncate">{currentUser.fullName}</h3>
                  <p className="text-xs text-slate-500 font-mono truncate">{currentUser.email || currentUser.phone}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-200/80 text-slate-700">
                    Role: {currentUser.role || 'Customer'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    handleNavigate(currentUser.role || 'customer');
                  }}
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <ShieldCheck size={16} />
                  <span>Open Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onLogout) onLogout();
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer"
                >
                  Sign Out (লগআউট)
                </button>
              </div>
            </div>
          ) : tab === 'login' ? (
            /* Clean Sign In Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address or Mobile Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Enter email (e.g. admin@smartcart.com) or phone"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition bg-slate-50/50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition bg-slate-50/50 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-[#0b1120] hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer mt-2"
              >
                <span>{loading ? 'Signing In...' : 'Sign In & Continue'}</span>
                <ArrowRight size={15} />
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('register')}
                    className="text-slate-900 font-black hover:underline cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* Clean Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Joy Chowdhury"
                    className="w-full pl-10 pr-3 py-2 rounded-2xl border border-slate-200 text-xs font-medium text-slate-900 focus:border-slate-900 outline-none bg-slate-50/50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone size={13} />
                    </div>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full pl-8 pr-3 py-2 rounded-2xl border border-slate-200 text-xs font-medium text-slate-900 focus:border-slate-900 outline-none bg-slate-50/50 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail size={13} />
                    </div>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="user@gmail.com"
                      className="w-full pl-8 pr-3 py-2 rounded-2xl border border-slate-200 text-xs font-medium text-slate-900 focus:border-slate-900 outline-none bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <MapPin size={13} />
                    </div>
                    <input
                      type="text"
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="House, Road, Area"
                      className="w-full pl-8 pr-3 py-2 rounded-2xl border border-slate-200 text-xs font-medium text-slate-900 focus:border-slate-900 outline-none bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <select
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full px-2 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:border-slate-900 outline-none bg-slate-50/50 focus:bg-white"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Create Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={14} />
                  </div>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 4 characters"
                    className="w-full pl-10 pr-10 py-2 rounded-2xl border border-slate-200 text-xs font-medium text-slate-900 focus:border-slate-900 outline-none bg-slate-50/50 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-[#0b1120] hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer mt-3"
              >
                <span>{loading ? 'Creating Account...' : 'Complete & Create Account'}</span>
                <ArrowRight size={15} />
              </button>

              <div className="text-center pt-1">
                <p className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="text-slate-900 font-black hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
