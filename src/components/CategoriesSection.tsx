import React from 'react';
import { CATEGORIES } from '../data/products';
import { Product } from '../types';
import { ProductIcon } from './ProductIcon';

interface CategoriesSectionProps {
  activeCategory: string;
  categories?: string[];
  products?: Product[];
  onSelectCategory: (category: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  activeCategory,
  products = [],
  onSelectCategory
}) => {
  return (
    <section id="categories" className="px-4 py-8 sm:py-12 sm:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 pb-4 border-b border-slate-200 gap-3">
        <div className="border-l-4 border-emerald-600 pl-3 sm:pl-4">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 block mb-0.5">
            Collections
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Curated Categories
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md font-medium">
          Select a category to filter the catalog and checkout directly via WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.name;
          // Calculate dynamic and 100% accurate count of real products in catalog
          const realItemCount = products.length > 0
            ? products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length
            : cat.count;

          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`bg-white rounded-xl sm:rounded-2xl border p-2.5 sm:p-4 text-center transition-all cursor-pointer group ${
                isSelected
                  ? 'border-2 border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-600/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
              }`}
            >
              <div 
                className={`mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                  isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <ProductIcon name={cat.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <p className="mt-2 sm:mt-3 text-[11px] sm:text-xs font-bold text-slate-800 truncate">{cat.name}</p>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">{cat.bnName}</p>
              <span className="mt-1 inline-block text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-md border border-emerald-100/80">
                {realItemCount} Items
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

