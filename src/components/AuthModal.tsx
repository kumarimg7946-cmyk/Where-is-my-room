import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, UserType } from '../types';
import { INITIAL_USERS } from '../data/seedData';
import { 
  X, Mail, Lock, Phone, User as UserIcon, Building2, 
  Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, 
  Sparkles, ShieldCheck, KeyRound, Smartphone, LogIn, UserPlus,
  Copy, Check, Shield, GraduationCap, MapPin, ExternalLink
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup' | 'credentials';
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'credentials'>(initialTab);
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP form state
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState('7429');

  // Sign up form state
  const [signUpRole, setSignUpRole] = useState<UserType>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('Kota');
  const [collegeOrInstitute, setCollegeOrInstitute] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Feedback states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Synced users list in localStorage
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('wimr_users');
    let users: User[] = [];
    if (saved) {
      try {
        users = JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved users', e);
      }
    }
    // Merge INITIAL_USERS ensuring all test accounts & passwords are included
    const userMap = new Map<string, User>();
    INITIAL_USERS.forEach(u => userMap.set(u.email.toLowerCase(), u));
    users.forEach(u => {
      if (userMap.has(u.email.toLowerCase())) {
        const init = userMap.get(u.email.toLowerCase())!;
        userMap.set(u.email.toLowerCase(), { ...init, ...u, password: u.password || init.password || 'password123' });
      } else {
        userMap.set(u.email.toLowerCase(), u);
      }
    });
    return Array.from(userMap.values());
  });

  useEffect(() => {
    localStorage.setItem('wimr_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    setActiveTab(initialTab);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [initialTab, isOpen]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 1800);
  };

  const handleFillCredentials = (identifier: string, pass: string) => {
    setLoginIdentifier(identifier);
    setLoginPassword(pass);
    setLoginMode('password');
    setActiveTab('login');
    setSuccessMsg(`Loaded credentials for ${identifier}. Click "Sign In to Account" or press Enter.`);
  };

  if (!isOpen) return null;

  // Handler for Password Login
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const identifier = loginIdentifier.trim().toLowerCase();
    if (!identifier) {
      setErrorMsg('Please enter your email or mobile phone number.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Clean identifier
      const cleanPhone = identifier.replace(/[^0-9]/g, '');

      const foundUser = registeredUsers.find(u => {
        const emailMatch = u.email.toLowerCase() === identifier;
        const uPhoneDigits = u.phone.replace(/[^0-9]/g, '');
        const phoneMatch = cleanPhone.length >= 10 && uPhoneDigits.includes(cleanPhone.slice(-10));
        return emailMatch || phoneMatch;
      });

      if (!foundUser) {
        setErrorMsg('No account found with this email or phone number. Check details or sign up.');
        return;
      }

      // Check password (default fallback to 'password123')
      const userPassword = foundUser.password || 'password123';
      if (loginPassword !== userPassword && loginPassword !== 'password123' && loginPassword !== 'admin123') {
        setErrorMsg('Incorrect password. (Tip: Demo accounts password is password123)');
        return;
      }

      setSuccessMsg(`Welcome back, ${foundUser.name}! Logging you in...`);
      setTimeout(() => {
        onLoginSuccess(foundUser);
        onClose();
      }, 700);
    }, 600);
  };

  // Handler for Demo Quick Login
  const handleQuickDemoLogin = (user: User) => {
    setErrorMsg(null);
    setSuccessMsg(`Instant Demo Sign-in as ${user.name} (${user.user_type.toUpperCase()})...`);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(user);
      onClose();
    }, 500);
  };

  // Handler for OTP Send
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const clean = otpPhone.replace(/[^0-9]/g, '');
    if (clean.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    const genOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedOtp(genOtp);
    setOtpSent(true);
    setSuccessMsg(`OTP sent to +91 ${clean.slice(-10)}: Code is [ ${genOtp} ]`);
  };

  // Handler for OTP Verify
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (otpCode !== simulatedOtp && otpCode !== '1234') {
      setErrorMsg('Invalid OTP. Please enter the simulated code shown above.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const clean = otpPhone.replace(/[^0-9]/g, '');
      let user = registeredUsers.find(u => u.phone.replace(/[^0-9]/g, '').includes(clean.slice(-10)));

      if (!user) {
        // Create quick account for this mobile
        user = {
          id: Date.now(),
          name: `User ${clean.slice(-4)}`,
          email: `user${clean.slice(-4)}@wimr.in`,
          phone: `+91 ${clean.slice(-10)}`,
          user_type: 'student',
          created_at: new Date().toISOString()
        };
        setRegisteredUsers(prev => [user!, ...prev]);
      }

      setSuccessMsg(`Verified! Logging you in as ${user.name}...`);
      setTimeout(() => {
        onLoginSuccess(user!);
        onClose();
      }, 600);
    }, 500);
  };

  // Handler for Sign Up
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    const phoneClean = phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile phone number.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-check.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please agree to the Terms of Service & Privacy Policy.');
      return;
    }

    // Check existing email
    const existing = registeredUsers.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (existing) {
      setErrorMsg('An account with this email already exists. Please log in.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const newUser: User = {
        id: Date.now(),
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.startsWith('+91') ? phone.trim() : `+91 ${phoneClean.slice(-10)}`,
        user_type: signUpRole,
        password: newPassword,
        business_name: (signUpRole === 'owner' || signUpRole === 'retailer') ? (businessName.trim() || `${fullName}'s Stays`) : undefined,
        gst_number: gstNumber.trim() ? gstNumber.trim().toUpperCase() : undefined,
        city: city,
        college_or_institute: collegeOrInstitute.trim() || undefined,
        created_at: new Date().toISOString()
      };

      setRegisteredUsers(prev => [newUser, ...prev]);
      setSuccessMsg(`Account created successfully! Welcome to Where is my room, ${newUser.name}.`);

      setTimeout(() => {
        onLoginSuccess(newUser);
        onClose();
      }, 700);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
      >
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-900 text-white p-5 relative">
          <button
            onClick={onClose}
            id="auth-modal-close-btn"
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-1.5">
            <img
              src="/app-logo.png"
              alt="Where is my room Logo"
              className="w-10 h-10 rounded-xl object-cover shadow-sm border border-white/30 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-lg font-bold tracking-tight">Where is my room</h2>
              <p className="text-xs text-indigo-200">Pan-India Verified Student & PG Network</p>
            </div>
          </div>

          <p className="text-xs text-indigo-100 mt-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Connect directly with verified owners & students across 300+ cities</span>
          </p>

          {/* Tab Switcher */}
          <div className="grid grid-cols-3 bg-indigo-950/40 p-1 rounded-xl mt-4 text-xs font-bold border border-indigo-500/20">
            <button
              id="auth-tab-login"
              onClick={() => { setActiveTab('login'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
            <button
              id="auth-tab-signup"
              onClick={() => { setActiveTab('signup'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
            <button
              id="auth-tab-credentials"
              onClick={() => { setActiveTab('credentials'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'credentials'
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-amber-200 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Login Details</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          {/* Notifications */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ======================= TAB: LOGIN ======================= */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              {/* Login Helper Notice */}
              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Need test accounts? <strong className="font-semibold">Demo credentials</strong> are available.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => { setActiveTab('credentials'); setErrorMsg(null); setSuccessMsg(null); }}
                  className="px-2 py-0.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors shrink-0 cursor-pointer"
                >
                  View Details
                </button>
              </div>

              {/* Login Mode Toggle: Password vs OTP */}
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Choose Login Method:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setLoginMode('password'); setErrorMsg(null); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      loginMode === 'password'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginMode('otp'); setErrorMsg(null); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      loginMode === 'otp'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Mobile OTP
                  </button>
                </div>
              </div>

              {loginMode === 'password' ? (
                <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email or Mobile Phone
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="login-identifier-input"
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="e.g. aman.student@iitd.ac.in or 9829012345"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginPassword('password123');
                          setErrorMsg(null);
                          setSuccessMsg('Filled demo password: password123');
                        }}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="login-password-input"
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your account password"
                        className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Stay signed in</span>
                    </label>
                    <span className="text-[11px] text-slate-400">256-bit SSL Protected</span>
                  </div>

                  <button
                    id="submit-login-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Sign In to Account</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Mobile OTP Mode */
                <div className="space-y-3.5">
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Mobile Number
                        </label>
                        <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                          <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-bold border-r border-slate-200 flex items-center">
                            🇮🇳 +91
                          </span>
                          <input
                            id="otp-phone-input"
                            type="tel"
                            maxLength={10}
                            value={otpPhone}
                            onChange={(e) => setOtpPhone(e.target.value)}
                            placeholder="Enter 10-digit mobile"
                            className="w-full px-3 py-2 text-xs focus:outline-none"
                            autoFocus
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Send Login OTP</span>
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-700">
                            Enter 4-digit OTP code
                          </label>
                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="text-[11px] text-indigo-600 underline"
                          >
                            Change number
                          </button>
                        </div>
                        <input
                          id="otp-code-input"
                          type="text"
                          maxLength={4}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder={`Enter code (simulated: ${simulatedOtp})`}
                          className="w-full text-center tracking-widest font-mono text-base font-bold py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          autoFocus
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify & Sign In</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Instant One-Click Demo Logins */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-indigo-600" />
                    One-Click Quick Sign In
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('credentials')}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    View All Passwords →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {registeredUsers.slice(0, 6).map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleQuickDemoLogin(user)}
                      className="p-2 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/50 text-left transition-all flex items-center gap-2 group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 group-hover:bg-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-900">
                          {user.name}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <span className={`px-1 py-0.2 rounded text-[9px] font-semibold ${
                            user.user_type === 'student' ? 'bg-sky-100 text-sky-800' : 
                            user.user_type === 'admin' ? 'bg-purple-100 text-purple-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {user.user_type}
                          </span>
                          <span className="text-[9px] text-slate-400">pwd: {user.password || 'password123'}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB: APP LOGIN DETAILS ======================= */}
          {activeTab === 'credentials' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200/80">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Pre-Configured App Login Details</h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                      Use any of the verified accounts below to test student features, hostel owner dashboards, or moderator controls. Click <strong>Autofill Form</strong> or <strong>Sign In</strong> for instant access.
                    </p>
                  </div>
                </div>
              </div>

              {/* Persona Cards */}
              <div className="space-y-2.5">
                {registeredUsers.map((user) => {
                  const userPass = user.password || (user.user_type === 'admin' ? 'admin123' : 'password123');
                  const isSanjay = user.email.toLowerCase().includes('sanjay');
                  
                  return (
                    <div 
                      key={user.id} 
                      className={`p-3 rounded-xl border transition-all ${
                        isSanjay 
                          ? 'border-indigo-400 bg-indigo-50/40 ring-1 ring-indigo-200'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[11px] ${
                            user.user_type === 'student' ? 'bg-sky-600 text-white' :
                            user.user_type === 'admin' ? 'bg-purple-600 text-white' :
                            'bg-emerald-600 text-white'
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              {user.name}
                              {isSanjay && (
                                <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-bold">
                                  Your Account
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {user.business_name || user.college_or_institute || (user.city ? `Active in ${user.city}` : 'Platform User')}
                            </span>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          user.user_type === 'student' ? 'bg-sky-100 text-sky-800' :
                          user.user_type === 'admin' ? 'bg-purple-100 text-purple-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {user.user_type === 'student' ? '🎓 Student' : user.user_type === 'admin' ? '🛡️ Admin' : '🏢 PG Owner'}
                        </span>
                      </div>

                      {/* Credentials rows */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <div className="truncate pr-1">
                            <div className="text-[10px] text-slate-400 font-semibold uppercase">Email</div>
                            <div className="text-xs font-mono font-medium text-slate-800 truncate" title={user.email}>
                              {user.email}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(user.email, `email-${user.id}`)}
                            className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
                            title="Copy Email"
                          >
                            {copiedKey === `email-${user.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <div className="truncate pr-1">
                            <div className="text-[10px] text-slate-400 font-semibold uppercase">Password</div>
                            <div className="text-xs font-mono font-bold text-indigo-700 truncate">
                              {userPass}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(userPass, `pwd-${user.id}`)}
                            className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
                            title="Copy Password"
                          >
                            {copiedKey === `pwd-${user.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleFillCredentials(user.email, userPass)}
                          className="flex-1 py-1.5 px-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/50 text-indigo-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Autofill Form</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickDemoLogin(user)}
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Instant Sign In</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Mobile OTP Simulation Details */}
                <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      Mobile OTP Login Details
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      Passwordless
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                    Enter any 10-digit mobile number (e.g. <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">9829012345</code> or <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">9829099887</code>). The system auto-generates a 4-digit OTP directly on screen or accepts bypass code <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">1234</code>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('otp');
                      setOtpPhone('9829012345');
                      setActiveTab('login');
                    }}
                    className="w-full py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Try Mobile OTP Flow</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB: SIGN UP ======================= */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  I am joining as:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignUpRole('student')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      signUpRole === 'student'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-800 font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">🎓 Student</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Find rooms & PGs</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignUpRole('owner')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      signUpRole === 'owner'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-800 font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">🏢 Owner / PG</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">List properties</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignUpRole('retailer')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      signUpRole === 'retailer'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-800 font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">🛋️ Lounge / Co-op</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Study spaces</div>
                  </button>
                </div>
              </div>

              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="signup-name-input"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="signup-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Phone & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="signup-phone-input"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary City *
                  </label>
                  <select
                    id="signup-city-select"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Kota">Kota (Rajasthan)</option>
                    <option value="Jaipur">Jaipur (Rajasthan)</option>
                    <option value="Delhi">Delhi (NCR)</option>
                    <option value="Pune">Pune (Maharashtra)</option>
                    <option value="Bengaluru">Bengaluru (Karnataka)</option>
                    <option value="Hyderabad">Hyderabad (Telangana)</option>
                    <option value="Mumbai">Mumbai (Maharashtra)</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Indore">Indore (Madhya Pradesh)</option>
                    <option value="Patna">Patna (Bihar)</option>
                    <option value="Kolkata">Kolkata (West Bengal)</option>
                    <option value="Lucknow">Lucknow (Uttar Pradesh)</option>
                  </select>
                </div>
              </div>

              {/* Role specific inputs */}
              {signUpRole === 'student' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    College / Coaching Institute (Optional)
                  </label>
                  <input
                    type="text"
                    value={collegeOrInstitute}
                    onChange={(e) => setCollegeOrInstitute(e.target.value)}
                    placeholder="e.g. Allen Career Institute, Resonance, IIT Delhi, DU"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Business / PG Brand Name *
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Royal Star Boys PG"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      GST / Registration ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="e.g. 08AABCR1234F1Z5"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white uppercase"
                    />
                  </div>
                </div>
              )}

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Create Password (min 6 chars) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="signup-password-input"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="signup-confirm-password-input"
                      type={showNewPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="text-xs text-slate-600 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agree-terms-checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                />
                <label htmlFor="agree-terms-checkbox" className="leading-snug cursor-pointer select-none">
                  I agree to the <span className="text-indigo-600 font-semibold">Terms of Service</span> and <span className="text-indigo-600 font-semibold">Student Safety Guidelines</span> of Where is my room.
                </label>
              </div>

              {/* Submit Button */}
              <button
                id="submit-signup-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create My {signUpRole === 'student' ? 'Student' : 'Owner'} Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Bottom Switch Tab prompt */}
          <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100">
            {activeTab === 'login' ? (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setErrorMsg(null); setSuccessMsg(null); }}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already registered with Where is my room?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setErrorMsg(null); setSuccessMsg(null); }}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
