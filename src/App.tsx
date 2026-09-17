import React, { useState, useEffect } from 'react';
import { Property, PropertyType, User, Review } from './types';
import { INITIAL_PROPERTIES, INITIAL_USERS, INITIAL_REVIEWS } from './data/seedData';
import { HomeScreen } from './components/HomeScreen';
import { SearchScreen } from './components/SearchScreen';
import { FavouritesScreen } from './components/FavouritesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { PostPropertyScreen } from './components/PostPropertyScreen';
import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ArchitectureViewer } from './components/ArchitectureViewer';
import { 
  Smartphone, ShieldCheck, Terminal, Heart, Home, 
  Search as SearchIcon, User as UserIcon, PlusCircle, 
  Monitor, Layers, Sparkles
} from 'lucide-react';

export default function App() {
  // Persistence state
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('srf_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('srf_favorites');
    return saved ? JSON.parse(saved) : [101, 104];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('srf_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [scheduledVisits, setScheduledVisits] = useState<Array<{
    propertyTitle: string;
    city: string;
    date: string;
    time: string;
  }>>(() => {
    const saved = localStorage.getItem('srf_scheduled_visits');
    return saved ? JSON.parse(saved) : [
      {
        propertyTitle: "Allen Coaching Hub Boys PG with Study Desk",
        city: "Kota",
        date: "2026-03-02",
        time: "11:00 AM"
      }
    ];
  });

  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[2]); // Aman Gupta (student)
  
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
    localStorage.setItem('srf_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('srf_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('srf_scheduled_visits', JSON.stringify(scheduledVisits));
  }, [scheduledVisits]);

  // Handlers
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

  const handleAddReview = (propertyId: number, rating: number, comment: string) => {
    const newRev: Review = {
      id: Date.now(),
      property_id: propertyId,
      user_id: currentUser.id,
      user_name: currentUser.name,
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

  const handleScheduleVisit = (
    prop: Property, 
    date: string, 
    time: string, 
    _studentName: string, 
    _studentPhone: string
  ) => {
    const newVisit = {
      propertyTitle: prop.title,
      city: prop.city,
      date,
      time
    };
    setScheduledVisits(prev => [newVisit, ...prev]);
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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Application Switcher Bar */}
      <header className="bg-indigo-950 text-white border-b border-indigo-900/60 px-4 py-2.5 sticky top-0 z-40 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white shadow-xs text-xs tracking-tight">
            WIMR
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight flex items-center gap-1.5">
              Where is my room
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-800 text-indigo-200 font-normal">
                India
              </span>
            </div>
            <div className="text-[10px] text-indigo-300">
              State Capitals &bull; Major Student Cities
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
        </div>

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
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex justify-center">
        {portalMode === 'admin_portal' ? (
          <div className="w-full">
            <AdminDashboard
              properties={properties}
              onToggleVerify={handleToggleVerify}
              onToggleAvailability={handleToggleAvailability}
              onDeleteProperty={handleDeleteProperty}
              onSelectProperty={(prop) => setSelectedProperty(prop)}
            />
          </div>
        ) : portalMode === 'backend_api' ? (
          <div className="w-full">
            <ArchitectureViewer
              properties={properties}
              users={INITIAL_USERS}
              reviews={reviews}
            />
          </div>
        ) : (
          /* Student Mobile App View (Flutter Experience) */
          <div className={`w-full ${deviceFrame === 'phone' ? 'max-w-sm my-6 rounded-[38px] border-8 border-slate-900 shadow-2xl overflow-hidden bg-slate-900' : 'max-w-4xl'}`}>
            {/* Phone Frame Status Bar */}
            {deviceFrame === 'phone' && (
              <div className="bg-indigo-700 text-white px-5 pt-2 pb-1 flex items-center justify-between text-[11px] font-semibold select-none">
                <span>9:41</span>
                <div className="w-16 h-4 bg-slate-900 rounded-full mx-auto" />
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>
            )}

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
                    onUpdateUserType={(type) => setCurrentUser(prev => ({ ...prev, user_type: type }))}
                    properties={properties}
                    favoritesCount={favorites.length}
                    scheduledVisits={scheduledVisits}
                    onNavigateToPostProperty={() => setMobileTab('post')}
                    onNavigateToSaved={() => setMobileTab('saved')}
                    onSelectProperty={(prop) => setSelectedProperty(prop)}
                  />
                )}

                {mobileTab === 'post' && (
                  <PostPropertyScreen
                    onAddProperty={handleAddProperty}
                    onSuccess={() => setMobileTab('home')}
                  />
                )}
              </div>

              {/* Bottom Navigation Bar - Exactly Matching Flutter NavigationBar */}
              <nav 
                id="flutter-bottom-navigation-bar" 
                className="fixed sm:sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg"
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
                  <span className="text-[11px] mt-0.5">Home</span>
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
                  <PlusCircle className={`w-5 h-5 ${mobileTab === 'post' ? 'stroke-[2.5px]' : ''}`} />
                  <span className="text-[11px] mt-0.5">List Room</span>
                </button>

                <button
                  id="tab-saved"
                  onClick={() => setMobileTab('saved')}
                  className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                    mobileTab === 'saved'
                      ? 'text-indigo-600 font-bold'
                      : 'text-slate-500 hover:text-slate-900 font-medium'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${mobileTab === 'saved' ? 'fill-indigo-600 stroke-indigo-600' : ''}`} />
                  <span className="text-[11px] mt-0.5">Saved</span>
                  {favorites.length > 0 && (
                    <span className="absolute top-0 right-3 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
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
      />
    </div>
  );
}
