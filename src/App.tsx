import React, { useState, useEffect } from 'react';
import { Property, PropertyType, User, Review, UserType, PaymentRecord, ScheduledVisit } from './types';
import { 
  INITIAL_PROPERTIES, 
  INITIAL_USERS, 
  INITIAL_REVIEWS, 
  INITIAL_PAYMENTS, 
  INITIAL_SCHEDULED_VISITS 
} from './data/seedData';
import { HomeScreen } from './components/HomeScreen';
import { SearchScreen } from './components/SearchScreen';
import { FavouritesScreen } from './components/FavouritesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { PostPropertyScreen } from './components/PostPropertyScreen';
import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ArchitectureViewer } from './components/ArchitectureViewer';
import { AuthModal } from './components/AuthModal';
import { PlayStoreExportModal } from './components/PlayStoreExportModal';
import { 
  Smartphone, ShieldCheck, Terminal, Heart, Home, 
  Search as SearchIcon, User as UserIcon, PlusCircle, 
  Monitor, Layers, Sparkles, LogIn, LogOut, UserPlus, KeyRound
} from 'lucide-react';

export default function App() {
  // Persistence state: Properties with verified Google seed data merged
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('srf_properties');
    let propList: Property[] = [];
    if (saved) {
      try {
        propList = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const propMap = new Map<number, Property>();
    INITIAL_PROPERTIES.forEach(p => propMap.set(p.id, p));
    propList.forEach(p => {
      propMap.set(p.id, { ...(propMap.get(p.id) || {}), ...p });
    });
    return Array.from(propMap.values());
  });

  // Users state with initial credentials merged
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('wimr_users');
    let userList: User[] = [];
    if (saved) {
      try {
        userList = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const userMap = new Map<string, User>();
    INITIAL_USERS.forEach(u => userMap.set(u.email.toLowerCase(), u));
    userList.forEach(u => {
      if (userMap.has(u.email.toLowerCase())) {
        const init = userMap.get(u.email.toLowerCase())!;
        userMap.set(u.email.toLowerCase(), { ...init, ...u, password: u.password || init.password || 'password123' });
      } else {
        userMap.set(u.email.toLowerCase(), u);
      }
    });
    return Array.from(userMap.values());
  });

  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('srf_favorites');
    return saved ? JSON.parse(saved) : [101, 104];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('srf_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Scheduled Visits state
  const [scheduledVisits, setScheduledVisits] = useState<ScheduledVisit[]>(() => {
    const saved = localStorage.getItem('srf_scheduled_visits');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULED_VISITS;
  });

  // Payments / Transactions state (₹100 retailer fees & booking tokens)
  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('srf_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  // Current authenticated user (or null if guest/logged out)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('wimr_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default to Aman Gupta (student) for instant demo experience
    return INITIAL_USERS[2];
  });

  // Auth modal control
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  
  // Play Store & APK Export Modal control
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState(false);
  
  // Navigation modes
  const [portalMode, setPortalMode] = useState<'mobile_app' | 'admin_portal' | 'backend_api'>('mobile_app');
  const [mobileTab, setMobileTab] = useState<'home' | 'search' | 'saved' | 'profile' | 'post'>('home');
  const [deviceFrame, setDeviceFrame] = useState<'phone' | 'full'>('full');

  // Search & filter state passed between screens
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState<PropertyType | 'All'>('All');

  // Modal detail view
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('srf_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('wimr_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('srf_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('srf_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('srf_scheduled_visits', JSON.stringify(scheduledVisits));
  }, [scheduledVisits]);

  useEffect(() => {
    localStorage.setItem('srf_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('wimr_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('wimr_current_user');
    }
  }, [currentUser]);

  // Auth Handlers
  const handleOpenLogin = () => {
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenSignUp = () => {
    setAuthModalTab('signup');
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setUsers(prev => {
      const exists = prev.some(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
      if (exists) {
        return prev.map(u => (u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase()) ? user : u);
      }
      return [user, ...prev];
    });
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // Direct User Management Handlers for Admin
  const handleAddUser = (newUserData: Omit<User, 'id' | 'created_at'>) => {
    const newId = Math.max(...users.map(u => u.id), 10) + 1;
    const newUser: User = {
      ...newUserData,
      id: newId,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const handleUpdateUserDirect = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(null);
    }
  };

  // Property & interaction handlers
  const handleToggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectCity = (city: string) => {
    setSearchCity(city);
    setSearchQuery('');
    setMobileTab('search');
  };

  const handleSelectType = (type: PropertyType | 'All') => {
    setSearchType(type);
    setMobileTab('search');
  };

  const handleNavigateToSearch = (query?: string) => {
    if (query !== undefined) setSearchQuery(query);
    setMobileTab('search');
  };

  const handleAddProperty = (newProp: Omit<Property, 'id' | 'created_at'>) => {
    const newId = Math.max(...properties.map(p => p.id), 100) + 1;
    const propertyRecord: Property = {
      ...newProp,
      id: newId,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    setProperties(prev => [propertyRecord, ...prev]);
  };

  const handleUpdateProperty = (updated: Property) => {
    setProperties(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleAddReview = (propertyId: number, rating: number, comment: string) => {
    const newRev: Review = {
      id: Date.now(),
      property_id: propertyId,
      user_id: currentUser ? currentUser.id : 999,
      user_name: currentUser ? currentUser.name : "Verified Student",
      rating,
      review: comment,
      created_at: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newRev, ...prev]);

    // Recalculate rating on property
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        const propReviews = [...reviews.filter(r => r.property_id === propertyId), newRev];
        const avg = propReviews.reduce((acc, r) => acc + r.rating, 0) / propReviews.length;
        return {
          ...p,
          rating: Number(avg.toFixed(1)),
          review_count: propReviews.length
        };
      }
      return p;
    }));
  };

  const handleDeleteReview = (reviewId: number) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const handleScheduleVisit = (
    prop: Property, 
    date: string, 
    time: string, 
    studentName: string, 
    studentPhone: string
  ) => {
    const newVisit: ScheduledVisit = {
      id: Date.now(),
      property_id: prop.id,
      property_title: prop.title,
      propertyTitle: prop.title,
      city: prop.city,
      date,
      time,
      student_name: studentName || (currentUser ? currentUser.name : "Student Aspirant"),
      student_phone: studentPhone || (currentUser ? currentUser.phone : "+91 97112 34567"),
      status: "Confirmed",
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      notes: "Scheduled via Applet Visit Booking"
    };
    setScheduledVisits(prev => [newVisit, ...prev]);
  };

  // Visit Management Handlers for Admin
  const handleAddVisit = (newVisitData: Omit<ScheduledVisit, 'id' | 'created_at'>) => {
    const newVisit: ScheduledVisit = {
      ...newVisitData,
      id: Date.now(),
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    setScheduledVisits(prev => [newVisit, ...prev]);
  };

  const handleUpdateVisitStatus = (visitId: string | number, status: ScheduledVisit['status']) => {
    setScheduledVisits(prev => prev.map(v => v.id === visitId ? { ...v, status } : v));
  };

  const handleDeleteVisit = (visitId: string | number) => {
    setScheduledVisits(prev => prev.filter(v => v.id !== visitId));
  };

  // Payment Handlers
  const handleAddPayment = (newPayment: PaymentRecord) => {
    setPayments(prev => [newPayment, ...prev]);
  };

  const handleDeletePayment = (paymentId: string) => {
    setPayments(prev => prev.filter(p => p.id !== paymentId));
  };

  // Admin moderation handlers
  const handleToggleVerify = (id: number) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, verified: !p.verified };
      }
      return p;
    }));
  };

  const handleToggleAvailability = (id: number) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, available: !p.available };
      }
      return p;
    }));
  };

  const handleDeleteProperty = (id: number) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  // Full Database Backup & Restore Handlers
  const handleRestoreAllData = (data: {
    properties?: Property[];
    users?: User[];
    scheduledVisits?: ScheduledVisit[];
    payments?: PaymentRecord[];
    reviews?: Review[];
  }) => {
    if (data.properties && Array.isArray(data.properties)) setProperties(data.properties);
    if (data.users && Array.isArray(data.users)) setUsers(data.users);
    if (data.scheduledVisits && Array.isArray(data.scheduledVisits)) setScheduledVisits(data.scheduledVisits);
    if (data.payments && Array.isArray(data.payments)) setPayments(data.payments);
    if (data.reviews && Array.isArray(data.reviews)) setReviews(data.reviews);
  };

  const handleResetAllData = () => {
    setProperties(INITIAL_PROPERTIES);
    setUsers(INITIAL_USERS);
    setScheduledVisits(INITIAL_SCHEDULED_VISITS);
    setPayments(INITIAL_PAYMENTS);
    setReviews(INITIAL_REVIEWS);
    localStorage.removeItem('srf_properties');
    localStorage.removeItem('wimr_users');
    localStorage.removeItem('srf_scheduled_visits');
    localStorage.removeItem('srf_payments');
    localStorage.removeItem('srf_reviews');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Application Switcher Bar */}
      <header className="bg-indigo-950 text-white border-b border-indigo-900/60 px-4 py-2.5 sticky top-0 z-40 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <img 
            src="/app-logo.png" 
            alt="Where is my room Logo" 
            className="w-8 h-8 rounded-lg object-cover shadow-xs border border-indigo-400/30 shrink-0" 
            referrerPolicy="no-referrer" 
          />
          <div>
            <div className="font-bold text-sm tracking-tight flex items-center gap-1.5">
              Where is my room
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-800 text-indigo-200 font-normal">
                India
              </span>
            </div>
            <div className="text-[10px] text-indigo-300">
              State Capitals &bull; Major Student Cities &bull; Live Auth
            </div>
          </div>
        </div>

        {/* Portal Mode Selector (Mobile App vs Admin vs Architecture) */}
        <div className="flex items-center bg-indigo-900/90 p-1 rounded-xl border border-indigo-800 text-xs">
          <button
            id="nav-mobile-app-btn"
            onClick={() => setPortalMode('mobile_app')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              portalMode === 'mobile_app'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Student Mobile App</span>
          </button>

          <button
            id="nav-admin-portal-btn"
            onClick={() => setPortalMode('admin_portal')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              portalMode === 'admin_portal'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Next.js Admin</span>
          </button>

          <button
            id="nav-backend-api-btn"
            onClick={() => setPortalMode('backend_api')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              portalMode === 'backend_api'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Backend & DB</span>
          </button>

          <button
            id="nav-playstore-hub-btn"
            onClick={() => setIsPlayStoreModalOpen(true)}
            className="px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xs ml-1"
            title="Generate APK / Android App Bundle (.aab) for Google Play Store"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span className="hidden sm:inline">Play Store & APK</span>
            <span className="sm:hidden">APK</span>
          </button>
        </div>

        {/* Right Section: Auth State & Device Frame */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <button
                id="topbar-user-profile-btn"
                onClick={() => {
                  setMobileTab('profile');
                  setPortalMode('mobile_app');
                }}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-indigo-900/80 hover:bg-indigo-800/90 border border-indigo-700/60 text-xs font-semibold text-white transition-colors"
                title="View Profile & Settings"
              >
                <div className="w-5 h-5 rounded-md bg-indigo-500 text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="max-w-[85px] sm:max-w-[120px] truncate">{currentUser.name.split(' ')[0]}</span>
                <span className="text-[10px] font-bold text-indigo-300 uppercase hidden sm:inline">
                  ({currentUser.user_type})
                </span>
              </button>
              <button
                id="topbar-signout-btn"
                onClick={handleLogout}
                className="p-1.5 rounded-lg bg-indigo-900/50 hover:bg-rose-900/50 text-indigo-300 hover:text-rose-200 border border-indigo-800 text-xs transition-colors"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                id="topbar-login-btn"
                onClick={handleOpenLogin}
                className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
              <button
                id="topbar-signup-btn"
                onClick={handleOpenSignUp}
                className="px-2.5 py-1 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 hover:text-white border border-indigo-700 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Up</span>
              </button>
            </div>
          )}

          {/* Mobile Viewport Toggle (Phone Frame vs Full Screen) */}
          {portalMode === 'mobile_app' && (
            <div className="hidden sm:flex items-center bg-indigo-900/60 p-1 rounded-xl border border-indigo-800 text-xs">
              <button
                onClick={() => setDeviceFrame('phone')}
                title="View in Mobile Phone Frame"
                className={`p-1.5 rounded-lg transition-colors ${
                  deviceFrame === 'phone' ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceFrame('full')}
                title="View in Full Responsive Width"
                className={`p-1.5 rounded-lg transition-colors ${
                  deviceFrame === 'full' ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:text-white'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex justify-center">
        {portalMode === 'admin_portal' ? (
          <div className="w-full">
            <AdminDashboard
              properties={properties}
              onUpdateProperty={handleUpdateProperty}
              onAddProperty={handleAddProperty}
              onToggleVerify={handleToggleVerify}
              onToggleAvailability={handleToggleAvailability}
              onDeleteProperty={handleDeleteProperty}
              onSelectProperty={(prop) => setSelectedProperty(prop)}
              users={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUserDirect}
              onDeleteUser={handleDeleteUser}
              scheduledVisits={scheduledVisits}
              onAddVisit={handleAddVisit}
              onUpdateVisitStatus={handleUpdateVisitStatus}
              onDeleteVisit={handleDeleteVisit}
              payments={payments}
              onAddPayment={handleAddPayment}
              onDeletePayment={handleDeletePayment}
              reviews={reviews}
              onDeleteReview={handleDeleteReview}
              onRestoreAllData={handleRestoreAllData}
              onResetAllData={handleResetAllData}
              onOpenPlayStoreHub={() => setIsPlayStoreModalOpen(true)}
            />
          </div>
        ) : portalMode === 'backend_api' ? (
          <div className="w-full">
            <ArchitectureViewer />
          </div>
        ) : (
          /* Mobile App View (Flutter Layout emulation) */
          <div className={`w-full transition-all duration-300 ${
            deviceFrame === 'phone' 
              ? 'max-w-[430px] my-6 rounded-[36px] overflow-hidden border-[8px] border-slate-900 shadow-2xl bg-white' 
              : 'max-w-4xl w-full'
          }`}>
            <div className="relative bg-slate-50 min-h-[700px] flex flex-col justify-between">
              {/* Screen Rendering Based on Tab */}
              <div className="flex-1">
                {mobileTab === 'home' && (
                  <HomeScreen
                    properties={properties}
                    selectedType={searchType}
                    onSelectType={handleSelectType}
                    onSelectCity={handleSelectCity}
                    onSelectProperty={(prop) => setSelectedProperty(prop)}
                    onNavigateToSearch={handleNavigateToSearch}
                    onNavigateToFavourites={() => setMobileTab('saved')}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    currentUser={currentUser}
                    onOpenLogin={handleOpenLogin}
                    onOpenSignUp={handleOpenSignUp}
                    onNavigateToProfile={() => setMobileTab('profile')}
                    onOpenPlayStoreHub={() => setIsPlayStoreModalOpen(true)}
                  />
                )}

                {mobileTab === 'search' && (
                  <SearchScreen
                    properties={properties}
                    onSelectProperty={(prop) => setSelectedProperty(prop)}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    initialCity={searchCity}
                    initialType={searchType}
                    initialSearchQuery={searchQuery}
                  />
                )}

                {mobileTab === 'saved' && (
                  <FavouritesScreen
                    properties={properties}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectProperty={(prop) => setSelectedProperty(prop)}
                    onExplore={() => setMobileTab('home')}
                  />
                )}

                {mobileTab === 'profile' && (
                  <ProfileScreen
                    currentUser={currentUser}
                    onUpdateUserType={(type) => {
                      if (currentUser) {
                        handleUpdateUser({ ...currentUser, user_type: type });
                      }
                    }}
                    onUpdateUser={handleUpdateUser}
                    onOpenLogin={handleOpenLogin}
                    onOpenSignUp={handleOpenSignUp}
                    onLogout={handleLogout}
                    properties={properties}
                    favoritesCount={favorites.length}
                    scheduledVisits={scheduledVisits}
                    onNavigateToPostProperty={() => setMobileTab('post')}
                    onNavigateToSaved={() => setMobileTab('saved')}
                    onSelectProperty={(prop) => setSelectedProperty(prop)}
                    onOpenPlayStoreHub={() => setIsPlayStoreModalOpen(true)}
                  />
                )}

                {mobileTab === 'post' && (
                  <PostPropertyScreen
                    onAddProperty={handleAddProperty}
                    onSuccess={() => setMobileTab('home')}
                    currentUser={currentUser}
                    onOpenLogin={handleOpenLogin}
                  />
                )}
              </div>

              {/* Bottom Navigation Bar - Exactly Matching Flutter NavigationBar */}
              <nav 
                id="flutter-bottom-navigation-bar" 
                className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex items-center justify-around shadow-lg"
              >
                <button
                  id="tab-home"
                  onClick={() => setMobileTab('home')}
                  className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                    mobileTab === 'home'
                      ? 'text-indigo-600 font-bold'
                      : 'text-slate-500 hover:text-slate-900 font-medium'
                  }`}
                >
                  <Home className={`w-5 h-5 ${mobileTab === 'home' ? 'stroke-[2.5px]' : ''}`} />
                  <span className="text-[11px] mt-0.5">Explore</span>
                </button>

                <button
                  id="tab-search"
                  onClick={() => setMobileTab('search')}
                  className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                    mobileTab === 'search'
                      ? 'text-indigo-600 font-bold'
                      : 'text-slate-500 hover:text-slate-900 font-medium'
                  }`}
                >
                  <SearchIcon className={`w-5 h-5 ${mobileTab === 'search' ? 'stroke-[2.5px]' : ''}`} />
                  <span className="text-[11px] mt-0.5">Search</span>
                </button>

                <button
                  id="tab-post"
                  onClick={() => setMobileTab('post')}
                  className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                    mobileTab === 'post'
                      ? 'text-indigo-600 font-bold'
                      : 'text-slate-500 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md -mt-3 mb-0.5 hover:bg-indigo-700 transition-colors">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <span className="text-[11px]">List Room</span>
                </button>

                <button
                  id="tab-saved"
                  onClick={() => setMobileTab('saved')}
                  className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                    mobileTab === 'saved'
                      ? 'text-indigo-600 font-bold'
                      : 'text-slate-500 hover:text-slate-900 font-medium'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${mobileTab === 'saved' ? 'stroke-[2.5px] fill-indigo-600' : ''}`} />
                  {favorites.length > 0 && (
                    <span className="absolute top-1 right-3 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                  <span className="text-[11px] mt-0.5">Saved</span>
                </button>

                <button
                  id="tab-profile"
                  onClick={() => setMobileTab('profile')}
                  className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                    mobileTab === 'profile'
                      ? 'text-indigo-600 font-bold'
                      : 'text-slate-500 hover:text-slate-900 font-medium'
                  }`}
                >
                  <UserIcon className={`w-5 h-5 ${mobileTab === 'profile' ? 'stroke-[2.5px]' : ''}`} />
                  <span className="text-[11px] mt-0.5">Profile</span>
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Property Details Modal Popup */}
      <PropertyDetailsModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        isFavorite={selectedProperty ? favorites.includes(selectedProperty.id) : false}
        onToggleFavorite={handleToggleFavorite}
        reviews={reviews}
        onAddReview={handleAddReview}
        onScheduleVisit={handleScheduleVisit}
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin}
        onAddPayment={handleAddPayment}
      />

      {/* Login & Sign-Up Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Google Play Store & APK Generation Hub Modal */}
      <PlayStoreExportModal
        isOpen={isPlayStoreModalOpen}
        onClose={() => setIsPlayStoreModalOpen(false)}
      />
    </div>
  );
}
