'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Search, ArrowUpDown } from 'lucide-react';
import { 
  Product, 
  CartItem, 
  Currency, 
  OrderDetails, 
  StoreSettings, 
  UserAccount, 
  OrderStatus, 
  UserRole, 
  SupportInquiry, 
  StaffNotification,
  SupportInquiryReply,
  UserPermissions 
} from './types';
import { PRODUCTS, DEFAULT_STORE_SETTINGS } from './data/products';
import { INITIAL_ORDERS } from './data/mockOrders';
import { INITIAL_USERS } from './data/mockUsers';
import { INITIAL_INQUIRIES } from './data/mockInquiries';
import { INITIAL_NOTIFICATIONS } from './data/mockNotifications';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBadges } from './components/TrustBadges';
import { CategoriesSection } from './components/CategoriesSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { WhatsAppCheckoutModal } from './components/WhatsAppCheckoutModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistModal } from './components/WishlistModal';
import { DealsCountdown } from './components/DealsCountdown';
import { ReviewsSection } from './components/ReviewsSection';
import { AboutSection } from './components/AboutSection';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { AdminPanelModal } from './components/AdminPanelModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { UnifiedAuthModal } from './components/UnifiedAuthModal';
import { OrderModeratorModal } from './components/OrderModeratorModal';
import { CustomerSupportModal } from './components/CustomerSupportModal';
import { fetchStoreSnapshot, pushStoreSnapshot } from './lib/api-client';

export default function App() {
  // Store Settings state persisted to localStorage
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('smartcart_settings');
      return saved ? { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(saved) } : DEFAULT_STORE_SETTINGS;
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  });

  // Products state persisted to localStorage (Allows Admin to Add, Edit, Delete)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('smartcart_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // Orders Log state persisted to localStorage (prepopulated with INITIAL_ORDERS)
  const [orders, setOrders] = useState<OrderDetails[]>(() => {
    try {
      const saved = localStorage.getItem('smartcart_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // All registered Staff & Customer Accounts
  const [usersList, setUsersList] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('smartcart_users_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((u: any) => ({
            role: 'customer',
            status: 'active',
            ...u,
            ...(u?.phone === '01794608874' || u?.username === 'joy' || u?.id === 'USR-ADMIN-01' ? { role: 'admin' } : {})
          }));
        }
      }
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Current Logged-in User
  // NOTE: never auto-login. A visitor is always anonymous until they sign in
  // through the auth modal. Only an explicitly saved session is restored.
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('smartcart_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.id) {
        return {
          role: 'customer',
          status: 'active',
          ...parsed
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  // Support Inquiries / Tickets
  const [inquiriesList, setInquiriesList] = useState<SupportInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('smartcart_inquiries');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_INQUIRIES;
    } catch {
      return INITIAL_INQUIRIES;
    }
  });

  // Staff Notifications (SMS/Email/System alerts)
  const [notificationsList, setNotificationsList] = useState<StaffNotification[]>(() => {
    try {
      const saved = localStorage.getItem('smartcart_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('smartcart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted to localStorage
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('smartcart_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Currency state (Default to BDT for Bangladesh WhatsApp order)
  const [currency, setCurrency] = useState<Currency>('BDT');

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Modals & Drawers
  const [isUnifiedAuthOpen, setIsUnifiedAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOrderModeratorOpen, setIsOrderModeratorOpen] = useState(false);
  const [isCustomerSupportOpen, setIsCustomerSupportOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [initialTrackingCode, setInitialTrackingCode] = useState<string>('');
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);
  
  // WhatsApp Checkout Modal States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directProductForCheckout, setDirectProductForCheckout] = useState<Product | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync Products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smartcart_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Sync Store Settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smartcart_settings', JSON.stringify(storeSettings));
    } catch (e) {
      console.error(e);
    }
  }, [storeSettings]);

  // Sync Orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smartcart_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Sync Users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smartcart_users_list', JSON.stringify(usersList));
    } catch (e) {
      console.error(e);
    }
  }, [usersList]);

  // Sync User Account to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('smartcart_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('smartcart_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Sync Inquiries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smartcart_inquiries', JSON.stringify(inquiriesList));
    } catch (e) {
      console.error(e);
    }
  }, [inquiriesList]);

  // Sync Notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smartcart_notifications', JSON.stringify(notificationsList));
    } catch (e) {
      console.error(e);
    }
  }, [notificationsList]);

  // Sync Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smartcart_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync Wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smartcart_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // ---------------------------------------------------------------
  // PostgreSQL sync (replaces the old Firestore realtime listeners)
  // ---------------------------------------------------------------
  const [serverHydrated, setServerHydrated] = useState(false);
  const skipFirstPush = useRef(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const snapshot = await fetchStoreSnapshot();
      if (!cancelled && snapshot) {
        if (Array.isArray(snapshot.products) && snapshot.products.length) {
          setProducts(snapshot.products);
        }
        if (snapshot.settings) {
          setStoreSettings((prev) => ({ ...prev, ...snapshot.settings }));
        }
        if (Array.isArray(snapshot.orders) && snapshot.orders.length) {
          setOrders((prev) => {
            const map = new Map(snapshot.orders.map((o) => [o.orderId, o]));
            prev.forEach((o) => {
              if (!map.has(o.orderId)) map.set(o.orderId, o);
            });
            return Array.from(map.values());
          });
        }
        if (Array.isArray(snapshot.users) && snapshot.users.length) {
          setUsersList((prev) => {
            const map = new Map(snapshot.users.map((u) => [u.id, u]));
            prev.forEach((u) => {
              if (!map.has(u.id)) map.set(u.id, u);
            });
            return Array.from(map.values());
          });
        }
        if (Array.isArray(snapshot.inquiries) && snapshot.inquiries.length) {
          setInquiriesList((prev) => {
            const map = new Map(snapshot.inquiries.map((i) => [i.id, i]));
            prev.forEach((i) => {
              if (!map.has(i.id)) map.set(i.id, i);
            });
            return Array.from(map.values());
          });
        }
      }
      if (!cancelled) setServerHydrated(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Persist every store mutation back into PostgreSQL (debounced)
  useEffect(() => {
    if (!serverHydrated) return;
    if (skipFirstPush.current) {
      skipFirstPush.current = false;
      return;
    }
    const timer = setTimeout(() => {
      void pushStoreSnapshot({
        products,
        orders,
        users: usersList,
        inquiries: inquiriesList,
        settings: storeSettings
      });
    }, 900);
    return () => clearTimeout(timer);
  }, [serverHydrated, products, orders, usersList, inquiriesList, storeSettings]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Automated Alert Broadcast Trigger
  const triggerNotification = (notif: Partial<StaffNotification>) => {
    const newNotif: StaffNotification = {
      id: `NOTIF-${Date.now()}`,
      type: notif.type || 'system',
      title: notif.title || 'System Notification',
      message: notif.message || '',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) + ', Today',
      targetRole: notif.targetRole || 'all',
      channels: notif.channels || ['SMS', 'Email', 'System'],
      read: false,
      data: notif.data
    };

    setNotificationsList(prev => [newNotif, ...prev]);
  };

  // Role-Based Login Success Dispatcher (Directs user straight to their respective workplace)
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setIsUnifiedAuthOpen(false);

    // Save/update in registered users if not exists
    setUsersList(prev => {
      const idx = prev.findIndex(u => u.id === user.id || u.phone === user.phone || u.username === user.username);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...user, lastActive: 'Just now' };
        return updated;
      }
      return [user, ...prev];
    });

    // Automatically route to their designated role dashboard
    if (user.role === 'admin') {
      setIsAdminOpen(true);
      showToast(`👑 স্বাগতম Joy Chowdhury! Main Admin ড্যাশবোর্ড ওপেন হয়েছে।`);
    } else if (user.role === 'moderator') {
      setIsOrderModeratorOpen(true);
      showToast(`📦 স্বাগতম ${user.fullName}! Order Confirmation & Courier ড্যাশবোর্ড ওপেন হয়েছে।`);
    } else if (user.role === 'support') {
      setIsCustomerSupportOpen(true);
      showToast(`🎧 স্বাগতম ${user.fullName}! Customer Support Helpdesk ওপেন হয়েছে।`);
    } else {
      setIsAccountOpen(true);
      showToast(`🛍️ স্বাগতম ${user.fullName}! আপনার কাস্টমার একাউন্টে লগইন হয়েছে।`);
    }
  };

  // Open specific dashboard by role
  const handleOpenRoleModal = (role: UserRole) => {
    if (role === 'admin') {
      setIsAdminOpen(true);
    } else if (role === 'moderator') {
      setIsOrderModeratorOpen(true);
    } else if (role === 'support') {
      setIsCustomerSupportOpen(true);
    } else {
      setIsAccountOpen(true);
    }
  };

  // Open the respective dashboard based on active role
  const handleOpenRoleDashboard = () => {
    if (!currentUser) {
      setIsUnifiedAuthOpen(true);
      return;
    }
    handleOpenRoleModal(currentUser.role || 'customer');
  };

  // Staff Management Handlers
  const handleAddStaff = (newStaff: UserAccount) => {
    setUsersList(prev => [newStaff, ...prev]);
    const staffRoleName = (newStaff.role || 'staff').toUpperCase();
    showToast(`টিম মেম্বার ${newStaff.fullName} (${staffRoleName}) যুক্ত করা হয়েছে!`);
    triggerNotification({
      type: 'system',
      title: '👥 New Staff Account Created',
      message: `${newStaff.fullName} was added to the team with ${staffRoleName} access by Main Admin.`,
      targetRole: 'admin',
      channels: ['Email', 'System']
    });
  };

  const handleUpdateStaffRole = (userId: string, newRole: UserRole, status?: 'active' | 'inactive', permissions?: UserPermissions) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          role: newRole,
          status: status || u.status,
          permissions: permissions !== undefined ? permissions : u.permissions
        };
      }
      return u;
    }));

    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role: newRole, status: status || prev.status, permissions: permissions !== undefined ? permissions : prev.permissions } : null);
    }
  };

  const handleDeleteStaff = (userId: string) => {
    setUsersList(prev => prev.filter(u => u.id !== userId));
  };

  // Customer Support Inquiries Handlers
  const handleReplyInquiry = (inquiryId: string, replyText: string, responderName: string) => {
    const newReply: SupportInquiryReply = {
      id: `REP-${Date.now()}`,
      sender: responderName,
      text: replyText,
      timestamp: 'Just now',
      isStaff: true
    };

    setInquiriesList(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return {
          ...inq,
          status: 'resolved',
          assignedTo: responderName,
          replies: [...(inq.replies || []), newReply]
        };
      }
      return inq;
    }));
    showToast(`মেসেজের উত্তর পাঠানো হয়েছে!`);
  };

  const handleUpdateInquiryStatus = (inquiryId: string, status: 'open' | 'in_progress' | 'resolved') => {
    setInquiriesList(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, status } : inq));
    showToast(`টিকিট স্ট্যাটাস আপডেট হয়েছে: ${(status || '').toUpperCase()}`);
  };

  const handleCreateInquiry = (inqData: Partial<SupportInquiry>) => {
    const newInquiry: SupportInquiry = {
      id: `INQ-${Date.now().toString().slice(-4)}`,
      customerName: inqData.customerName || currentUser?.fullName || 'Customer',
      phone: inqData.phone || currentUser?.phone || '017XXXXXXXX',
      email: inqData.email || currentUser?.email || 'customer@smartcart.com',
      category: inqData.category || 'Product Question',
      subject: inqData.subject || 'Question regarding products',
      message: inqData.message || '',
      status: 'open',
      priority: inqData.priority || 'normal',
      createdAt: 'Just now',
      replies: []
    };

    setInquiriesList(prev => [newInquiry, ...prev]);

    // Dispatch automated instant notification to Customer Support Staff (Rimi & Tanvir)
    triggerNotification({
      type: 'inquiry',
      title: `🎧 New Customer Support Inquiry (${newInquiry.id})`,
      message: `${newInquiry.customerName} (${newInquiry.phone}): "${newInquiry.subject}"`,
      targetRole: 'support',
      channels: ['SMS', 'Email', 'System'],
      data: {
        inquiryId: newInquiry.id,
        customerName: newInquiry.customerName,
        phone: newInquiry.phone
      }
    });

    showToast('আপনার মেসেজ সাপোর্ট টিমের কাছে পৌঁছেছে!');
  };

  // Open Tracking modal with prefilled code
  const handleOpenTrackingWithCode = (code?: string) => {
    setInitialTrackingCode(code || '');
    setIsTrackingOpen(true);
  };

  // Admin CRUD for products
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`নতুন প্রোডাক্ট "${newProduct.name}" সফলভাবে যুক্ত হয়েছে!`);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    showToast(`প্রোডাক্ট "${updatedProduct.name}" আপডেট করা হয়েছে!`);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.productId !== id));
    setWishlist((prev) => prev.filter((item) => item !== id));
    showToast('প্রোডাক্ট ডিলিট করা হয়েছে!');
  };

  // Reset to default
  const handleResetDefaults = () => {
    setProducts(PRODUCTS);
    setStoreSettings(DEFAULT_STORE_SETTINGS);
    setOrders(INITIAL_ORDERS);
    showToast('ডিফল্ট প্রোডাক্ট এবং সেটিংস রিস্টোর করা হয়েছে!');
  };

  // Update order status from Admin or Moderator panel
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus, courierName?: string, notes?: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.orderId === orderId) {
        const now = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        const updatedTimeline = ord.timeline?.map(t => {
          if (t.status === newStatus) {
            return { ...t, completed: true, timestamp: now };
          }
          return t;
        }) || [];
        return {
          ...ord,
          status: newStatus,
          courierName: courierName || ord.courierName,
          notes: notes !== undefined ? notes : ord.notes,
          timeline: updatedTimeline
        };
      }
      return ord;
    }));
    showToast(`অর্ডার #${orderId} এর স্ট্যাটাস '${newStatus}' এ পরিবর্তন হয়েছে!`);
  };

  // Add to cart handler
  const handleAddToCart = (product: Product, qty = 1, color?: string, size?: string) => {
    const selectedColor = color || product.colors?.[0] || '';
    const selectedSize = size || product.sizes?.[0] || '';
    const cartItemId = `${product.id}-${selectedColor}-${selectedSize}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          qty,
          selectedColor,
          selectedSize
        }
      ];
    });

    showToast(`"${product.name}" কার্টে যুক্ত হয়েছে`);
  };

  // Update quantity in cart
  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove from cart
  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('আইটেমটি কার্ট থেকে সরানো হয়েছে');
  };

  // Clear cart
  const handleClearCart = () => {
    setCart([]);
  };

  // Toggle wishlist
  const handleToggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('উইশলিস্ট থেকে সরানো হয়েছে');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('উইশলিস্টে সেভ করা হয়েছে ❤️');
        return [...prev, productId];
      }
    });
  };

  // Direct 1-Click WhatsApp order from product card
  const handleDirectWhatsAppOrder = (product: Product) => {
    setDirectProductForCheckout(product);
    setIsCheckoutOpen(true);
  };

  // Open multi-item cart WhatsApp checkout
  const handleOpenCartWhatsAppCheckout = () => {
    setDirectProductForCheckout(null);
    setIsCheckoutOpen(true);
  };

  // Order Success callback: Dispatches instant notifications to Tushar & Shakib (Order Moderators) and Joy (Admin)
  const handleOrderSuccess = (order: OrderDetails) => {
    // Record order in Admin order logs
    setOrders(prev => [order, ...prev]);

    // If customer is logged in, attach to their history
    if (currentUser) {
      setCurrentUser(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          orderHistory: [order, ...(prev.orderHistory || [])]
        };
      });
    }

    // Dispatch automated instant SMS/Email/System alert to Order Moderators (Tushar & Shakib)
    triggerNotification({
      type: 'order',
      title: `📦 New Order Placed: #${order.orderId}`,
      message: `Customer ${order.customerName} (${order.phone}) ordered ${order.items.length} items. Total: ৳${order.grandTotal.toLocaleString()}. Call for confirmation.`,
      targetRole: 'moderator',
      channels: ['SMS', 'Email', 'System'],
      data: {
        orderId: order.orderId,
        trackingId: order.trackingId,
        customerName: order.customerName,
        phone: order.phone,
        amount: order.grandTotal
      }
    });

    // If it was a cart checkout, clear cart
    if (!directProductForCheckout) {
      setCart([]);
    }
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch =
        searchTerm.trim() === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.bnName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      const priceA = currency === 'BDT' ? a.priceBDT : a.priceUSD;
      const priceB = currency === 'BDT' ? b.priceBDT : b.priceUSD;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, activeCategory, searchTerm, sortBy, currency]);

  // Cart total calculations
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const p = currency === 'BDT' ? item.product.priceBDT : item.product.priceUSD;
    return sum + p * item.qty;
  }, 0);

  // Unread notification count for active user role
  const unreadNotifs = notificationsList.filter(n => !n.read && (n.targetRole === 'all' || n.targetRole === currentUser?.role));

  // Dynamic Categories from existing products
  const categoriesList = useMemo(() => {
    const unique = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...unique];
  }, [products]);

  const featuredHeroProduct = products[0] || PRODUCTS[0];

  // Products used by the Daraz-style hero slider (flash deals first)
  const heroSlideProducts = useMemo(() => {
    const flash = products.filter((p) => p.isFlashDeal);
    const rest = products.filter((p) => !p.isFlashDeal);
    return [...flash, ...rest].slice(0, 6);
  }, [products]);

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-emerald-500 selection:text-white">
      {/* Sticky Geometric Navbar with Single Unified Login Portal */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currency={currency}
        onToggleCurrency={() => setCurrency(c => c === 'BDT' ? 'USD' : 'BDT')}
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlist.length}
        storeSettings={storeSettings}
        currentUser={currentUser}
        unreadNotificationsCount={unreadNotifs.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenUnifiedAuth={() => setIsUnifiedAuthOpen(true)}
        onOpenTracking={() => handleOpenTrackingWithCode()}
        onOpenRoleDashboard={handleOpenRoleDashboard}
        onLogout={() => {
          setCurrentUser(null);
          showToast('লগআউট সম্পন্ন হয়েছে');
        }}
      />

      {/* Main Container */}
      <main>
        {/* Dynamic Hero Section */}
        <Hero
          featuredProduct={featuredHeroProduct}
          featuredProducts={heroSlideProducts}
          currency={currency}
          onAddToCart={handleAddToCart}
          onDirectWhatsAppOrder={handleDirectWhatsAppOrder}
        />

        {/* Trust Badges */}
        <TrustBadges />

        {/* Interactive Categories Bar */}
        <CategoriesSection
          categories={categoriesList}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Flash Deals / Countdown */}
        <section id="deals" className="pt-2">
          <DealsCountdown
            products={products.filter((p) => p.isFlashDeal)}
            currency={currency}
            onAddToCart={handleAddToCart}
            onDirectWhatsAppOrder={handleDirectWhatsAppOrder}
            onViewDetails={(p) => setSelectedProductForDetails(p)}
          />
        </section>

        {/* Product Catalog Grid Section */}
        <section id="products" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
                  OUR CURATED COLLECTION
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                {activeCategory === 'All' ? 'All Featured Products' : `${activeCategory} Collection`}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                সরাসরি WhatsApp বা ক্যাশ অন ডেলিভারিতে অর্ডার করুন নিমিষেই
              </p>
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs">
                <ArrowUpDown size={14} className="text-slate-400" />
                <span className="text-slate-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent outline-none font-bold text-slate-800 cursor-pointer"
                >
                  <option value="featured">Featured / Trending</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                </select>
              </div>

              {/* Reset filter badge */}
              {activeCategory !== 'All' && (
                <button
                  onClick={() => setActiveCategory('All')}
                  className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-xl hover:bg-indigo-100 transition"
                >
                  Clear Category ({activeCategory}) ✕
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={() => handleToggleWishlist(product.id)}
                  onAddToCart={(prod, qty, col, sz) => handleAddToCart(prod, qty, col, sz)}
                  onDirectWhatsAppOrder={(prod) => handleDirectWhatsAppOrder(prod)}
                  onViewDetails={(prod) => setSelectedProductForDetails(prod)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-2xs max-w-lg mx-auto">
              <Search size={40} className="text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-slate-800">কোন প্রোডাক্ট পাওয়া যায়নি</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                অনুগ্রহ করে অন্য কোনো কি-ওয়ার্ড দিয়ে সার্চ করুন অথবা ক্যাটাগরি ফিল্টার পরিবর্তন করুন।
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('All');
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm"
              >
                সকল প্রোডাক্ট দেখুন
              </button>
            </div>
          )}
        </section>

        {/* Customer Reviews Section */}
        <ReviewsSection />

        {/* About SMARTCART Section (#about anchor target) */}
        <AboutSection storeSettings={storeSettings} />
      </main>

      {/* Floating Action Buttons */}
      <FloatingWhatsApp storeSettings={storeSettings} />

      {/* Footer */}
      <Footer
        storeSettings={storeSettings}
        onOpenAdmin={() => {
          if (currentUser?.role === 'admin') {
            setIsAdminOpen(true);
          } else {
            setIsUnifiedAuthOpen(true);
          }
        }}
      />

      {/* ========================================================================= */}
      {/* ======================= ROLE-BASED & UNIFIED MODALS ===================== */}
      {/* ========================================================================= */}

      {/* 1. SINGLE UNIFIED AUTH MODAL (Everyone logs in from the same place) */}
      <UnifiedAuthModal
        isOpen={isUnifiedAuthOpen}
        onClose={() => setIsUnifiedAuthOpen(false)}
        currentUser={currentUser}
        usersList={usersList}
        onLogin={handleLoginSuccess}
        onLoginSuccess={handleLoginSuccess}
        onRegister={(newUser) => {
          setUsersList(prev => [newUser, ...prev]);
          handleLoginSuccess(newUser);
        }}
        onRegisterSuccess={(newUser) => {
          setUsersList(prev => [newUser, ...prev]);
          handleLoginSuccess(newUser);
        }}
        onLogout={() => {
          setCurrentUser(null);
          showToast('লগআউট সম্পন্ন হয়েছে');
        }}
        onNavigateToRoleDashboard={(role) => {
          handleOpenRoleModal(role);
        }}
      />

      {/* 2. ORDER MODERATOR DASHBOARD (Tushar & Shakib - Orders Only) */}
      <OrderModeratorModal
        isOpen={isOrderModeratorOpen}
        onClose={() => setIsOrderModeratorOpen(false)}
        currentUser={currentUser}
        orders={orders}
        currency={currency}
        notifications={notificationsList}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onLogout={() => {
          setIsOrderModeratorOpen(false);
          setCurrentUser(null);
          showToast('লগআউট সম্পন্ন হয়েছে');
        }}
        onOpenSwitchAccount={() => {
          setIsOrderModeratorOpen(false);
          setIsUnifiedAuthOpen(true);
        }}
      />

      {/* 3. CUSTOMER SUPPORT HELPDESK (Rimi & Tanvir - Inquiries & Tickets) */}
      <CustomerSupportModal
        isOpen={isCustomerSupportOpen}
        onClose={() => setIsCustomerSupportOpen(false)}
        currentUser={currentUser}
        inquiries={inquiriesList}
        notifications={notificationsList}
        onAddReply={(inqId, text) => {
          handleReplyInquiry(inqId, text, currentUser?.fullName || 'Customer Support');
        }}
        onUpdateInquiryStatus={handleUpdateInquiryStatus}
        onCreateInquiry={handleCreateInquiry}
        onLogout={() => {
          setIsCustomerSupportOpen(false);
          setCurrentUser(null);
          showToast('লগআউট সম্পন্ন হয়েছে');
        }}
        onOpenSwitchAccount={() => {
          setIsCustomerSupportOpen(false);
          setIsUnifiedAuthOpen(true);
        }}
      />

      {/* 4. MAIN ADMIN PANEL (Joy Chowdhury - Full Control + Staff & Access Control) */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        storeSettings={storeSettings}
        orders={orders}
        currency={currency}
        usersList={usersList}
        currentUser={currentUser}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateSettings={(newSettings) => {
          setStoreSettings(newSettings);
          showToast('স্টোর সেটিংস এবং WhatsApp হটলাইন সেভ করা হয়েছে!');
        }}
        onResetDefaultProducts={handleResetDefaults}
        onResetDefaults={handleResetDefaults}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onAddStaff={handleAddStaff}
        onUpdateStaffRole={handleUpdateStaffRole}
        onDeleteStaff={handleDeleteStaff}
        onSendTestNotification={triggerNotification}
      />

      {/* 5. PARCEL TRACKING MODAL */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
        currency={currency}
        whatsappNumber={storeSettings.whatsappNumber}
        initialTrackingCode={initialTrackingCode}
      />

      {/* 6. CUSTOMER ACCOUNT & PROFILE MODAL (Daraz Style) */}
      <CustomerAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currentUser={currentUser}
        orders={orders}
        wishlistIds={wishlist}
        products={products}
        currency={currency}
        onUpdateProfile={(updated) => {
          setCurrentUser(updated);
          setUsersList(prev => prev.map(u => u.id === updated.id ? updated : u));
          showToast('প্রোফাইল তথ্য আপডেট করা হয়েছে!');
        }}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          setUsersList(prev => prev.map(u => u.id === updated.id ? updated : u));
          showToast('প্রোফাইল তথ্য আপডেট করা হয়েছে!');
        }}
        onLogin={(user) => {
          handleLoginSuccess(user);
        }}
        onRegister={(user) => {
          setUsersList(prev => [user, ...prev]);
          handleLoginSuccess(user);
        }}
        onLogout={() => {
          setCurrentUser(null);
          showToast('লগআউট সম্পন্ন হয়েছে');
        }}
        onOpenTracking={(code) => {
          setIsAccountOpen(false);
          handleOpenTrackingWithCode(code);
        }}
        onAddToCart={handleAddToCart}
      />

      {/* 7. CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        currency={currency}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onOpenWhatsAppCheckout={handleOpenCartWhatsAppCheckout}
        onClearCart={handleClearCart}
      />

      {/* 8. WISHLIST MODAL */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        products={products}
        currency={currency}
        onRemoveWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onDirectWhatsAppOrder={handleDirectWhatsAppOrder}
      />

      {/* 9. PRODUCT DETAILS MODAL */}
      <ProductDetailsModal
        product={selectedProductForDetails}
        currency={currency}
        isWishlisted={selectedProductForDetails ? wishlist.includes(selectedProductForDetails.id) : false}
        onClose={() => setSelectedProductForDetails(null)}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onDirectWhatsAppOrder={handleDirectWhatsAppOrder}
      />

      {/* 10. DYNAMIC WHATSAPP CHECKOUT MODAL */}
      <WhatsAppCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setDirectProductForCheckout(null);
        }}
        directProduct={directProductForCheckout}
        cartItems={cart}
        currency={currency}
        currentUser={currentUser}
        onOrderSuccess={handleOrderSuccess}
        onOpenTracking={(trkCode) => {
          handleOpenTrackingWithCode(trkCode);
        }}
      />

      {/* 11. GLOBAL TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 pointer-events-none"
          >
            <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xl border border-slate-700">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
