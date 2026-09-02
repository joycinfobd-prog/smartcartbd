import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  Edit,
  Save,
  RotateCcw,
  Package,
  Settings,
  ShoppingBag,
  Image as ImageIcon,
  Check,
  Search,
  ExternalLink,
  DollarSign,
  Truck,
  Sparkles,
  Phone,
  Flame,
  LayoutDashboard,
  Layers,
  ChevronRight,
  ShieldCheck,
  Star,
  Zap,
  ArrowUpDown,
  Send,
  User,
  Clock,
  MapPin,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Product, StoreSettings, OrderDetails, Currency, OrderStatus, UserAccount, UserRole, StaffNotification, UserPermissions } from '../types';
import { CATEGORIES, PRESET_IMAGE_OPTIONS } from '../data/products';
import { formatCurrency } from '../utils/whatsapp';
import { WhatsAppIcon } from './WhatsAppIcon';
import { ProductIcon } from './ProductIcon';
import { StaffAccessTab } from './StaffAccessTab';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Product[];
  storeSettings: StoreSettings;
  orders?: OrderDetails[];
  currency?: Currency;
  usersList?: UserAccount[];
  currentUser?: UserAccount | null;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onUpdateSettings: (settings: StoreSettings) => void;
  onResetDefaultProducts?: () => void;
  onResetDefaults?: () => void;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus, courierName?: string) => void;
  onAddStaff?: (user: UserAccount) => void;
  onUpdateStaffRole?: (userId: string, newRole: UserRole, status?: 'active' | 'inactive', permissions?: UserPermissions) => void;
  onDeleteStaff?: (userId: string) => void;
  onSendTestNotification?: (notif: Partial<StaffNotification>) => void;
}

type AdminTab =
  | 'dashboard'
  | 'products'
  | 'flash_sales'
  | 'orders'
  | 'staff_access'
  | 'categories'
  | 'hero_banners'
  | 'ai_generator'
  | 'settings';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  products = [],
  storeSettings,
  orders = [],
  currency = 'BDT',
  usersList = [],
  currentUser = null,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateSettings,
  onResetDefaultProducts,
  onResetDefaults,
  onUpdateOrderStatus,
  onAddStaff = () => {},
  onUpdateStaffRole = () => {},
  onDeleteStaff = () => {},
  onSendTestNotification = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const safeProducts = Array.isArray(products) ? products : [];
  const safeOrders = Array.isArray(orders) ? orders : [];
  const handleResetAll = onResetDefaultProducts || onResetDefaults || (() => {});

  // Form State for Add / Edit
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // AI Product Generator form state
  const [aiPrompt, setAiPrompt] = useState('Premium RGB Gaming Wireless Mouse with Bengali translation');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const emptyProductForm: Omit<Product, 'id'> = {
    name: '',
    bnName: '',
    category: 'Electronics',
    priceBDT: 2490,
    oldPriceBDT: 3490,
    priceUSD: 120,
    oldPriceUSD: 160,
    rating: 4.8,
    reviews: 24,
    image: PRESET_IMAGE_OPTIONS[0].url,
    iconName: 'Package',
    tint: 'from-blue-100 via-indigo-50 to-blue-50',
    stock: 'In Stock',
    stockCount: 30,
    description: '',
    bnDescription: '',
    tags: ['Trending', 'Hot'],
    colors: ['Black', 'White'],
    sizes: ['Standard'],
    sku: 'SMC-' + Math.floor(100 + Math.random() * 900),
    isFlashDeal: false
  };

  const [formData, setFormData] = useState<Omit<Product, 'id'>>(emptyProductForm);
  const [tagInput, setTagInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Settings Form
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(storeSettings);

  if (!isOpen) return null;

  // Filter products for directory
  const filteredProducts = safeProducts.filter((p) => {
    if (!p) return false;
    const matchesSearch =
      (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.bnName && p.bnName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'All' || (p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const flashDealsCount = safeProducts.filter((p) => p && p.isFlashDeal).length;
  const totalRevenueBDT = safeOrders.reduce((sum, o) => sum + (o?.currency === 'BDT' ? (o.grandTotal || 0) : (o?.grandTotal || 0) * 120), 0);

  const handleStartAdd = () => {
    setIsEditing(true);
    setEditingId(null);
    setFormData({
      ...emptyProductForm,
      sku: 'SMC-PRD-' + Math.floor(1000 + Math.random() * 9000)
    });
    setTagInput('Trending, Best Seller');
    setColorInput('Black, Silver');
    setSizeInput('Standard');
  };

  const handleStartEdit = (product: Product) => {
    setIsEditing(true);
    setEditingId(product.id);
    setFormData({
      name: product.name,
      bnName: product.bnName || '',
      category: product.category,
      priceBDT: product.priceBDT,
      oldPriceBDT: product.oldPriceBDT,
      priceUSD: product.priceUSD,
      oldPriceUSD: product.oldPriceUSD,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image || '',
      iconName: product.iconName || 'Package',
      tint: product.tint || 'from-blue-100 via-indigo-50 to-blue-50',
      stock: product.stock,
      stockCount: product.stockCount,
      description: product.description,
      bnDescription: product.bnDescription || '',
      tags: product.tags || [],
      colors: product.colors || [],
      sizes: product.sizes || [],
      sku: product.sku,
      isFlashDeal: !!product.isFlashDeal
    });
    setTagInput(product.tags?.join(', ') || '');
    setColorInput(product.colors?.join(', ') || '');
    setSizeInput(product.sizes?.join(', ') || '');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const parsedTags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const parsedColors = colorInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    const parsedSizes = sizeInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingId !== null) {
      const updated: Product = {
        id: editingId,
        ...formData,
        tags: parsedTags.length > 0 ? parsedTags : ['General'],
        colors: parsedColors.length > 0 ? parsedColors : undefined,
        sizes: parsedSizes.length > 0 ? parsedSizes : undefined
      };
      onUpdateProduct(updated);
      setSaveSuccessMsg(`Product "${updated.name}" updated successfully!`);
    } else {
      const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      const created: Product = {
        id: newId,
        ...formData,
        tags: parsedTags.length > 0 ? parsedTags : ['New Arrival'],
        colors: parsedColors.length > 0 ? parsedColors : undefined,
        sizes: parsedSizes.length > 0 ? parsedSizes : undefined
      };
      onAddProduct(created);
      setSaveSuccessMsg(`Product "${created.name}" created successfully!`);
    }

    setTimeout(() => setSaveSuccessMsg(''), 3000);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleAiGenerate = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const presetTemplates = [
        {
          name: 'Apex RGB Mechanix Pro Keyboard',
          bnName: 'অ্যাপেক্স আরজিবি মেকানিক্স প্রো কীবোর্ড',
          category: 'Electronics',
          priceBDT: 3890,
          oldPriceBDT: 4990,
          desc: 'High precision hot-swappable tactile blue switches with vibrant per-key RGB backlighting and aluminum frame.',
          bnDesc: 'হট-সোয়াপ্যাবল মেকানিক্যাল ব্লু সুইচ, আরজিবি লাইটিং ও প্রিমিয়াম অ্যালুমিনিয়াম বডি।',
          image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
          sku: 'SMC-KB-' + Math.floor(100 + Math.random() * 900)
        },
        {
          name: 'HydraFlow Smart Insulated Bottle (500ml)',
          bnName: 'হাইড্রাফ্লো স্মার্ট থার্মাল বোতল (৫০০ মিলি)',
          category: 'Home & Living',
          priceBDT: 1450,
          oldPriceBDT: 1990,
          desc: 'Touch LED temperature display lid with double-wall 304 vacuum stainless steel keeping drinks hot 12h or cold 24h.',
          bnDesc: 'এলইডি টাচ টেম্পারেচার ডিসপ্লে ও ডাবল-ওয়াল স্টেইনলেস স্টিল ভ্যাকুয়াম ইনসুলেশন।',
          image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
          sku: 'SMC-BTL-' + Math.floor(100 + Math.random() * 900)
        },
        {
          name: 'NovaBeam 4K Ultra HD Dash Camera',
          bnName: 'নোভাবিমি ৪কে আল্ট্রা এইচডি ড্যাশ ক্যামেরা',
          category: 'Gadgets',
          priceBDT: 4290,
          oldPriceBDT: 5990,
          desc: 'Ultra-wide 170° angle lens with Sony STARVIS night vision sensor, Wi-Fi mobile playback and emergency G-sensor locking.',
          bnDesc: 'সনি স্টারভিস নাইট ভিশন, ১৭০ ডিগ্রি ওয়াইড অ্যাঙ্গেল ও ওয়াইফাই মোবাইল অ্যাপ কানেক্টিভিটি।',
          image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
          sku: 'SMC-CAM-' + Math.floor(100 + Math.random() * 900)
        }
      ];

      const chosen = presetTemplates[Math.floor(Math.random() * presetTemplates.length)];
      const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

      const generatedProduct: Product = {
        id: newId,
        name: chosen.name,
        bnName: chosen.bnName,
        category: chosen.category,
        priceBDT: chosen.priceBDT,
        oldPriceBDT: chosen.oldPriceBDT,
        priceUSD: Math.round(chosen.priceBDT / 120),
        oldPriceUSD: Math.round(chosen.oldPriceBDT / 120),
        rating: 4.9,
        reviews: 18,
        image: chosen.image,
        iconName: 'Package',
        tint: 'from-purple-100 via-indigo-50 to-blue-50',
        stock: 'In Stock',
        stockCount: 25,
        description: chosen.desc,
        bnDescription: chosen.bnDesc,
        tags: ['AI Generated', 'Hot Deal', 'New Arrival'],
        colors: ['Black', 'Silver'],
        sizes: ['Standard'],
        sku: chosen.sku,
        isFlashDeal: true
      };

      onAddProduct(generatedProduct);
      setIsAiGenerating(false);
      setSaveSuccessMsg(`✨ AI Generated & Published "${generatedProduct.name}"!`);
      setTimeout(() => setSaveSuccessMsg(''), 3500);
      setActiveTab('products');
    }, 1200);
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard & Analytics';
      case 'products':
        return 'Products & Inventory';
      case 'flash_sales':
        return 'Flash Sales & Deals';
      case 'orders':
        return 'Orders & Shipments';
      case 'categories':
        return 'Categories Management';
      case 'hero_banners':
        return 'Hero Banners & Promotions';
      case 'ai_generator':
        return 'AI Product Generator';
      case 'settings':
        return 'Store & WhatsApp Settings';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-slate-900/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-7xl h-[92vh] max-h-[920px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-300 shadow-2xl flex flex-col font-sans"
      >
        {/* ================= TOP APPLICATION BAR (EXACT MATCH TO IMAGE) ================= */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
          {/* Left Brand and Breadcrumb */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Square Brand Badge with Initial */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#6366f1] text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
              S
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-sm sm:text-base tracking-tight">SMARTCART</span>
                <span className="bg-indigo-50 border border-indigo-200 text-[#6366f1] text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
                  ADMIN PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Store Operations Suite</p>
            </div>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-400 pl-4 border-l border-slate-200">
              <span>Admin</span>
              <ChevronRight size={13} className="text-slate-300" />
              <span className="text-slate-700 font-bold">{getBreadcrumbTitle()}</span>
            </div>
          </div>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Revenue Badge */}
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
              <span className="text-emerald-600">📈</span>
              <span>Revenue: {formatCurrency(totalRevenueBDT, 'BDT')}</span>
            </div>

            {/* Orders Badge */}
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
              <span>Orders: {orders.length}</span>
            </div>

            {/* Reset Catalog Button */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset products directory back to initial default items?')) {
                  handleResetAll();
                  setSaveSuccessMsg('Catalog reset to initial verified default products.');
                  setTimeout(() => setSaveSuccessMsg(''), 3000);
                }
              }}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <RotateCcw size={13} className="text-slate-500" />
              <span className="hidden sm:inline">Reset Catalog</span>
            </button>

            {/* Back to Store Button */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-sm transition cursor-pointer"
            >
              <ShoppingBag size={14} />
              <span>Back to Store</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert banner */}
        {saveSuccessMsg && (
          <div className="bg-emerald-500 text-white px-6 py-2 flex items-center justify-between text-xs font-bold shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} />
              <span>{saveSuccessMsg}</span>
            </div>
            <button onClick={() => setSaveSuccessMsg('')} className="opacity-80 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        )}

        {/* ================= MAIN CONTENT (SIDEBAR + WORKSPACE) ================= */}
        <div className="flex-1 flex overflow-hidden p-3 sm:p-5 gap-4 sm:gap-5">
          {/* ================= LEFT SIDEBAR (DARK NAVY CARD EXACT MATCH) ================= */}
          <aside className="w-56 sm:w-64 bg-[#0e1628] rounded-2xl p-4 sm:p-5 text-white flex flex-col justify-between shadow-xl shrink-0 overflow-y-auto">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-2">
                MANAGEMENT MENU
              </span>

              <nav className="space-y-1 text-xs font-bold">
                {/* 1. Dashboard & Analytics */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('dashboard');
                    setIsEditing(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-[#6366f1] text-white font-black shadow-md'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard size={16} />
                    <span>Dashboard &amp; Analytics</span>
                  </div>
                </button>

                {/* 2. Products & Inventory */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('products');
                    setIsEditing(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
                    activeTab === 'products'
                      ? 'bg-[#6366f1] text-white font-black shadow-md'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package size={16} />
                    <span>Products &amp; Inventory</span>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      activeTab === 'products' ? 'bg-white text-[#6366f1]' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {products.length}
                  </span>
                </button>

                {/* 3. Flash Sales & Deals */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('flash_sales');
                    setIsEditing(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
                    activeTab === 'flash_sales'
                      ? 'bg-[#6366f1] text-white font-black shadow-md'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Flame size={16} className="text-amber-400" />
                    <span>Flash Sales &amp; Deals</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {flashDealsCount} live
                  </span>
                </button>

                {/* 4. Orders & Shipments */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('orders');
                    setIsEditing(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-[#6366f1] text-white font-black shadow-md'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag size={16} />
                    <span>Orders &amp; Shipments</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    {orders.length} new
                  </span>
                </button>

                {/* Staff & Access Control */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('staff_access');
                    setIsEditing(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
                    activeTab === 'staff_access'
                      ? 'bg-[#6366f1] text-white font-black shadow-md'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users size={16} className="text-amber-400" />
                    <span>Staff &amp; Access Control</span>
                  </div>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-400/30">
                    {usersList.length} Team
                  </span>
                </button>

                {/* 5. Categories */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('categories');
                    setIsEditing(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
                    activeTab === 'categories'
                      ? 'bg-[#6366f1] text-white font-black shadow-md'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Layers size={16} />
                  <span>Categories</span>
                </button>

                {/* 6. Hero Banners */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('hero_banners');
                    setIsEditing(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
                    activeTab === 'hero_banners'
                      ? 'bg-[#6366f1] text-white font-black shadow-md'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <ImageIcon size={16} />
                  <span>Hero Banners</span>
                </button>

                {/* 7. AI Product Generator */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('ai_generator');
                    setIsEditing(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
                    activeTab === 'ai_generator'
                      ? 'bg-[#6366f1] text-white font-black shadow-md'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={16} className="text-indigo-400" />
                    <span>AI Product Generator</span>
                  </div>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-indigo-500/40 text-indigo-300">
                    AI
                  </span>
                </button>

                {/* 8. Store Settings */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('settings');
                    setIsEditing(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-[#6366f1] text-white font-black shadow-md'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Settings size={16} />
                  <span>Store Settings</span>
                </button>
              </nav>
            </div>

            {/* Bottom Card: WhatsApp Hotline (Exact Match) */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>WhatsApp Hotline</span>
              </div>
              <div className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400">
                +{storeSettings.whatsappInternational}
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">
                Customers can instantly checkout and confirm orders via WhatsApp or Cash on Delivery.
              </p>
            </div>
          </aside>

          {/* ================= RIGHT WORKSPACE PANEL (WHITE CARD EXACT MATCH) ================= */}
          <main className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 overflow-y-auto flex flex-col">
            {/* ================= TAB 1: PRODUCTS & INVENTORY (EXACT SCREENSHOT MATCH) ================= */}
            {activeTab === 'products' && (
              <div className="flex-1 flex flex-col">
                {!isEditing ? (
                  <div className="space-y-4 flex-1 flex flex-col">
                    {/* Header Banner Card (Exact Screenshot) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#6366f1] block">
                          CATALOG &amp; INVENTORY
                        </span>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Products Directory ({products.length})
                        </h1>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          পণ্য তৈরি, মূল্য ও স্টক আপডেট, এবং ইমেজ পরিবর্তন
                        </p>
                      </div>

                      {/* Right Header Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Generate with AI button */}
                        <button
                          type="button"
                          onClick={() => setActiveTab('ai_generator')}
                          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl border-2 border-[#6366f1] text-[#6366f1] hover:bg-indigo-50 text-xs font-bold transition cursor-pointer"
                        >
                          <Sparkles size={14} />
                          <span>Generate with AI</span>
                        </button>

                        {/* Add New Product button */}
                        <button
                          type="button"
                          onClick={handleStartAdd}
                          className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-sm transition cursor-pointer"
                        >
                          <Plus size={15} />
                          <span>+ Add New Product</span>
                        </button>
                      </div>
                    </div>

                    {/* Filter & Search Bar (Exact Screenshot) */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-1">
                      {/* Search input */}
                      <div className="relative flex-1">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search products by title, Bengali, or slug..."
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-xs font-medium text-slate-800 outline-none focus:border-[#6366f1] transition"
                        />
                      </div>

                      {/* Category Dropdown */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-slate-500">Category:</span>
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none cursor-pointer focus:border-[#6366f1]"
                        >
                          <option value="All">All Categories</option>
                          {CATEGORIES.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Data Table (Exact Columns & Style from Screenshot) */}
                    <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                            <tr>
                              <th className="py-3 px-4">PRODUCT</th>
                              <th className="py-3 px-4">CATEGORY</th>
                              <th className="py-3 px-4">PRICE</th>
                              <th className="py-3 px-4">FLASH DEAL</th>
                              <th className="py-3 px-4">INVENTORY STOCK</th>
                              <th className="py-3 px-4">RATING</th>
                              <th className="py-3 px-4 text-right">ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredProducts.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                                  No products found matching &quot;{searchQuery}&quot;.
                                </td>
                              </tr>
                            ) : (
                              filteredProducts.map((p) => {
                                const discountPercent =
                                  p.oldPriceBDT > p.priceBDT
                                    ? Math.round(((p.oldPriceBDT - p.priceBDT) / p.oldPriceBDT) * 100)
                                    : 0;

                                return (
                                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                                    {/* PRODUCT COLUMN */}
                                    <td className="py-3 px-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                          {p.image ? (
                                            <img
                                              src={p.image}
                                              alt={p.name}
                                              className="w-full h-full object-cover"
                                              onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                              }}
                                            />
                                          ) : (
                                            <ProductIcon name={p.iconName} className="w-6 h-6 text-slate-500" />
                                          )}
                                        </div>
                                        <div className="min-w-0 max-w-xs sm:max-w-sm">
                                          <p className="font-bold text-slate-900 text-xs truncate">{p.name}</p>
                                          {p.bnName && (
                                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{p.bnName}</p>
                                          )}
                                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                                            {p.sku}
                                          </span>
                                        </div>
                                      </div>
                                    </td>

                                    {/* CATEGORY COLUMN */}
                                    <td className="py-3 px-4">
                                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px] lowercase">
                                        {p.category.toLowerCase()}
                                      </span>
                                    </td>

                                    {/* PRICE COLUMN */}
                                    <td className="py-3 px-4">
                                      <div className="font-black text-slate-900 text-xs">
                                        {formatCurrency(p.priceBDT, 'BDT')}
                                      </div>
                                      {p.oldPriceBDT > p.priceBDT && (
                                        <div className="text-[10px] text-slate-400 line-through">
                                          {formatCurrency(p.oldPriceBDT, 'BDT')}
                                        </div>
                                      )}
                                    </td>

                                    {/* FLASH DEAL COLUMN */}
                                    <td className="py-3 px-4">
                                      {p.isFlashDeal || discountPercent > 0 ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-black">
                                          ⚡ {discountPercent}% OFF
                                        </span>
                                      ) : (
                                        <span className="text-slate-300 font-bold">—</span>
                                      )}
                                    </td>

                                    {/* INVENTORY STOCK COLUMN */}
                                    <td className="py-3 px-4">
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-bold">
                                        {p.stockCount} in stock
                                      </span>
                                    </td>

                                    {/* RATING COLUMN */}
                                    <td className="py-3 px-4">
                                      <div className="flex items-center gap-1 font-bold text-slate-700 text-xs">
                                        <span className="text-amber-500">★</span>
                                        <span>{p.rating.toFixed(1)}</span>
                                      </div>
                                    </td>

                                    {/* ACTIONS COLUMN */}
                                    <td className="py-3 px-4 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => handleStartEdit(p)}
                                          className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-[#6366f1] transition cursor-pointer"
                                          title="Edit Product"
                                        >
                                          <Edit size={13} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                              onDeleteProduct(p.id);
                                              setSaveSuccessMsg(`Product "${p.name}" removed.`);
                                              setTimeout(() => setSaveSuccessMsg(''), 3000);
                                            }
                                          }}
                                          className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                          title="Delete Product"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ================= PRODUCT ADD / EDIT FORM ================= */
                  <form onSubmit={handleSaveProduct} className="space-y-4 max-w-3xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6366f1] block">
                          PRODUCT EDITOR
                        </span>
                        <h2 className="text-lg font-black text-slate-900">
                          {editingId !== null ? 'Edit Product Details' : 'Add New Product to Store'}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 block">Product Title (English) *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium outline-none focus:border-[#6366f1]"
                          placeholder="e.g. Aura Pro Wireless ANC Headphones"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 block">Title (বাংলায় পণ্যের নাম) *</label>
                        <input
                          type="text"
                          value={formData.bnName || ''}
                          onChange={(e) => setFormData({ ...formData, bnName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium outline-none focus:border-[#6366f1]"
                          placeholder="e.g. অরা প্রো ওয়্যারলেস এএনসি হেডফোন"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 block">Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name} ({c.bnName})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 block">SKU / Slug Code</label>
                        <input
                          type="text"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-mono outline-none focus:border-[#6366f1]"
                          placeholder="e.g. SMC-AUD-001"
                        />
                      </div>
                    </div>

                    {/* Price & Stock */}
                    <div className="grid gap-3 sm:grid-cols-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 mb-1 block">Offer Price (৳ BDT) *</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={formData.priceBDT}
                          onChange={(e) => setFormData({ ...formData, priceBDT: Number(e.target.value) })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-black text-slate-900 outline-none focus:border-[#6366f1]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 mb-1 block">Original Regular Price (৳)</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.oldPriceBDT}
                          onChange={(e) => setFormData({ ...formData, oldPriceBDT: Number(e.target.value) })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-500 outline-none focus:border-[#6366f1]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 mb-1 block">Stock Quantity</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.stockCount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              stockCount: Number(e.target.value),
                              stock: Number(e.target.value) > 0 ? 'In Stock' : 'Out of Stock'
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-emerald-700 outline-none focus:border-[#6366f1]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 mb-1 block">Flash Deal Status</label>
                        <label className="flex items-center gap-2 cursor-pointer pt-1.5 text-xs font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={formData.isFlashDeal}
                            onChange={(e) => setFormData({ ...formData, isFlashDeal: e.target.checked })}
                            className="rounded text-[#6366f1]"
                          />
                          <span>⚡ Flash Deal</span>
                        </label>
                      </div>
                    </div>

                    {/* Image URL & Presets */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Product Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-mono outline-none focus:border-[#6366f1]"
                          placeholder="https://images.unsplash.com/..."
                        />
                        {formData.image && (
                          <div className="w-10 h-10 rounded-lg border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {PRESET_IMAGE_OPTIONS.map((opt) => (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => setFormData({ ...formData, image: opt.url })}
                            className={`px-2 py-1 rounded-md text-[11px] font-medium border transition ${
                              formData.image === opt.url
                                ? 'border-[#6366f1] bg-indigo-50 text-[#6366f1] font-bold'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 block">Description (English)</label>
                        <textarea
                          rows={2}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium outline-none focus:border-[#6366f1]"
                          placeholder="Product highlights, specifications, battery..."
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 block">Description (বাংলা বিবরণ)</label>
                        <textarea
                          rows={2}
                          value={formData.bnDescription || ''}
                          onChange={(e) => setFormData({ ...formData, bnDescription: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium outline-none focus:border-[#6366f1]"
                          placeholder="পণ্যের ওয়ারেন্টি ও বিশেষ সুবিধা..."
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition"
                      >
                        <Save size={14} />
                        <span>{editingId !== null ? 'Update Product' : 'Publish Product'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ================= TAB 2: DASHBOARD & ANALYTICS ================= */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#6366f1] block">
                    OVERVIEW &amp; PERFORMANCE
                  </span>
                  <h2 className="text-xl font-black text-slate-900">Store Analytics &amp; KPIs</h2>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
                    <p className="text-xl font-black text-slate-900 mt-1">{formatCurrency(totalRevenueBDT, 'BDT')}</p>
                    <span className="text-[10px] font-bold text-emerald-600">↑ 18.4% this month</span>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
                    <p className="text-xl font-black text-slate-900 mt-1">{orders.length}</p>
                    <span className="text-[10px] font-bold text-emerald-600">100% WhatsApp confirmed</span>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Catalog</span>
                    <p className="text-xl font-black text-slate-900 mt-1">{products.length} Items</p>
                    <span className="text-[10px] font-bold text-[#6366f1]">{flashDealsCount} Flash Deals</span>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp Dispatch</span>
                    <p className="text-sm font-black text-emerald-600 mt-2 font-mono">01794608874</p>
                    <span className="text-[10px] font-bold text-slate-400">Direct wa.me router</span>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">Recent Customer WhatsApp Transmissions</h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3">Order / Tracking</th>
                          <th className="py-2.5 px-3">Customer</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Total Amount</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {safeOrders.slice(0, 5).map((o) => (
                          <tr key={o.orderId} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-3 font-mono font-bold text-[#6366f1]">
                              {o.trackingId} <span className="text-slate-400 text-[10px]">({o.orderId})</span>
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-800">{o.customerName} ({o.phone})</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-[#6366f1] font-bold text-[10px] uppercase">
                                {o.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-black text-emerald-600">
                              {formatCurrency(o.grandTotal, o.currency)}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => setActiveTab('orders')}
                                className="text-[11px] font-bold text-[#6366f1] hover:underline"
                              >
                                View Order →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: FLASH SALES & DEALS ================= */}
            {activeTab === 'flash_sales' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#6366f1] block">
                      DEALS &amp; PROMOTIONS
                    </span>
                    <h2 className="text-xl font-black text-slate-900">Flash Sales Management</h2>
                    <p className="text-xs text-slate-400">Toggle items to feature in the countdown deals section on homepage.</p>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                    ⚡ {flashDealsCount} Active Deals
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {safeProducts.map((p) => (
                    <div
                      key={p.id}
                      className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                        p.isFlashDeal ? 'border-amber-300 bg-amber-50/40 shadow-xs' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg bg-slate-100 shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-800 truncate">{p.name}</h4>
                          <p className="text-xs font-black text-emerald-600 mt-0.5">৳{p.priceBDT.toLocaleString()}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...p, isFlashDeal: !p.isFlashDeal };
                          onUpdateProduct(updated);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
                          p.isFlashDeal
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {p.isFlashDeal ? '⚡ Active' : '+ Add Deal'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 4: ORDERS & SHIPMENTS WITH PARCEL TRACKING UPDATER ================= */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#6366f1] block">
                      LOGISTICS &amp; DISPATCH
                    </span>
                    <h2 className="text-xl font-black text-slate-900">Orders &amp; Shipments ({safeOrders.length})</h2>
                    <p className="text-xs text-slate-400">
                      Manage parcel status, assign couriers, and update customer tracking timelines.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {safeOrders.map((ord) => (
                    <div key={ord.orderId} className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs hover:border-slate-300 transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-xs font-black text-[#6366f1] bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                            Tracking: {ord.trackingId}
                          </span>
                          <span className="text-xs font-bold text-slate-800">#{ord.orderId}</span>
                          <span className="text-[11px] text-slate-400">• {ord.createdAt}</span>
                        </div>

                        {/* Status Updater Select */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => {
                              if (onUpdateOrderStatus) {
                                onUpdateOrderStatus(ord.orderId, e.target.value as OrderStatus, ord.courierName);
                                setSaveSuccessMsg(`Order #${ord.orderId} status updated to ${e.target.value}`);
                                setTimeout(() => setSaveSuccessMsg(''), 3000);
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800 outline-none cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-3 grid sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="font-bold text-slate-800">
                            {ord.customerName} (📞 {ord.phone})
                          </p>
                          <p className="text-slate-500 mt-0.5">📍 {ord.address} ({ord.cityZone})</p>
                          <p className="text-slate-500 mt-0.5">
                            Courier: <strong className="text-slate-700">{ord.courierName}</strong>
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <p className="font-medium text-slate-700">
                            {ord.items.map((i) => `${i.name} x${i.qty}`).join(', ')}
                          </p>
                          <p className="text-sm font-black text-emerald-600 mt-1">
                            Collect: {formatCurrency(ord.grandTotal, ord.currency)} ({ord.paymentMethod})
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Sent to WhatsApp: {ord.whatsappRecipient}</span>
                        <a
                          href={`https://wa.me/${ord.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(ord.customerName)},%20update%20regarding%20your%20SMARTCART%20order%20${ord.orderId}%20(Tracking:%20${ord.trackingId})`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:bg-[#20bd5a] transition"
                        >
                          <WhatsAppIcon size={13} />
                          <span>Chat with Customer</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 5: CATEGORIES ================= */}
            {activeTab === 'categories' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#6366f1] block">
                    TAXONOMY &amp; COLLECTIONS
                  </span>
                  <h2 className="text-xl font-black text-slate-900">Product Categories ({CATEGORIES.length})</h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {CATEGORIES.map((cat) => {
                    const count = safeProducts.filter((p) => p && p.category && p.category.toLowerCase() === cat.name.toLowerCase()).length;
                    return (
                      <div key={cat.name} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#6366f1] shadow-2xs">
                          <ProductIcon name={cat.icon} className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{cat.name}</h4>
                          <p className="text-[11px] text-slate-400">{cat.bnName}</p>
                          <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-block">
                            {count} Items in Catalog
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= TAB 6: HERO BANNERS ================= */}
            {activeTab === 'hero_banners' && (
              <div className="space-y-4 max-w-2xl">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#6366f1] block">
                    STOREFRONT PROMOTIONS
                  </span>
                  <h2 className="text-xl font-black text-slate-900">Hero Banners &amp; Highlights</h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Hero Headline</label>
                    <input
                      type="text"
                      value={settingsForm.heroHeadline || 'Official SMARTCART Verified Gadget Store'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 outline-none focus:border-[#6366f1]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Top Banner Announcement</label>
                    <input
                      type="text"
                      value={settingsForm.announcementText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 outline-none focus:border-[#6366f1]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onUpdateSettings(settingsForm);
                      setSaveSuccessMsg('Hero banners updated.');
                      setTimeout(() => setSaveSuccessMsg(''), 3000);
                    }}
                    className="px-5 py-2 rounded-xl bg-[#6366f1] text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Save Banner Changes
                  </button>
                </div>
              </div>
            )}

            {/* ================= TAB 7: AI PRODUCT GENERATOR ================= */}
            {activeTab === 'ai_generator' && (
              <div className="space-y-4 max-w-2xl">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#6366f1] block">
                    SMART GENERATION
                  </span>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Sparkles size={20} className="text-[#6366f1]" />
                    <span>AI Product Generator</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Instantly create new products with English + Bengali translations, realistic BDT prices, SKU, tags, and photography.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-indigo-100 bg-indigo-50/50 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">
                      Product Prompt / Keywords
                    </label>
                    <textarea
                      rows={3}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. Ergonomic RGB Mechanical Keyboard with Bengali translation..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 outline-none focus:border-[#6366f1]"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="font-bold text-slate-400">Try Prompts:</span>
                    {['Gaming RGB Mouse', 'Smart Thermos Bottle', '4K Car Dash Cam'].map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => setAiPrompt(prompt)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[#6366f1] font-semibold hover:bg-indigo-50 text-[11px]"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={isAiGenerating}
                    onClick={handleAiGenerate}
                    className="w-full py-3 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles size={16} />
                    <span>{isAiGenerating ? 'Generating Product with AI...' : 'Generate & Add to Catalog'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ================= TAB: STAFF & ACCESS CONTROL ================= */}
            {activeTab === 'staff_access' && (
              <StaffAccessTab
                usersList={usersList}
                currentUser={currentUser}
                onAddStaff={onAddStaff}
                onUpdateStaffRole={onUpdateStaffRole}
                onDeleteStaff={onDeleteStaff}
                onSendTestNotification={onSendTestNotification}
              />
            )}

            {/* ================= TAB 8: STORE SETTINGS ================= */}
            {activeTab === 'settings' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onUpdateSettings(settingsForm);
                  setSaveSuccessMsg('Store & WhatsApp Hotline settings saved successfully!');
                  setTimeout(() => setSaveSuccessMsg(''), 3000);
                }}
                className="space-y-4 max-w-2xl"
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#6366f1] block">
                    CORE CONFIGURATION
                  </span>
                  <h2 className="text-xl font-black text-slate-900">WhatsApp Dispatch &amp; Store Setup</h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <WhatsAppIcon size={14} className="text-[#25D366]" />
                      WhatsApp Hotline Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs text-slate-800 outline-none focus:border-[#6366f1]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Phone size={13} className="text-slate-400" />
                      International Format (wa.me) *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.whatsappInternational}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappInternational: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-800 outline-none focus:border-[#6366f1]"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 mb-1 block">Inside Dhaka (৳)</label>
                    <input
                      type="number"
                      value={settingsForm.insideDhakaFeeBDT}
                      onChange={(e) => setSettingsForm({ ...settingsForm, insideDhakaFeeBDT: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 mb-1 block">Dhaka Suburbs (৳)</label>
                    <input
                      type="number"
                      value={settingsForm.subDhakaFeeBDT}
                      onChange={(e) => setSettingsForm({ ...settingsForm, subDhakaFeeBDT: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 mb-1 block">Outside Dhaka (৳)</label>
                    <input
                      type="number"
                      value={settingsForm.outsideDhakaFeeBDT}
                      onChange={(e) => setSettingsForm({ ...settingsForm, outsideDhakaFeeBDT: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition"
                  >
                    <Save size={14} />
                    <span>Save Settings</span>
                  </button>
                </div>
              </form>
            )}
          </main>
        </div>
      </motion.div>
    </div>
  );
};
