import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, inquiriesApi, profileApi, tokenHelper } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  // ── Restore session from stored JWT ─────────────────────────
  useEffect(() => {
    const token = tokenHelper.get();
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((userData) => setUser(userData))
      .catch(() => tokenHelper.remove()) // token expired / invalid
      .finally(() => setLoading(false));
  }, []);

  // ── Modal helpers (Routes directly to unified /auth page) ───
  const openAuthModal = (tab = 'login', role = 'client') => {
    if (typeof window !== 'undefined') {
      window.location.hash = `#/auth?mode=${tab}&role=${role}`;
    }
    setAuthModalTab(tab);
    setIsAuthModalOpen(false);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // ── Login ─────────────────────────────────────────────────────
  const login = async ({ email, password }) => {
    const { token, user: userData } = await authApi.login(email, password);
    tokenHelper.set(token);
    setUser(userData);
    closeAuthModal();
    return userData;
  };

  // ── Signup ────────────────────────────────────────────────────
  const signup = async ({ name, email, password, role = 'DJ Operator', company = '', phone = '', location = '' }) => {
    const resolvedPhone = phone || email.split('@')[0];
    const { token, user: userData } = await authApi.register({
      name,
      phone: resolvedPhone,
      password,
      role,
      company,
      location,
    });
    tokenHelper.set(token);
    setUser(userData);
    closeAuthModal();
    return userData;
  };

  // ── Quick 1-click demo login (Dealer, Client, or Admin) ─────────
  const quickDemoLogin = async (roleType = 'dealer') => {
    const demos = {
      super_admin: { identifier: '9887158522', password: 'adminpassword123' },
      admin: { identifier: '9887158522', password: 'adminpassword123' },
      staff_admin: { identifier: '9829011223', password: 'adminpassword123' },
      pending_admin: { identifier: '9829988776', password: 'demo_client_123' },
      dealer: { identifier: '9829087654', password: 'demo_dealer_123' },
      client: { identifier: '9414033211', password: 'demo_client_123' },
    };
    const demo = demos[roleType] || demos.dealer;

    try {
      const { token, user: userData } = await authApi.login(demo.identifier, demo.password);
      tokenHelper.set(token);
      setUser(userData);
      closeAuthModal();
      return userData;
    } catch {
      // Demo account not in DB yet — create it
      try {
        const names = {
          super_admin: 'Rajesh Sharma (Super Admin)',
          admin: 'Rajesh Sharma (Super Admin)',
          staff_admin: 'Ramesh Verma (Approved Staff Admin)',
          dealer: 'Vikramaditya Rathore',
          client: 'Ananya Sharma',
          pending_admin: 'Deepak Meena (Pending Approval)',
        };
        const phones = {
          super_admin: '9887158522',
          admin: '9887158522',
          staff_admin: '9829011223',
          dealer: '9829087654',
          client: '9414033211',
          pending_admin: '9829988776',
        };
        const roles = {
          super_admin: 'super_admin',
          admin: 'super_admin',
          staff_admin: 'admin',
          dealer: 'Authorized Dealer',
          client: 'Audiophile VIP Client',
          pending_admin: 'client',
        };
        const { token, user: userData } = await authApi.register({
          name: names[roleType] || 'Radhe Radios Member',
          phone: phones[roleType] || '9887158522',
          password:
            roleType === 'admin' || roleType === 'super_admin' || roleType === 'staff_admin'
              ? 'adminpassword123'
              : roleType === 'dealer'
              ? 'demo_dealer_123'
              : 'demo_client_123',
          role: roles[roleType] || 'client',
          location:
            roleType === 'admin' || roleType === 'super_admin'
              ? 'Kota, Rajasthan'
              : roleType === 'dealer'
              ? 'Jaipur, Rajasthan'
              : 'Udaipur, Rajasthan',
          company:
            roleType === 'admin' || roleType === 'super_admin'
              ? 'Radhe Radios Headquarters'
              : roleType === 'dealer'
              ? 'Rajputana Sound & Lighting Co.'
              : 'Desert Echo Music Festivals',
        });
        tokenHelper.set(token);
        setUser(userData);
        closeAuthModal();
        return userData;
      } catch (err) {
        console.warn('Demo login failed:', err.message);
      }
    }
  };

  // ── Logout ────────────────────────────────────────────────────
  const logout = () => {
    tokenHelper.remove();
    setUser(null);
  };

  // ── Update profile (User edit and update) ─────────────────────
  const updateProfile = async (fields) => {
    if (!user) return;
    const updated = await profileApi.update(fields);
    setUser((prev) => ({ ...prev, ...updated }));
    return updated;
  };

  // ── Add inquiry (User create) ─────────────────────────────────
  const addInquiry = async (inquiry) => {
    if (!user) return;
    const created = await inquiriesApi.create(inquiry);
    setUser((prev) => ({
      ...prev,
      inquiries: [created, ...(prev.inquiries || [])],
    }));
    return created;
  };

  // ── Update inquiry (User edit and update) ─────────────────────
  const updateInquiry = async (id, updatedFields) => {
    if (!user) return;
    const updated = await inquiriesApi.update(id, updatedFields);
    setUser((prev) => ({
      ...prev,
      inquiries: (prev.inquiries || []).map((inq) =>
        inq.id === id || inq._id === id ? { ...inq, ...updated } : inq
      ),
    }));
    return updated;
  };

  // ── Delete/Cancel inquiry (User delete) ───────────────────────
  const deleteInquiry = async (id) => {
    if (!user) return;
    await inquiriesApi.delete(id);
    setUser((prev) => ({
      ...prev,
      inquiries: (prev.inquiries || []).filter((inq) => inq.id !== id && inq._id !== id),
    }));
  };

  const roleLower = (user?.role || '').toLowerCase();
  const isSuperAdmin = Boolean(
    user && (user.isSuperAdmin || roleLower === 'super_admin' || roleLower === 'super admin' || user.phone === '9887158522')
  );
  const isAdmin = Boolean(
    user && (isSuperAdmin || ((roleLower === 'admin' || user.role === 'Admin') && user.adminApproved !== false))
  );

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin,
    isSuperAdmin,
    loading,
    login,
    signup,
    logout,
    quickDemoLogin,
    updateProfile,
    addInquiry,
    updateInquiry,
    deleteInquiry,
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
