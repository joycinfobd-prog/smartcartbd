import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  Headphones,
  ShoppingBag,
  User,
  Phone,
  MessageSquareText,
  Loader2,
} from 'lucide-react';
import { SupportInquiry, UserAccount } from '../types';

interface LiveChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  inquiries: SupportInquiry[];
  currentUser: UserAccount | null;
  onCreateThread: (data: { name: string; phone: string; message: string }) => void;
  onSendFollowUp: (threadId: string, text: string, senderName: string) => void;
  onUnreadChange: (count: number) => void;
}

interface ChatBubble {
  key: string;
  from: 'customer' | 'staff';
  name: string;
  text: string;
  time: string;
}

const QUICK_CHIPS = [
  'অর্ডারের স্ট্যাটাস জানতে চাই',
  'ডেলিভারি চার্জ কত?',
  'রিটার্ন / রিফান্ড পলিসি',
  'প্রোডাক্টের বিস্তারিত দরকার',
];

function readMyThreadIds(): string[] {
  try {
    const raw = localStorage.getItem('smartcart_my_inquiries');
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  isOpen,
  onClose,
  inquiries,
  currentUser,
  onCreateThread,
  onSendFollowUp,
  onUnreadChange,
}) => {
  const [myIds, setMyIds] = useState<string[]>(() => readMyThreadIds());
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Re-read the browser's thread list every time the panel opens
  useEffect(() => {
    if (isOpen) setMyIds(readMyThreadIds());
  }, [isOpen]);

  // Prefill contact details from the logged-in account
  useEffect(() => {
    if (currentUser) {
      setName((v) => v || currentUser.fullName || '');
      setPhone((v) => v || currentUser.phone || '');
    }
  }, [currentUser]);

  const safeInquiries = Array.isArray(inquiries) ? inquiries : [];

  // The visitor's active conversation = newest ticket created from this browser
  const thread = useMemo(() => {
    for (let i = myIds.length - 1; i >= 0; i--) {
      const found = safeInquiries.find((inq) => inq.id === myIds[i]);
      if (found) return found;
    }
    return null;
  }, [myIds, safeInquiries]);

  const bubbles = useMemo<ChatBubble[]>(() => {
    if (!thread) return [];
    const list: ChatBubble[] = [
      {
        key: 'first',
        from: 'customer',
        name: thread.customerName,
        text: thread.message,
        time: thread.createdAt,
      },
    ];
    (thread.replies || []).forEach((rep) => {
      list.push({
        key: rep.id,
        from: rep.isStaff ? 'staff' : 'customer',
        name: rep.sender,
        text: rep.text,
        time: rep.timestamp,
      });
    });
    return list;
  }, [thread]);

  const staffReplyCount = bubbles.filter((b) => b.from === 'staff').length;

  // Unread badge: staff replies arrived while the panel was closed
  useEffect(() => {
    if (!thread) {
      onUnreadChange(0);
      return;
    }
    const readKey = `smartcart_chat_read_${thread.id}`;
    if (isOpen) {
      try {
        localStorage.setItem(readKey, String(staffReplyCount));
      } catch {
        /* ignore */
      }
      onUnreadChange(0);
    } else {
      let read = 0;
      try {
        read = Number(localStorage.getItem(readKey) || 0);
      } catch {
        read = 0;
      }
      onUnreadChange(Math.max(0, staffReplyCount - read));
    }
  }, [thread, staffReplyCount, isOpen, onUnreadChange]);

  // Keep the conversation pinned to the latest message
  useEffect(() => {
    if (!isOpen || !scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [bubbles.length, isOpen, thread?.id]);

  const startChat = (firstMessage: string) => {
    const trimmed = firstMessage.trim();
    if (!trimmed || !name.trim() || !phone.trim()) return;
    setSending(true);
    try {
      localStorage.setItem(
        'smartcart_chat_profile',
        JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      );
    } catch {
      /* ignore */
    }
    onCreateThread({ name: name.trim(), phone: phone.trim(), message: trimmed });
    setDraft('');
    setSending(false);
  };

  const sendFollowUp = () => {
    const text = draft.trim();
    if (!text || !thread) return;
    setSending(true);
    onSendFollowUp(thread.id, text, name.trim() || thread.customerName || 'Customer');
    setDraft('');
    setTimeout(() => setSending(false), 350);
  };

  // Prefill saved profile for returning guests
  useEffect(() => {
    try {
      const saved = localStorage.getItem('smartcart_chat_profile');
      if (saved) {
        const p = JSON.parse(saved);
        if (p?.name) setName((v) => v || p.name);
        if (p?.phone) setPhone((v) => v || p.phone);
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 28, scale: 0.97 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          role="dialog"
          aria-label="Live chat with SMARTCART support"
          className="fixed z-50 inset-x-2 bottom-[92px] top-auto flex h-[min(32rem,62dvh)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:inset-x-auto sm:right-5 sm:bottom-24 sm:h-[min(34rem,70dvh)] sm:w-[24rem]"
        >
          {/* Header */}
          <div className="relative flex items-center gap-3 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 px-4 py-3.5 text-white">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
              <ShoppingBag size={18} />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-lime-300 ring-2 ring-emerald-700" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black tracking-tight">SMARTCART Support</p>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-50/90">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300" />
                অনলাইন • সাধারণত ৫ মিনিটের মধ্যে উত্তর
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 cursor-pointer"
            >
              <X size={17} />
            </button>
          </div>

          {/* Conversation area */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-slate-50 bg-[radial-gradient(circle_at_1px_1px,rgba(5,150,105,0.10)_1px,transparent_0)] bg-[length:18px_18px] px-3.5 py-4"
          >
            {!thread ? (
              <div className="space-y-3">
                <div className="mr-6 rounded-2xl rounded-bl-md border border-slate-200 bg-white p-3.5 shadow-2xs">
                  <p className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                    <Headphones size={13} className="text-emerald-600" />
                    সাপোর্ট টিম
                  </p>
                  <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-600">
                    আসসালামু আলাইকুম! আমি SMARTCART-এর সাপোর্ট এজেন্ট। অর্ডার, ডেলিভারি বা যেকোনো
                    প্রোডাক্ট নিয়ে সরাসরি এখানে লিখুন — আমি এখানেই উত্তর দেবো।
                  </p>
                </div>

                {/* Contact + first message composer */}
                <div className="ml-2 space-y-2 rounded-2xl rounded-bl-md border border-emerald-200 bg-white p-3.5 shadow-2xs">
                  <p className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                    চ্যাট শুরু করুন
                  </p>
                  <label className="block">
                    <span className="mb-1 flex items-center gap-1 text-[10px] font-bold text-slate-500">
                      <User size={10} /> আপনার নাম
                    </span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="যেমন: Rahim Uddin"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 flex items-center gap-1 text-[10px] font-bold text-slate-500">
                      <Phone size={10} /> মোবাইল নাম্বার
                    </span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="tel"
                      placeholder="017XXXXXXXX"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 flex items-center gap-1 text-[10px] font-bold text-slate-500">
                      <MessageSquareText size={10} /> আপনার প্রশ্ন / সমস্যা
                    </span>
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={2}
                      placeholder="সংক্ষেপে লিখুন…"
                      className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                  <button
                    type="button"
                    disabled={sending || !name.trim() || !phone.trim() || !draft.trim()}
                    onClick={() => startChat(draft)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-xs transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                  >
                    {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    <span>চ্যাট শুরু করুন</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {bubbles.map((b) => (
                  <motion.div
                    key={b.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className={b.from === 'customer' ? 'ml-8 text-right' : 'mr-8 text-left'}
                  >
                    <div
                      className={`inline-block max-w-full rounded-2xl px-3.5 py-2.5 text-left text-xs font-medium leading-relaxed shadow-2xs ${
                        b.from === 'customer'
                          ? 'rounded-br-md bg-emerald-600 text-white'
                          : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      {b.from === 'staff' && (
                        <p className="mb-1 flex items-center gap-1 text-[10px] font-black text-emerald-700">
                          <Headphones size={10} />
                          {b.name} • Support Team
                        </p>
                      )}
                      <p className="whitespace-pre-wrap break-words">{b.text}</p>
                      <p
                        className={`mt-1 text-[9px] font-semibold ${
                          b.from === 'customer' ? 'text-emerald-100/80' : 'text-slate-400'
                        }`}
                      >
                        {b.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <p className="pt-1 text-center text-[10px] font-semibold text-slate-400">
                  সাপোর্ট টিমের উত্তর এখানেই দেখা যাবে — পেজ ছাড়তে হবে না।
                </p>
              </>
            )}
          </div>

          {/* Quick chips + composer */}
          <div className="border-t border-slate-200 bg-white px-3 pb-3 pt-2.5">
            {thread && (
              <div className="no-scrollbar mb-2 flex gap-1.5 overflow-x-auto">
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setDraft(chip)}
                    className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800 transition hover:bg-emerald-100 cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
            {thread && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendFollowUp();
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="মেসেজ লিখুন… (Enter চেপে পাঠান)"
                  className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || sending}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs transition hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                >
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
