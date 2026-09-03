import React, { useState } from 'react';
import {
  X,
  Headphones,
  MessageSquare,
  Send,
  Search,
  Filter,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  User,
  LogOut,
  Plus,
  RefreshCw
} from 'lucide-react';
import { SupportInquiry, SupportInquiryReply, UserAccount, StaffNotification } from '../types';
import { getWhatsAppDirectChatUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './WhatsAppIcon';

interface CustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  inquiries: SupportInquiry[];
  notifications: StaffNotification[];
  onAddReply: (inquiryId: string, text: string, senderName: string, isStaff: boolean) => void;
  onUpdateInquiryStatus: (inquiryId: string, status: 'open' | 'in_progress' | 'resolved') => void;
  onCreateInquiry?: (inquiry: Partial<SupportInquiry>) => void;
  onLogout?: () => void;
  onOpenSwitchAccount?: () => void;
}

export const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  inquiries = [],
  notifications = [],
  onAddReply,
  onUpdateInquiryStatus,
  onCreateInquiry,
  onLogout,
  onOpenSwitchAccount
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(inquiries[0]?.id || null);
  const [replyText, setReplyText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // New ticket modal
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustSubject, setNewCustSubject] = useState('');
  const [newCustMessage, setNewCustMessage] = useState('');
  const [newCustCategory, setNewCustCategory] = useState<'Order Status' | 'Product Question' | 'Return / Refund' | 'General'>('Product Question');

  if (!isOpen) return null;

  const safeInquiries = Array.isArray(inquiries) ? inquiries : [];

  // Determine view mode based on current user role
  const isStaff =
    !!currentUser &&
    (currentUser.role === 'support' ||
      currentUser.role === 'admin' ||
      currentUser.role === 'moderator');

  // Tickets created from THIS browser (guests included) are remembered in
  // localStorage so the visitor can return and read the team's reply.
  const [myTicketIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('smartcart_my_inquiries');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
    } catch {
      return [];
    }
  });

  // Customers/guests only see their own inquiries: tickets from this browser
  // session, or anything matching their logged-in phone / email / name.
  const scopedInquiries = isStaff
    ? safeInquiries
    : safeInquiries.filter((inq) => {
        if (myTicketIds.includes(inq.id)) return true;
        if (!currentUser) return false;
        const phoneMatch =
          currentUser.phone && inq.phone && inq.phone === currentUser.phone;
        const emailMatch =
          currentUser.email && inq.email && inq.email === currentUser.email;
        const nameMatch =
          currentUser.fullName &&
          inq.customerName &&
          inq.customerName === currentUser.fullName;
        return Boolean(phoneMatch || emailMatch || nameMatch);
      });

  const visibleInquiries = scopedInquiries;
  const activeInquiry =
    visibleInquiries.find((inq) => inq.id === selectedInquiryId) ||
    visibleInquiries[0] ||
    null;

  // Auto-open new-ticket composer for guests who have none yet
  React.useEffect(() => {
    if (!isStaff && !activeInquiry && !isCreatingNew) {
      setIsCreatingNew(true);
      if (currentUser?.fullName) setNewCustName(currentUser.fullName);
      if (currentUser?.phone) setNewCustPhone(currentUser.phone);
      if (currentUser?.email) {
        // email is read-only on the form but we can't pre-fill here
      }
    }
  }, [isStaff, activeInquiry, isCreatingNew, isOpen, currentUser]);

  // Filter support relevant notifications (staff-only)
  const supportNotifications = notifications.filter(
    (n) => n.targetRole === 'support' || n.targetRole === 'all'
  );

  const filteredInquiries = visibleInquiries.filter((inq) => {
    if (!inq) return false;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (inq.customerName && inq.customerName.toLowerCase().includes(q)) ||
      (inq.phone && inq.phone.includes(searchQuery.trim())) ||
      (inq.subject && inq.subject.toLowerCase().includes(q)) ||
      (inq.id && inq.id.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCount = safeInquiries.filter((i) => i.status === 'open').length;
  const inProgressCount = safeInquiries.filter((i) => i.status === 'in_progress').length;
  const resolvedCount = safeInquiries.filter((i) => i.status === 'resolved').length;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeInquiry) return;

    if (isStaff) {
      onAddReply(
        activeInquiry.id,
        replyText.trim(),
        currentUser?.fullName || 'Customer Support',
        true,
      );
    } else {
      onAddReply(
        activeInquiry.id,
        replyText.trim(),
        currentUser?.fullName || newCustName || 'Customer',
        false,
      );
    }
    setReplyText('');
    setSuccessMsg(
      isStaff
        ? 'Reply sent to customer ticket!'
        : 'মেসেজ পাঠানো হয়েছে। সাপোর্ট টিম শীঘ্রই উত্তর দেবে।',
    );
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleApplyPreset = (presetText: string) => {
    setReplyText(presetText);
  };

  const handleWhatsAppDirectReply = (inquiry: SupportInquiry) => {
    const msg = `আসসালামু আলাইকুম ${inquiry.customerName}!

SMARTCART কাস্টমার সাপোর্ট থেকে ${currentUser?.fullName || 'সাপোর্ট এক্সিকিউটিভ'} বলছি।
আপনার ইনকোয়ারি (#${inquiry.id}): "${inquiry.subject}" বিষয়ে সাহায্য করতে যোগাযোগ করছি।

দয়া করে আপনার বিস্তারিত বলুন। আমরা দ্রুত সহায়তা করছি।`;

    const url = getWhatsAppDirectChatUrl(msg, inquiry.phone);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCreateNewTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone || !newCustSubject) return;

    if (onCreateInquiry) {
      onCreateInquiry({
        customerName: newCustName,
        phone: newCustPhone,
        subject: newCustSubject,
        message: newCustMessage,
        category: newCustCategory,
        priority: 'normal',
        status: 'open',
        email: currentUser?.email,
      });
    }

    setIsCreatingNew(false);
    setNewCustSubject('');
    setNewCustMessage('');
    setSuccessMsg(
      isStaff
        ? 'New support ticket recorded successfully!'
        : 'আপনার মেসেজ পাঠানো হয়েছে। সাপোর্ট টিম শীঘ্রই উত্তর দেবে।',
    );
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header (adapts to staff vs customer view) */}
        <div
          className={`p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 ${
            isStaff
              ? 'bg-gradient-to-r from-sky-600 via-sky-700 to-slate-900'
              : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/95 text-sky-700 flex items-center justify-center font-black shadow-md shrink-0">
              <MessageSquare size={22} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-black/20 text-white/90 border border-white/20">
                  {isStaff ? 'STAFF HELPDESK' : '24/7 LIVE CHAT'}
                </span>
                <span className="text-[10px] font-bold text-white/95 bg-emerald-500/30 px-2 py-0.5 rounded-full border border-emerald-300/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  {isStaff ? (
                    <>Online Staff: {currentUser?.fullName || 'Rimi & Tanvir'}</>
                  ) : (
                    <>Support Team Online</>
                  )}
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-white mt-1 leading-tight">
                {isStaff
                  ? 'Customer Inquiries & Live Chat Center'
                  : 'Chat with SMARTCART Support'}
              </h1>
              <p className="text-[11px] sm:text-xs text-white/90 mt-0.5 line-clamp-2">
                {isStaff
                  ? 'Respond to buyer questions, resolve delivery inquiries, and provide fast WhatsApp assistance.'
                  : 'আপনার প্রশ্ন, অর্ডার বা প্রোডাক্ট সম্পর্কে সরাসরি মেসেজ পাঠান। আমাদের টিম কয়েক মিনিটের মধ্যে উত্তর দেবে।'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isStaff ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(!isCreatingNew)}
                  className="px-3 py-1.5 rounded-xl bg-white text-sky-800 hover:bg-sky-50 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Plus size={14} />
                  <span>New Ticket</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenSwitchAccount}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <User size={14} />
                  <span>Switch</span>
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsCreatingNew(true)}
                className="px-3 py-1.5 rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus size={14} />
                <span>New Message</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
              aria-label="Close support"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {isStaff && (
          <>
            {/* Automated Alert Ticker for Support */}
            <div className="bg-sky-50 border-b border-sky-200 px-5 py-2 hidden sm:flex items-center justify-between gap-3 text-xs text-sky-900">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                <span className="font-bold shrink-0">Automated Inquiry Alerts:</span>
                <span className="text-slate-600 truncate">
                  {supportNotifications[0]?.message || 'Real-time alert active for incoming customer messages & questions.'}
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-[11px] font-bold text-sky-800 shrink-0">
                <span className="px-2 py-0.5 rounded bg-sky-200/60 border border-sky-300">💬 Response SLA: &lt;5 mins</span>
                <span className="px-2 py-0.5 rounded bg-sky-200/60 border border-sky-300">📞 Hotline: 01794608874</span>
              </div>
            </div>

            {/* Support KPI Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border-b border-slate-200">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-amber-600 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider">Open Inquiries</span>
              <Clock size={16} />
            </div>
            <p className="text-2xl font-black text-slate-800">{openCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Awaiting first response</p>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-sky-600 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider">In Progress</span>
              <MessageSquare size={16} />
            </div>
            <p className="text-2xl font-black text-slate-800">{inProgressCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Being handled by staff</p>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-emerald-600 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider">Resolved</span>
              <CheckCircle2 size={16} />
            </div>
            <p className="text-2xl font-black text-slate-800">{resolvedCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Satisfied customer inquiries</p>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-purple-600 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider">Avg Response</span>
              <Sparkles size={16} />
            </div>
            <p className="text-2xl font-black text-slate-800">3.4 min</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Super fast resolution</p>
          </div>
        </div>
          </>
        )}

        {/* Modal Body: Split view (Inquiry List on Left, Chat / Resolution Station on Right) */}
        <div className={`flex-1 grid overflow-hidden ${isStaff ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
          {/* Left Column: Tickets Queue */}
          {isStaff && (
          <div className="hidden md:flex lg:col-span-5 border-r border-slate-200 flex-col overflow-hidden bg-slate-50/50">
            {/* Search & Filter */}
            <div className="p-3 border-b border-slate-200 space-y-2 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search customer, phone, subject..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:border-sky-600 outline-none"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {['all', 'open', 'in_progress', 'resolved'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg font-bold capitalize whitespace-nowrap transition ${
                      statusFilter === st
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'all' ? 'All Inquiries' : st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
              {filteredInquiries.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No inquiries found in this view.
                </div>
              ) : (
                filteredInquiries.map((inq) => {
                  const isSelected = selectedInquiryId === inq.id;
                  const isOpen = inq.status === 'open';

                  return (
                    <button
                      key={inq.id}
                      type="button"
                      onClick={() => setSelectedInquiryId(inq.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition flex flex-col gap-1.5 ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {inq.customerName}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            isOpen
                              ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                              : inq.status === 'in_progress'
                              ? 'bg-sky-100 text-sky-800 border-sky-300'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          {inq.status.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-700 line-clamp-1">
                        {inq.subject}
                      </p>

                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {inq.message}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        <span className="font-mono">{inq.phone}</span>
                        <span>{inq.createdAt}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
          )}

          {/* Right Column: Active Conversation / Chat */}
          <div className={`flex flex-col overflow-y-auto p-3 sm:p-6 bg-white ${isStaff ? 'lg:col-span-7' : ''}`}>
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {isCreatingNew ? (
              /* Create New Ticket Form */
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900">Create New Support Inquiry Ticket</h3>
                  <button
                    type="button"
                    onClick={() => setIsCreatingNew(false)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleCreateNewTicketSubmit} className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name *</label>
                      <input
                        type="text"
                        value={newCustName}
                        onChange={(e) => setNewCustName(e.target.value)}
                        placeholder="Customer full name"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:border-sky-600 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone *</label>
                      <input
                        type="tel"
                        value={newCustPhone}
                        onChange={(e) => setNewCustPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:border-sky-600 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Subject *</label>
                      <input
                        type="text"
                        value={newCustSubject}
                        onChange={(e) => setNewCustSubject(e.target.value)}
                        placeholder="e.g. Order Tracking Query"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:border-sky-600 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                      <select
                        value={newCustCategory}
                        onChange={(e) => setNewCustCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:border-sky-600 outline-none bg-white"
                      >
                        <option value="Product Question">Product Question</option>
                        <option value="Order Status">Order Status</option>
                        <option value="Return / Refund">Return / Refund</option>
                        <option value="General">General Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Customer Question / Message</label>
                    <textarea
                      value={newCustMessage}
                      onChange={(e) => setNewCustMessage(e.target.value)}
                      placeholder="Write customer query details..."
                      rows={3}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:border-sky-600 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider transition"
                  >
                    Submit &amp; Open Support Ticket
                  </button>
                </form>
              </div>
            ) : activeInquiry ? (
              <div className="space-y-4">
                {/* Active Ticket Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                        {activeInquiry.id}
                      </span>
                      <h2 className="text-lg font-black text-slate-900">{activeInquiry.subject}</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Customer: <strong className="text-slate-700">{activeInquiry.customerName}</strong> ({activeInquiry.phone}) • {activeInquiry.createdAt}
                    </p>
                  </div>

                  {isStaff && (
                    <>
                      {/* Status buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onUpdateInquiryStatus(activeInquiry.id, 'in_progress')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                            activeInquiry.status === 'in_progress'
                              ? 'bg-sky-600 text-white border-sky-600'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          In Progress
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateInquiryStatus(activeInquiry.id, 'resolved')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                            activeInquiry.status === 'resolved'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Mark Resolved
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {isStaff && (
                  /* Direct Action Hub for Customer Support */
                  <div className="bg-sky-50/60 border border-sky-200 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-sky-900">
                      <span className="font-black uppercase tracking-wider block text-[10px] text-sky-700">
                        Direct WhatsApp Live Assistance
                      </span>
                      <span>Chat directly with {activeInquiry.customerName} on official WhatsApp.</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleWhatsAppDirectReply(activeInquiry)}
                        className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <WhatsAppIcon size={15} />
                        <span>WhatsApp Chat</span>
                    </button>

                    <a
                      href={`tel:${activeInquiry.phone}`}
                      className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                    >
                      <Phone size={14} />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
                )}

                {/* Conversation Thread */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/40 space-y-3 max-h-72 overflow-y-auto">
                  {/* Initial Message */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{activeInquiry.customerName} (Customer)</span>
                      <span className="text-[10px] text-slate-400">{activeInquiry.createdAt}</span>
                    </div>
                    <p className="text-slate-700 font-medium">{activeInquiry.message}</p>
                  </div>

                  {/* Replies */}
                  {activeInquiry.replies?.map((rep) => (
                    <div
                      key={rep.id}
                      className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                        rep.isStaff
                          ? 'bg-sky-50 border border-sky-200 ml-6 text-sky-950'
                          : 'bg-white border border-slate-200 mr-6 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{rep.sender}</span>
                        <span className="text-[10px] text-slate-400">{rep.timestamp}</span>
                      </div>
                      <p className="font-medium">{rep.text}</p>
                    </div>
                  ))}
                </div>

                {/* Quick Canned Preset Responses (staff only) */}
                {isStaff && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Instant Quick Reply Presets
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('আসসালামু আলাইকুম! আপনার অর্ডারটি বর্তমানে কুরিয়ারে ডেলিভারির পথে রয়েছে।')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                    >
                      🚚 Delivery on the way
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('ধন্যবাদ যোগাযোগ করার জন্য। আপনার অর্ডারের ট্র্যাকিং কোডটি দিয়ে সাহায্য করুন।')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                    >
                      🔖 Ask Tracking Code
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('পণ্যটির সাথে ৭ দিনের রিপ্লেসমেন্ট ও অফিসিয়াল ওয়ারেন্টি সুবিধা রয়েছে।')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                    >
                      🛡️ Warranty Policy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('আমাদের অফিশিয়াল হটলাইন: 01794608874 নাম্বারে যেকোনো তথ্যে সরাসরি কল করতে পারেন।')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                    >
                      📞 Hotline Number
                    </button>
                  </div>
                </div>
                )}

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="space-y-2 pt-2">
                  <div className="relative">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={
                        isStaff
                          ? `Reply to ${activeInquiry.customerName} as ${currentUser?.fullName || 'Support Staff'}...`
                          : 'আপনার ফলো-আপ মেসেজ লিখুন... (Type your follow-up message)'
                      }
                      rows={isStaff ? 3 : 2}
                      className={`w-full p-3 rounded-2xl border text-xs font-medium text-slate-800 outline-none pr-12 ${
                        isStaff
                          ? 'border-slate-200 focus:border-sky-600'
                          : 'border-emerald-200 bg-emerald-50/30 focus:border-emerald-500'
                      }`}
                      required
                    />
                    <button
                      type="submit"
                      className={`absolute right-3 bottom-3 p-2 rounded-xl text-white transition shadow-xs cursor-pointer ${
                        isStaff
                          ? 'bg-sky-600 hover:bg-sky-700'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                      title={isStaff ? 'Send response' : 'Send message'}
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </form>
              </div>
            ) : !isStaff ? (
              <div className="p-6 sm:p-10 text-center space-y-3">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <MessageSquare size={24} className="text-emerald-600" />
                </div>
                <h3 className="text-base font-black text-slate-900">কোনো মেসেজ নেই</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  উপরে &quot;New Message&quot; বাটনে ক্লিক করে সাপোর্ট টিমে সরাসরি মেসেজ পাঠান। আমরা কয়েক মিনিটের মধ্যে উত্তর দেবো।
                </p>
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs"
                >
                  <Plus size={14} /> Send a new message
                </button>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                <Headphones size={40} className="mx-auto mb-2 opacity-40" />
                <p className="text-xs">Select an inquiry from the list to view history and reply to the customer.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer (staff only; customer view uses compact inline footer) */}
        {isStaff ? (
          <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] sm:text-xs text-slate-500">
            <span>Logged in as <strong>{currentUser?.fullName}</strong> (Customer Support)</span>
            <span>Official Store Helpline: <strong>01794608874</strong></span>
          </div>
        ) : (
          <div className="bg-emerald-50 border-t border-emerald-200 px-4 sm:px-6 py-2.5 flex items-center justify-between text-[11px] text-emerald-800">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Support Online
            </span>
            <a
              href="tel:+8801794608874"
              className="font-bold underline hover:text-emerald-900"
            >
              📞 01794608874
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
