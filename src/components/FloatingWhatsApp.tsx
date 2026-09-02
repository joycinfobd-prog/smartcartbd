import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Database } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { StoreSettings, UserAccount } from '../types';
import { getWhatsAppDirectChatUrl } from '../utils/whatsapp';
import { saveLiveChatMessage, saveSupportInquiryToFirestore } from '../lib/api-client';

interface FloatingWhatsAppProps {
  storeSettings: StoreSettings;
  currentUser?: UserAccount | null;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ storeSettings, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [isSavedToFirebase, setIsSavedToFirebase] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const msg = customMsg.trim() || `হ্যালো! আমি ${storeSettings.storeName} থেকে পণ্য অর্ডার ও তথ্য সম্পর্কে জানতে চাই।`;
    
    // Save to Firebase Firestore
    try {
      const nowStr = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });

      await saveLiveChatMessage({
        senderName: currentUser?.fullName || 'Website Guest',
        senderPhone: currentUser?.phone || '',
        senderRole: currentUser?.role || 'customer',
        text: msg,
        createdAt: nowStr,
        source: 'whatsapp_widget'
      });

      // Also create/sync support ticket in Firestore
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      await saveSupportInquiryToFirestore({
        id: 'INQ-' + randomSuffix,
        customerName: currentUser?.fullName || 'Website Customer',
        phone: currentUser?.phone || storeSettings.whatsappNumber,
        subject: msg.length > 35 ? msg.substring(0, 32) + '...' : msg,
        message: msg,
        category: 'Product Question',
        priority: 'normal',
        status: 'open',
        createdAt: 'Just now',
        replies: []
      });

      setIsSavedToFirebase(true);
      setTimeout(() => setIsSavedToFirebase(false), 2000);
    } catch (err) {
      console.warn('Error saving chat message to Firebase:', err);
    }

    const url = getWhatsAppDirectChatUrl(msg, storeSettings.whatsappInternational);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Quick Chat Popup Bubble */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl text-slate-800"
          >
            {/* Header */}
            <div className="bg-[#25D366] p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="relative w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                    <WhatsAppIcon size={20} className="text-white" />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-300 ring-2 ring-[#25D366]"></span>
                  </span>
                  <div>
                    <h4 className="font-black text-sm leading-tight">WhatsApp Support</h4>
                    <p className="text-[10px] text-emerald-100 flex items-center gap-1 font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                      Online • {storeSettings.whatsappNumber}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg text-white/80 hover:bg-white/20 flex items-center justify-center transition"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-slate-50 space-y-3">
              <div className="rounded-xl bg-white p-3 shadow-2xs border border-slate-200 text-xs text-slate-700 font-medium leading-relaxed">
                👋 আসসালামু আলাইকুম! কোনো প্রশ্ন থাকলে বা সরাসরি অর্ডার করতে নিচে মেসেজ লিখে পাঠান।
              </div>

              {/* Quick Prompt suggestions */}
              <div className="space-y-1.5">
                {[
                  'আমি একটি প্রোডাক্ট অর্ডার করতে চাই 🛍️',
                  'ডেলিভারি চার্জ এবং সময় কত? 🚚',
                  'ক্যাশ অন ডেলিভারি কি এভেইলেবল? 💵'
                ].map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setCustomMsg(prompt);
                    }}
                    className="w-full text-left text-[11px] font-bold text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-800 p-2 rounded-lg border border-slate-200 transition cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Form Input */}
              <form onSubmit={handleSend} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="মেসেজ লিখুন..."
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-[#25D366]"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-lg bg-[#25D366] text-white hover:bg-[#20bd5a] flex items-center justify-center transition shadow-xs cursor-pointer"
                >
                  <Send size={13} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] p-3.5 sm:px-4 sm:py-3 font-bold text-white shadow-lg transition active:scale-95 cursor-pointer"
        aria-label="WhatsApp Hotline"
      >
        <WhatsAppIcon size={20} />
        <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
          WhatsApp Order
        </span>
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white"></span>
        </span>
      </button>
    </div>
  );
};

