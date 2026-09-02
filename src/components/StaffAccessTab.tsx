import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Package,
  Headphones,
  ShoppingBag,
  CheckCircle2,
  Trash2,
  Lock,
  Search,
  Sliders,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { UserAccount, UserRole, UserPermissions, StaffNotification } from '../types';

interface StaffAccessTabProps {
  usersList: UserAccount[];
  currentUser: UserAccount | null;
  onAddStaff: (user: UserAccount) => void;
  onUpdateStaffRole: (userId: string, newRole: UserRole, status?: 'active' | 'inactive', permissions?: UserPermissions) => void;
  onDeleteStaff: (userId: string) => void;
  onSendTestNotification?: (notif: Partial<StaffNotification>) => void;
}

export const StaffAccessTab: React.FC<StaffAccessTabProps> = ({
  usersList,
  currentUser,
  onAddStaff,
  onUpdateStaffRole,
  onDeleteStaff,
  onSendTestNotification
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [editingPermissionsUser, setEditingPermissionsUser] = useState<UserAccount | null>(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('password123');
  const [newRole, setNewRole] = useState<UserRole>('moderator');
  const [newDuties, setNewDuties] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Permission editor state
  const [customPerms, setCustomPerms] = useState<UserPermissions>({});

  const handleOpenPermEditor = (user: UserAccount) => {
    setEditingPermissionsUser(user);
    setCustomPerms(user.permissions || {
      manageProducts: user.role === 'admin',
      manageOrders: user.role === 'admin' || user.role === 'moderator',
      manageDiscounts: user.role === 'admin',
      manageSupport: user.role === 'admin' || user.role === 'support',
      manageStaffAccess: user.role === 'admin',
      viewFinancials: user.role === 'admin',
      editStoreSettings: user.role === 'admin'
    });
  };

  const handleSavePerms = () => {
    if (!editingPermissionsUser) return;
    onUpdateStaffRole(editingPermissionsUser.id, editingPermissionsUser.role, editingPermissionsUser.status, customPerms);
    setSuccessMessage(`Custom permissions updated for ${editingPermissionsUser.fullName}`);
    setEditingPermissionsUser(null);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCreateStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!newName || !newPhone) {
      setErrorMessage('Name and phone number are required.');
      return;
    }

    const defaultPerms: UserPermissions = {
      manageProducts: newRole === 'admin',
      manageOrders: newRole === 'admin' || newRole === 'moderator',
      manageDiscounts: newRole === 'admin',
      manageSupport: newRole === 'admin' || newRole === 'support',
      manageStaffAccess: newRole === 'admin',
      viewFinancials: newRole === 'admin',
      editStoreSettings: newRole === 'admin'
    };

    const newStaff: UserAccount = {
      id: `USR-${newRole.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      fullName: newName.trim(),
      username: newUsername.trim() || newPhone.slice(-6),
      password: newPassword || 'password123',
      phone: newPhone.trim(),
      email: newEmail.trim() || `${newPhone.replace(/\D/g, '')}@smartcart.com`,
      role: newRole,
      status: 'active',
      deliveryAddress: 'Operations Center, Dhaka',
      city: 'Dhaka',
      joinedDate: 'September 2026',
      membershipLevel: 'VIP Platinum',
      assignedDuties: newDuties || `${newRole.toUpperCase()} Staff Member`,
      permissions: defaultPerms,
      lastActive: 'Just added'
    };

    onAddStaff(newStaff);
    setIsAddingStaff(false);
    setNewName('');
    setNewUsername('');
    setNewPhone('');
    setNewEmail('');
    setNewDuties('');
    setSuccessMessage(`Added ${newStaff.fullName} with ${newRole.toUpperCase()} access!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const q = searchFilter.toLowerCase();
    const matchesSearch = 
      !searchFilter ||
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.username && u.username.toLowerCase().includes(q));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-5 flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#6366f1] block">
            ROLE-BASED ACCESS CONTROL (RBAC)
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            User &amp; Staff Access Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            View everyone's access levels, promote/demote roles, or customize specific module permissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingStaff(!isAddingStaff)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0b1120] hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <UserPlus size={15} />
          <span>+ Add New User / Staff</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Role Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'admin', 'moderator', 'support', 'customer'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer shrink-0 ${
                roleFilter === r
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'all' ? `All (${usersList.length})` : `${r} (${usersList.filter(u => u.role === r).length})`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search name, phone, email..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-slate-900 bg-white"
          />
        </div>
      </div>

      {/* Add Staff Form */}
      {isAddingStaff && (
        <div className="p-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50/40 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900">Create New Staff / User Account</h3>
            <button onClick={() => setIsAddingStaff(false)} className="text-xs font-bold text-slate-400 hover:text-slate-700">
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateStaffSubmit} className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Shakib Ahmed"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Phone *</label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Assigned Role *</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-indigo-700"
              >
                <option value="admin">👑 Admin (Full Access)</option>
                <option value="moderator">📦 Moderator (Orders Only)</option>
                <option value="support">🎧 Customer Support (Helpdesk)</option>
                <option value="customer">🛍️ Customer</option>
              </select>
            </div>

            <div className="sm:col-span-3 flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Account &amp; Assign Role
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users & Staff List Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Account Holder</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Role &amp; Access Level</th>
                <th className="py-3 px-3">Active Permissions</th>
                <th className="py-3 px-3">Account Status</th>
                <th className="py-3 px-4 text-right">Customize Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const isAdmin = user.role === 'admin';
                const isMod = user.role === 'moderator';
                const isSup = user.role === 'support';
                const isJoyAdmin = user.phone === '01794608874' || user.email === 'joyc.info.bd@gmail.com';

                return (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition">
                    {/* User info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                          isAdmin ? 'bg-purple-700' : isMod ? 'bg-amber-600' : isSup ? 'bg-sky-600' : 'bg-slate-600'
                        }`}>
                          {user.fullName ? user.fullName.charAt(0) : 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{user.fullName}</span>
                            {isJoyAdmin && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 border border-purple-200">
                                OWNER
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block">{user.email || user.username}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                      {user.phone}
                    </td>

                    {/* Role Dropdown */}
                    <td className="py-3 px-3">
                      <select
                        value={user.role}
                        disabled={isJoyAdmin}
                        onChange={(e) => {
                          const newR = e.target.value as UserRole;
                          const defaultPerms: UserPermissions = {
                            manageProducts: newR === 'admin',
                            manageOrders: newR === 'admin' || newR === 'moderator',
                            manageDiscounts: newR === 'admin',
                            manageSupport: newR === 'admin' || newR === 'support',
                            manageStaffAccess: newR === 'admin',
                            viewFinancials: newR === 'admin',
                            editStoreSettings: newR === 'admin'
                          };
                          onUpdateStaffRole(user.id, newR, user.status, defaultPerms);
                          setSuccessMessage(`Role for ${user.fullName} changed to ${newR.toUpperCase()}!`);
                          setTimeout(() => setSuccessMessage(''), 3000);
                        }}
                        className={`py-1 px-2.5 rounded-xl font-bold text-xs border outline-none cursor-pointer ${
                          isAdmin
                            ? 'bg-purple-50 border-purple-200 text-purple-800'
                            : isMod
                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                            : isSup
                            ? 'bg-sky-50 border-sky-200 text-sky-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <option value="admin">👑 Admin</option>
                        <option value="moderator">📦 Moderator</option>
                        <option value="support">🎧 Support</option>
                        <option value="customer">🛍️ Customer</option>
                      </select>
                    </td>

                    {/* Active Permissions Badges */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {isAdmin && (
                          <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded-md">
                            All Admin Privileges
                          </span>
                        )}
                        {!isAdmin && user.permissions?.manageOrders && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-md">
                            Orders
                          </span>
                        )}
                        {!isAdmin && user.permissions?.manageProducts && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded-md">
                            Catalog
                          </span>
                        )}
                        {!isAdmin && user.permissions?.manageSupport && (
                          <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded-md">
                            Support
                          </span>
                        )}
                        {!isAdmin && !user.permissions?.manageOrders && !user.permissions?.manageProducts && !user.permissions?.manageSupport && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
                            Standard Customer
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        disabled={isJoyAdmin}
                        onClick={() => {
                          const nextStatus = user.status === 'active' ? 'inactive' : 'active';
                          onUpdateStaffRole(user.id, user.role, nextStatus, user.permissions);
                          setSuccessMessage(`${user.fullName} is now ${nextStatus.toUpperCase()}`);
                          setTimeout(() => setSuccessMessage(''), 3000);
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                          user.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border-slate-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        <span className="capitalize">{user.status}</span>
                      </button>
                    </td>

                    {/* Custom Permissions / Delete */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenPermEditor(user)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                          title="Configure Granular Permissions"
                        >
                          <Sliders size={14} />
                        </button>

                        {!isJoyAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete account for ${user.fullName}?`)) {
                                onDeleteStaff(user.id);
                                setSuccessMessage(`Removed ${user.fullName}`);
                                setTimeout(() => setSuccessMessage(''), 3000);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Remove Account"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Granular Permission Editor Modal */}
      {editingPermissionsUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">Custom Module Access</h3>
                <p className="text-xs text-slate-500">{editingPermissionsUser.fullName} ({editingPermissionsUser.role.toUpperCase()})</p>
              </div>
              <button onClick={() => setEditingPermissionsUser(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { key: 'manageProducts', label: 'Products & Inventory Catalog', desc: 'Add, edit, delete products & manage stocks' },
                { key: 'manageOrders', label: 'Orders & Dispatch Management', desc: 'Confirm orders, change statuses, book couriers' },
                { key: 'manageDiscounts', label: 'Flash Deals & Discounts', desc: 'Configure flash sale timer & discount tags' },
                { key: 'manageSupport', label: 'Customer Support Helpdesk', desc: 'Reply to customer messages & live inquiries' },
                { key: 'viewFinancials', label: 'Financial & Revenue Analytics', desc: 'View store sales statistics and reports' },
                { key: 'manageStaffAccess', label: 'Staff & Role Management (RBAC)', desc: 'Promote users and modify staff roles' },
                { key: 'editStoreSettings', label: 'Store Information & Branding', desc: 'Edit store name, WhatsApp hotline, address' }
              ].map((perm) => {
                const isEnabled = !!customPerms[perm.key as keyof UserPermissions];
                return (
                  <div
                    key={perm.key}
                    onClick={() => {
                      setCustomPerms({
                        ...customPerms,
                        [perm.key]: !isEnabled
                      });
                    }}
                    className="flex items-start justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{perm.label}</p>
                      <p className="text-[10px] text-slate-400">{perm.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition shrink-0 ${
                      isEnabled ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isEnabled && <Check size={12} strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingPermissionsUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePerms}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
