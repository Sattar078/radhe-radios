import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../router';
import {
  Lock,
  Phone,
  User,
  MapPin,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Crown,
  HeartHandshake,
  Wrench,
  X,
  Radio,
  Sliders,
} from 'lucide-react';

export function AuthPage() {
  const { user, isAuthenticated, isAdmin, login, signup, quickDemoLogin, logout } = useAuth();
  const { navigate, queryParams } = useRouter();

  // Mode: 'login' | 'signup'
  const initialMode = queryParams.get('mode') === 'signup' ? 'signup' : 'login';
  // Role: 'client' | 'admin'
  const initialRole = queryParams.get('role') === 'admin' ? 'admin' : 'client';

  const [mode, setMode] = useState(initialMode);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Client Celebration Family Popup State
  const [showClientFamilyModal, setShowClientFamilyModal] = useState(false);
  const [showPendingAdminModal, setShowPendingAdminModal] = useState(false);
  const [familyMemberData, setFamilyMemberData] = useState(null);

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Sign up fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Kota, Rajasthan');
  const [company, setCompany] = useState('');

  useEffect(() => {
    const qMode = queryParams.get('mode');
    const qRole = queryParams.get('role');
    if (qMode === 'signup' || qMode === 'login') setMode(qMode);
    if (qRole === 'admin' || qRole === 'client') setSelectedRole(qRole);
  }, [queryParams]);

  // Handle successful login/signup according to role
  const handleAuthSuccess = (userData, roleChosen) => {
    const roleLower = (userData?.role || '').toLowerCase();
    const isSuper = Boolean(
      userData?.isSuperAdmin ||
      roleLower === 'super_admin' ||
      roleLower === 'super admin' ||
      userData?.phone === '9887158522'
    );
    const isApprovedAdmin = Boolean(
      isSuper ||
      ((roleLower === 'admin' || userData?.role === 'Admin') && userData?.adminApproved !== false)
    );

    if (isApprovedAdmin) {
      // Approved Admin or Super Admin: directly open the admin dashboard!
      setSuccessMsg(isSuper ? '👑 Master Access: Opening Super Admin Command Center...' : '🛡️ Access Granted: Opening Workshop Admin Panel...');
      setTimeout(() => {
        navigate('/portal');
      }, 400);
    } else if (roleChosen === 'admin' && !isApprovedAdmin) {
      // Admin account registered or logged in, but awaiting Super Admin approval
      setFamilyMemberData(userData);
      setShowPendingAdminModal(true);
    } else {
      // Client: show celebratory "Member of Radhe Radios Family" popup!
      setFamilyMemberData(userData);
      setShowClientFamilyModal(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'login') {
      if (!identifier.trim() || !password) {
        setErrorMsg('Please enter your phone number or email and password.');
        return;
      }
      setSubmitting(true);
      try {
        const userData = await login({ email: identifier.trim(), password });
        handleAuthSuccess(userData, selectedRole);
      } catch (err) {
        setErrorMsg(err.message || 'Login failed. Please verify your credentials or register.');
      } finally {
        setSubmitting(false);
      }
    } else {
      // Signup
      if (!name.trim() || !phone.trim() || !password) {
        setErrorMsg('Please fill in your name, phone number, and password.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      setSubmitting(true);
      try {
        const assignedRole = selectedRole === 'admin' ? 'Admin' : 'Client Member';
        const userData = await signup({
          name: name.trim(),
          email: `${phone.trim().replace(/\D/g, '')}@radhestudio.com`,
          phone: phone.trim(),
          password,
          role: assignedRole,
          location: location.trim() || 'Kota, Rajasthan',
          company: company.trim() || (selectedRole === 'admin' ? 'Radhe Radios Headquarters' : 'Independent Client'),
        });
        handleAuthSuccess(userData, selectedRole);
      } catch (err) {
        setErrorMsg(err.message || 'Registration failed. Phone may already be registered.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleQuickDemo = async (roleType) => {
    setErrorMsg('');
    setSubmitting(true);
    try {
      const userData = await quickDemoLogin(roleType);
      handleAuthSuccess(userData, roleType);
    } catch (err) {
      setErrorMsg(err.message || 'Demo sign-in failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // If already authenticated and not currently viewing the family modal
  if (isAuthenticated && user && !showClientFamilyModal) {
    return (
      <div className="w-full min-h-[85vh] py-20 px-4 sm:px-6 md:px-10 flex items-center justify-center">
        <div className="max-w-xl w-full p-6 sm:p-10 rounded-3xl bg-zinc-950/90 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-center space-y-6">
          <img
            src="/radhe radios logo.svg"
            alt="Radhe Radios Logo"
            className="h-16 sm:h-20 w-auto mx-auto object-contain drop-shadow-[0_0_20px_rgba(0,229,255,0.6)]"
          />

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-400/40 text-cyan-200 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Signed In as {user.role}</span>
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black uppercase text-white">
              Welcome back, <span className="text-sonic-gradient">{user.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              Your Radhe Radios session is active. Choose your destination below:
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAdmin ? (
              <button
                type="button"
                onClick={() => navigate('/portal')}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-red-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Open Admin Dashboard
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/portal')}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-red-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Open Client Portal
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/auth');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/15 text-zinc-300 hover:text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[90vh] py-10 sm:py-20 px-3 sm:px-6 md:px-10 flex items-center justify-center relative overflow-hidden">
      {/* Ambient Celestial Glows in Logo Theme */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-radial from-cyan-500/15 via-red-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-lg">
        {/* Main Glass Card Form */}
        <div className="relative rounded-2xl sm:rounded-3xl bg-zinc-950/95 backdrop-blur-2xl border border-cyan-400/30 shadow-[0_24px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(0,229,255,0.15)] p-4 sm:p-9 text-white">
          
          {/* Brand Header & Prominent Logo */}
          <div className="text-center mb-6 space-y-3">
            <div className="flex justify-center">
              <img
                src="/radhe radios logo.svg"
                alt="Radhe Radios Logo"
                className="h-16 sm:h-20 w-auto object-contain drop-shadow-[0_0_20px_rgba(0,229,255,0.65)] hover:scale-105 transition-transform"
              />
            </div>

            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Radhe Radios <span className="text-sonic-gradient">Kota</span>
              </h1>
              <p className="text-xs text-zinc-400 font-normal mt-1">
                Heavy-Duty Power Amplifiers & Vehicle Sound Engineering • Estd. 2018
              </p>
            </div>
          </div>

          {/* Role Selector Tabs (Client vs Admin) */}
          <div className="mb-5 p-1 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('client');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'client'
                  ? 'bg-gradient-to-r from-cyan-500/30 to-cyan-500/10 text-cyan-200 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Client Access</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('admin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-gradient-to-r from-red-500/30 to-red-500/10 text-red-200 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-red-400" />
              <span>Admin Workshop</span>
            </button>
          </div>

          {/* Mode Switcher: Login vs Sign Up */}
          <div className="flex border-b border-white/10 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`pb-2.5 flex-1 text-center text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer border-b-2 ${
                mode === 'login'
                  ? 'border-cyan-400 text-white drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`pb-2.5 flex-1 text-center text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer border-b-2 ${
                mode === 'signup'
                  ? 'border-red-400 text-white drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Quick Demo Instant Logins */}
          <div className="mb-5 p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant 1-Click Role Access:</span>
              </span>
              <span className="text-[10px] text-cyan-300">No typing needed</span>
            </div>

            {selectedRole === 'client' ? (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('client')}
                  disabled={submitting}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-400/40 text-cyan-200 text-xs font-extrabold transition-all cursor-pointer shadow-sm active:scale-95 text-center"
                >
                  👤 VIP Client (Ananya)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('dealer')}
                  disabled={submitting}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 text-center"
                >
                  📻 Sound Dealer (Vikram)
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('super_admin')}
                    disabled={submitting}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-red-500/20 hover:from-amber-500/30 hover:to-red-500/30 border border-amber-400/50 text-amber-200 text-xs font-black transition-all cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.25)] active:scale-95 text-center"
                  >
                    👑 Super Admin (Rajesh Sharma)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('staff_admin')}
                    disabled={submitting}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-200 text-xs font-extrabold transition-all cursor-pointer shadow-sm active:scale-95 text-center"
                  >
                    🛡️ Approved Staff Admin
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('pending_admin')}
                  disabled={submitting}
                  className="w-full py-1 px-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-zinc-200 text-[11px] font-mono transition-all text-center"
                >
                  ⏳ Test Unapproved / Pending Staff Request
                </button>
              </div>
            )}
          </div>

          {/* Alerts / Error feedback */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-400/50 text-cyan-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Interactive Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase tracking-wide">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={selectedRole === 'admin' ? 'e.g. Rajesh Kumar (Workshop Admin)' : 'e.g. Ananya Sharma'}
                      className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl py-2.5 pl-10 pr-3 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase tracking-wide">
                    Mobile Phone (10 digits) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9887158522"
                      className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl py-2.5 pl-10 pr-3 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase tracking-wide">
                    City / Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Kota, Rajasthan"
                      className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl py-2.5 pl-10 pr-3 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            {mode === 'login' && (
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase tracking-wide">
                  Phone Number or Email *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={selectedRole === 'admin' ? 'admin@radheradios.com or 9887158522' : 'Enter mobile phone or email'}
                    className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl py-2.5 pl-10 pr-3 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase tracking-wide">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl py-2.5 pl-10 pr-10 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit CTA button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full mt-2 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer disabled:opacity-50 ${
                selectedRole === 'admin'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                  : 'bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-black shadow-[0_0_20px_rgba(0,229,255,0.4)]'
              }`}
            >
              {submitting ? (
                <span>Authenticating...</span>
              ) : mode === 'login' ? (
                selectedRole === 'admin' ? (
                  <>
                    <Wrench className="w-4 h-4" />
                    <span>Open Admin Workshop Panel</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    <span>Sign In to Radhe Radios</span>
                  </>
                )
              ) : selectedRole === 'admin' ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Register Workshop Admin Account</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Join Radhe Radios Family</span>
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center text-[11px] text-zinc-500">
            Transport Nagar, Kota (Rajasthan) • Direct Workshop Hotline: +91 98871 58522
          </div>
        </div>
      </div>

      {/* ── CLIENT CELEBRATION POPUP: "MEMBER OF RADHE RADIOS FAMILY" ── */}
      {showClientFamilyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-[#090a0f] border-2 border-cyan-400 shadow-[0_0_60px_rgba(0,229,255,0.45),0_20px_80px_rgba(0,0,0,0.95)] p-4 sm:p-9 text-center text-white overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Top Cyan & Crimson Aura Banner */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 via-sky-300 to-red-500" />
            
            {/* Ambient Background Radial Glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setShowClientFamilyModal(false);
                navigate('/portal');
              }}
              className="absolute top-4 right-4 p-2 rounded-full border border-white/15 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Brand Logo */}
            <div className="mb-4 flex justify-center">
              <img
                src="/radhe radios logo.svg"
                alt="Radhe Radios Logo"
                className="h-16 sm:h-20 w-auto object-contain drop-shadow-[0_0_24px_rgba(0,229,255,0.7)] animate-pulse"
              />
            </div>

            {/* Official Member Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,229,255,0.35)] text-cyan-200 text-xs font-mono font-black uppercase tracking-widest mb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>OFFICIAL RADHE RADIOS FAMILY MEMBER</span>
            </div>

            {/* Congratulatory Headline */}
            <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight leading-tight mb-2">
              Welcome to the <br />
              <span className="text-sonic-gradient">Radhe Radios Family!</span>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-md mx-auto mb-6">
              Congratulations, <strong className="text-white font-bold">{familyMemberData?.name || user?.name || 'Valued Member'}</strong>! You are now a proud and recognized member of the Radhe Radios Kota sound family.
            </p>

            {/* Membership Card Overview */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-cyan-400/30 text-left space-y-2.5 mb-6 shadow-inner">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                <span className="text-zinc-400 font-mono">Member ID:</span>
                <span className="font-mono font-bold text-cyan-300">
                  #RR-KOTA-{(familyMemberData?.phone || user?.phone || '2026').slice(-4)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                <span className="text-zinc-400 font-mono">Official Status:</span>
                <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Lifetime Member
                </span>
              </div>

              <div className="text-[11px] text-zinc-400 space-y-1 pt-1">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Direct manufacturer wholesale pricing on all amplifiers & cabinets</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Custom sound equalization tuning directly from our Kota master engineers</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowClientFamilyModal(false);
                  navigate('/portal');
                }}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Enter Client Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowClientFamilyModal(false);
                  navigate('/products');
                }}
                className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Explore Systems
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── PENDING ADMIN APPROVAL MODAL (SUPER ADMIN APPROVAL REQUIRED) ─── */}
      {showPendingAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#11131c] to-[#08080a] border-2 border-amber-500/50 p-4 sm:p-8 text-center shadow-[0_0_80px_rgba(245,158,11,0.25)] max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setShowPendingAdminModal(false);
                navigate('/portal');
              }}
              className="absolute top-4 right-4 p-2 rounded-full border border-white/15 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center mx-auto mb-4 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.3)]">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/70 border border-amber-400/50 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest mb-3">
              <span>ADMIN ACCESS PENDING APPROVAL</span>
            </div>

            <h2 className="font-display text-2xl font-black uppercase text-white tracking-wide mb-3">
              Super Admin Approval Required
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6 font-normal">
              Hello <strong className="text-white">{familyMemberData?.name || user?.name || 'Staff Member'}</strong>! Only <strong className="text-cyan-300">Super Admin Rajesh Sharma</strong> can decide and approve who manages the Radhe Radios website. Once Rajesh Bhai approves your staff account from his dashboard, full Admin access will unlock automatically.
            </p>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-2 mb-6 font-mono text-xs">
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-zinc-500">Applicant:</span>
                <span className="text-white font-bold">{familyMemberData?.name || user?.name}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-zinc-500">Master Authority:</span>
                <span className="text-amber-300 font-bold">Rajesh Sharma (Super Admin)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Temporary Access:</span>
                <span className="text-cyan-300 font-bold">Client Family Portal</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPendingAdminModal(false);
                  navigate('/portal');
                }}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all hover:scale-105 cursor-pointer shadow-md"
              >
                Enter Portal as Client
              </button>

              <a
                href="https://api.whatsapp.com/send?phone=919887158522&text=Hello%20Rajesh%20bhai,%20I%20have%20registered%20for%20staff%20admin%20access%20on%20Radhe%20Radios.%20Please%20approve%20my%20account%20from%20your%20Super%20Admin%20dashboard."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <span>Notify Super Admin</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
