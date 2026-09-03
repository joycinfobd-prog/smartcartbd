import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { REVIEWS } from '../data/products';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="px-4 py-12 sm:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
        <div className="border-l-4 border-emerald-600 pl-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">
            Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Verified Customer Reviews
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md font-medium">
          Hear from hundreds of happy customers who completed their orders seamlessly via WhatsApp.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REVIEWS.map((r) => (
          <article
            key={r.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-slate-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < r.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-semibold text-slate-400">{r.date}</span>
              </div>

              <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                "{r.text}"
              </p>
            </div>

            <div className="mt-5 flex items-center gap-3 pt-3.5 border-t border-slate-100">
              <div
                className="w-9 h-9 shrink-0 rounded-xl text-xs font-bold text-white flex items-center justify-center shadow-xs"
                style={{ backgroundColor: r.color }}
              >
                {r.initials}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">{r.name}</p>
                <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-600" />
                  <span>Verified Buyer</span>
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

