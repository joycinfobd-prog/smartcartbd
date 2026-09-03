import React from 'react';
import { ShieldCheck, Truck, Clock, Headphones, Award, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { StoreSettings } from '../types';

interface AboutSectionProps {
  storeSettings?: StoreSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ storeSettings }) => {
  return (
    <section id="about" className="py-14 sm:py-18 bg-white border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                OUR STORY & MISSION
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              About <span className="text-emerald-600">{storeSettings?.storeName || 'SMARTCART'}</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg leading-relaxed">
            স্মার্টকার্ট (SMARTCART) বাংলাদেশে সহজ, নির্ভরযোগ্য এবং শতভাগ ভেরিফাইড ই-কমার্স শপিংয়ের আধুনিক প্ল্যাটফর্ম। কোনো অগ্রিম পেমেন্ট ছাড়া সরাসরি WhatsApp এ অর্ডার কনফার্ম করুন।
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-emerald-500/40 hover:bg-emerald-50/20 transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">১০০% অথেনটিক প্রোডাক্ট</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              আমাদের প্রতিটি গ্যাজেট ও অ্যাক্সেসরিজ সরাসরি অফিশিয়াল সোর্স থেকে সংগ্রহ করা এবং কোয়ালিটি নিশ্চিত করে ডেলিভারি করা হয়।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-emerald-500/40 hover:bg-emerald-50/20 transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <Truck size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">সারা দেশে দ্রুত ডেলিভারি</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              ঢাকায় ২৪-৪৮ ঘণ্টায় হোম ডেলিভারি এবং দেশের যেকোনো জেলায় স্টেডফাস্ট/পাঠাও কুরিয়ারের মাধ্যমে ক্যাশ অন ডেলিভারি।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-emerald-500/40 hover:bg-emerald-50/20 transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <HeartHandshake size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">১-ক্লিক WhatsApp অর্ডার</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              কোনো জটিল ফর্ম পূরণের ঝামেলা ছাড়াই সরাসরি আমাদের অফিসিয়াল WhatsApp হেল্পলাইনে তাৎক্ষণিক অর্ডার সম্পন্ন করুন।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-emerald-500/40 hover:bg-emerald-50/20 transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <Headphones size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">২৪/৭ ডেডিকেটেড সাপোর্ট</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              অর্ডার ট্র্যাকিং, রিপ্লেসমেন্ট এবং যেকোনো তথ্যের জন্য আমাদের কাস্টমার সাপোর্ট টিম সদা প্রস্তুত।
            </p>
          </div>
        </div>

        {/* Trust Highlight Box */}
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Award size={26} />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">গ্রাহক সন্তুষ্টিই আমাদের প্রথম লক্ষ্য</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                প্রোডাক্ট দেখে বুঝে ডেলিভারি ম্যানের কাছে মূল্য পরিশোধের সুবিধা (Cash on Delivery)।
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0 text-xs font-semibold text-emerald-300">
            <span className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-2 rounded-xl">
              <CheckCircle2 size={15} className="text-emerald-400" />
              ৭ দিনের সহজ রিপ্লেসমেন্ট
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-2 rounded-xl">
              <CheckCircle2 size={15} className="text-emerald-400" />
              ভেরিফাইড মার্চেন্ট
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
