import React, { useState } from 'react';
import { Property, PropertyType, User } from '../types';
import { 
  Search, Heart, MapPin, Building2, ShieldCheck, 
  Sparkles, Wifi, Utensils, Wind, ChevronRight,
  TrendingUp, Award, CheckCircle2, Hotel, BedDouble,
  BookOpen, Layers, Home, Landmark, Compass, LogIn, User as UserIcon
} from 'lucide-react';
import { INDIAN_STATES_DATA, getAllIndianStates } from '../data/indianCities';
import { PWAInstallButton } from './PWAInstallButton';

interface HomeScreenProps {
  properties: Property[];
  selectedType: PropertyType | 'All';
  onSelectType: (type: PropertyType | 'All') => void;
  onSelectCity: (city: string) => void;
  onSelectProperty: (property: Property) => void;
  onNavigateToSearch: (searchTerm?: string) => void;
  onNavigateToFavourites: () => void;
  onNavigateToRetailer?: () => void;
  onOpenPlayStoreHub?: () => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  currentUser?: User | null;
  onOpenLogin?: () => void;
  onOpenSignUp?: () => void;
  onNavigateToProfile?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  properties,
  selectedType,
  onSelectType,
  onSelectCity,
  onSelectProperty,
  onNavigateToSearch,
  onNavigateToFavourites,
  onNavigateToRetailer,
  onOpenPlayStoreHub,
  favorites,
  onToggleFavorite,
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenLogin,
  onOpenSignUp,
  onNavigateToProfile
}) => {
  const [selectedExplorerState, setSelectedExplorerState] = useState<string>('Rajasthan');
  const allStatesList = getAllIndianStates();
  const currentExplorerStateInfo = INDIAN_STATES_DATA.find(s => s.state.toLowerCase() === selectedExplorerState.toLowerCase()) || INDIAN_STATES_DATA[0];

  const accommodationTypes: (PropertyType | 'All')[] = [
    'All',
    'PG',
    'Hostel',
    'Hotel',
    'Room',
    'Lounge',
    'Flat'
  ];

  const categoryCards = [
    {
      type: 'PG' as PropertyType,
      title: 'PG (Paying Guest)',
      desc: 'Mess meals, housekeeping & study desk',
      icon: Home,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconColor: 'text-indigo-600',
      count: properties.filter(p => p.property_type === 'PG').length
    },
    {
      type: 'Hostel' as PropertyType,
      title: 'Student Hostel',
      desc: 'Campus warden, biometrics & discipline',
      icon: Building2,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      iconColor: 'text-amber-600',
      count: properties.filter(p => p.property_type === 'Hostel').length
    },
    {
      type: 'Hotel' as PropertyType,
      title: 'Hotel & Transit Stay',
      desc: 'Exam days, interviews & visiting parents',
      icon: Hotel,
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      iconColor: 'text-sky-600',
      count: properties.filter(p => p.property_type === 'Hotel').length
    },
    {
      type: 'Room' as PropertyType,
      title: 'Independent Room',
      desc: 'Single/shared private rooms near college',
      icon: BedDouble,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconColor: 'text-emerald-600',
      count: properties.filter(p => p.property_type === 'Room').length
    },
    {
      type: 'Lounge' as PropertyType,
      title: '24/7 Study Lounge',
      desc: 'AC library pods, high-speed WiFi & silence',
      icon: BookOpen,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      iconColor: 'text-rose-600',
      count: properties.filter(p => p.property_type === 'Lounge').length
    },
    {
      type: 'Flat' as PropertyType,
      title: 'Student Flat',
      desc: '1BHK/2BHK flats for student flatmates',
      icon: Layers,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      iconColor: 'text-purple-600',
      count: properties.filter(p => p.property_type === 'Flat').length
    }
  ];

  const popularCities = [
    {
      city: "Jaipur",
      subtitle: "PGs, rooms & study lounges",
      hubs: "MNIT, Malviya Nagar, Pratap Nagar",
      count: properties.filter(p => p.city.toLowerCase() === 'jaipur').length,
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=300&q=80"
    },
    {
      city: "Delhi",
      subtitle: "Hostels, PGs, transit hotels & lounges",
      hubs: "North Campus, Satya Niketan, Mukherjee Nagar",
      count: properties.filter(p => p.city.toLowerCase() === 'delhi').length,
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=300&q=80"
    },
    {
      city: "Pune",
      subtitle: "Student accommodation & lounges",
      hubs: "Viman Nagar, FC Road, Kothrud",
      count: properties.filter(p => p.city.toLowerCase() === 'pune').length,
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=300&q=80"
    },
    {
      city: "Kota",
      subtitle: "PGs, hostels, study pods & exam hotels",
      hubs: "Landmark City, Coral Park, Indraprastha",
      count: properties.filter(p => p.city.toLowerCase() === 'kota').length,
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=300&q=80"
    }
  ];

  const featuredListings = properties
    .filter(p => p.available)
    .filter(p => selectedType === 'All' ? true : p.property_type === selectedType)
    .sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0))
    .slice(0, 6);

  const getCategoryBadgeClass = (type: PropertyType) => {
    switch (type) {
      case 'PG': return 'bg-indigo-600 text-white';
      case 'Hostel': return 'bg-amber-600 text-white';
      case 'Hotel': return 'bg-sky-600 text-white';
      case 'Room': return 'bg-emerald-600 text-white';
      case 'Lounge': return 'bg-rose-600 text-white';
      case 'Flat': return 'bg-purple-600 text-white';
      default: return 'bg-indigo-900/80 text-white';
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToSearch(searchQuery);
  };

  return (
    <div className="pb-16 bg-slate-50 min-h-screen text-slate-800">
      {/* Flutter Style AppBar */}
      <header className="sticky top-0 z-30 bg-indigo-700 text-white px-4 py-3.5 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img 
            src="/app-logo.png" 
            alt="Where is my room Logo" 
            className="w-8 h-8 rounded-xl object-cover shadow-xs border border-white/20 shrink-0" 
            referrerPolicy="no-referrer" 
          />
          <div>
            <h1 className="text-lg font-bold tracking-tight">Where is my room</h1>
            <p className="text-[11px] text-indigo-200">India's Verified Student PG & Hostel Network</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="appbar-fav-btn"
            onClick={onNavigateToFavourites}
            className="relative p-2 rounded-full hover:bg-white/15 transition-colors"
            title="Saved listings"
          >
            <Heart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {currentUser ? (
            <button
              id="appbar-profile-btn"
              onClick={onNavigateToProfile}
              className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 transition-all text-xs font-semibold"
              title={`Logged in as ${currentUser.name}`}
            >
              <div className="w-6 h-6 rounded-lg bg-white text-indigo-900 flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
              <span className="max-w-[70px] sm:max-w-[110px] truncate">{currentUser.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              id="appbar-login-btn"
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs shadow-xs transition-colors"
              title="Sign In / Register"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-5 space-y-6">
        {/* Hero Section */}
        <section className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Zero Brokerage for Students
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find your next room
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            PGs, hostels, rooms & roommates near your college and coaching institutes.
          </p>
        </section>

        {/* Search Bar - Matching Flutter TextField */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative flex items-center shadow-sm">
            <Search className="absolute left-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              id="home-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city, college, coaching or area..."
              className="w-full pl-11 pr-24 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              id="home-search-submit-btn"
              className="absolute right-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Retailer Listing Mode Banner */}
        {onNavigateToRetailer && (
          <div 
            onClick={onNavigateToRetailer}
            className="p-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white rounded-2xl shadow-md border border-indigo-700/50 cursor-pointer hover:shadow-lg transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-amber-300 transition-colors">
                    Retailer & Property Owner Mode
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-xs">
                    ₹100 Application Fee
                  </span>
                </div>
                <p className="text-xs text-indigo-200 mt-0.5">
                  List your <strong>Room, PG, Hostel, Hotel, or Lounge</strong> across all Indian State Capitals & major educational hubs with instant payment mode.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-center px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white shrink-0 transition-colors">
              <span>Open Retailer Portal</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        )}

        {/* PWA Mobile App & Play Store Hub Banner */}
        <PWAInstallButton 
          variant="banner" 
          onOpenPlayStoreHub={onOpenPlayStoreHub} 
        />

        {/* Accommodation ChoiceChips - Matching Flutter ChoiceChip Wrap */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Accommodation Categories</h3>
              <p className="text-xs text-slate-500">Separated for quick filtering: PG, Hostel, Hotel, Room, Lounge, Flat</p>
            </div>
            <span 
              className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline" 
              onClick={() => onNavigateToSearch()}
            >
              Browse All ({properties.length})
            </span>
          </div>

          {/* Quick ChoiceChips */}
          <div className="flex flex-wrap gap-2">
            {accommodationTypes.map((type) => {
              const isSelected = selectedType === type;
              const count = type === 'All' ? properties.length : properties.filter(p => p.property_type === type).length;
              return (
                <button
                  key={type}
                  id={`choice-chip-${type.toLowerCase()}`}
                  onClick={() => onSelectType(type)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/30'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{type === 'All' ? 'All Stays' : type}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Category Exploration Bento Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            {categoryCards.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = selectedType === cat.type;
              return (
                <div
                  key={cat.type}
                  id={`category-card-${cat.type.toLowerCase()}`}
                  onClick={() => onSelectType(isSelected ? 'All' : cat.type)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${cat.badgeColor}`}>
                      <IconComp className={`w-4 h-4 ${cat.iconColor}`} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {cat.count} stays
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <h4 className="font-bold text-xs text-slate-900">{cat.title}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{cat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Google & Verified Source Live Database Strip */}
        <section className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-3.5 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-blue-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-xs text-white">Google & Verified Sources Active</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  {properties.length} Verified Properties
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Authentic data collected across Kota, Delhi, Pune, Bangalore, Jaipur, Indore, Vellore, Manipal & more.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToSearch()}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs shrink-0 cursor-pointer"
          >
            <span>Search Verified Stays</span>
            <Search className="w-3.5 h-3.5 text-indigo-700" />
          </button>
        </section>

        {/* All India State Capitals & Major Cities Directory */}
        <section className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mb-1">
                <Landmark className="w-3 h-3" /> All Indian States & Capitals Covered
              </div>
              <h3 className="text-lg font-bold text-slate-900">Explore by State & Capital</h3>
              <p className="text-xs text-slate-500">Official State Capitals & premier educational student hubs</p>
            </div>

            {/* State Selector Dropdown */}
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600 shrink-0" />
              <select
                value={selectedExplorerState}
                onChange={(e) => setSelectedExplorerState(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs text-slate-800 focus:ring-2 focus:ring-indigo-600 cursor-pointer"
              >
                {allStatesList.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick State Tabs for Top Student States */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {['Rajasthan', 'Delhi (NCR)', 'Maharashtra', 'Karnataka', 'Uttar Pradesh', 'Tamil Nadu', 'Bihar', 'Madhya Pradesh', 'Gujarat', 'West Bengal'].map(st => (
              <button
                key={st}
                onClick={() => setSelectedExplorerState(st)}
                className={`px-3 py-1.5 rounded-lg shrink-0 font-medium transition-all ${
                  selectedExplorerState === st
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Selected State Showcase: Capital City & Major Cities */}
          {currentExplorerStateInfo && (
            <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <span>{currentExplorerStateInfo.state}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Official Capital: <strong className="text-indigo-700">{currentExplorerStateInfo.capital}</strong>
                  </p>
                </div>

                <button
                  onClick={() => onNavigateToSearch(currentExplorerStateInfo.state)}
                  className="self-start sm:self-auto text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>View all in {currentExplorerStateInfo.state}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Capital & Major Cities Badges */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  State Capital & Major Student Cities:
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Capital Pill */}
                  <button
                    onClick={() => onSelectCity(currentExplorerStateInfo.capital)}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Landmark className="w-3.5 h-3.5 text-amber-600" />
                    <span>{currentExplorerStateInfo.capital}</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-amber-200/80 rounded-full text-amber-950 uppercase font-extrabold">
                      Capital
                    </span>
                  </button>

                  {/* Major Cities Pills */}
                  {currentExplorerStateInfo.majorCities.map(cityName => (
                    <button
                      key={cityName}
                      onClick={() => onSelectCity(cityName)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 font-medium text-xs transition-colors"
                    >
                      {cityName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Featured Student Verified Rooms */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Featured & Verified Stays</h3>
              <p className="text-xs text-slate-500">Inspected for safety, food hygiene, & student study rules</p>
            </div>
            <button
              onClick={() => onNavigateToSearch()}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              View all ({properties.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredListings.map((prop) => {
              const isFav = favorites.includes(prop.id);
              return (
                <div
                  key={prop.id}
                  id={`featured-card-${prop.id}`}
                  onClick={() => onSelectProperty(prop)}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:shadow-lg transition-all cursor-pointer flex flex-col group"
                >
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg shadow-xs ${getCategoryBadgeClass(prop.property_type)}`}>
                        {prop.property_type}
                      </span>
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-black/60 text-white backdrop-blur-xs">
                        {prop.gender}
                      </span>
                    </div>

                    {prop.verified && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/90 text-white text-[11px] font-bold backdrop-blur-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(prop.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-sm transition-transform active:scale-90"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {prop.area}, {prop.city}{prop.state ? `, ${prop.state}` : ''}
                          </span>
                          {prop.is_capital && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-0.5">
                              <Landmark className="w-2.5 h-2.5 text-amber-600" /> Capital
                            </span>
                          )}
                          {prop.application_fee_paid && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ₹100 Paid
                            </span>
                          )}
                          {prop.google_rating && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-0.5">
                              ★ {prop.google_rating} Google
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                          ★ {prop.rating || 4.5}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {prop.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {prop.description}
                      </p>
                    </div>

                    {/* Quick Amenity Icons */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 border-t border-slate-100 pt-2.5">
                      {prop.food_available && (
                        <span className="flex items-center gap-1" title="Mess/Food included">
                          <Utensils className="w-3.5 h-3.5 text-indigo-600" />
                          Mess
                        </span>
                      )}
                      {prop.wifi && (
                        <span className="flex items-center gap-1" title="WiFi included">
                          <Wifi className="w-3.5 h-3.5 text-indigo-600" />
                          Wi-Fi
                        </span>
                      )}
                      {prop.ac && (
                        <span className="flex items-center gap-1" title="AC available">
                          <Wind className="w-3.5 h-3.5 text-indigo-600" />
                          AC
                        </span>
                      )}
                      <span className="ml-auto text-base font-extrabold text-indigo-700">
                        ₹{prop.rent.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-slate-500">/mo</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why Where is my room Banner */}
        <section className="p-4 rounded-2xl bg-indigo-900 text-white space-y-2.5">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-300" />
            <h4 className="font-bold text-sm">Direct Owner & Warden Connect</h4>
          </div>
          <p className="text-xs text-indigo-200 leading-relaxed">
            No agent commission. Connect directly with verified hostel owners, talk to current students, check authentic photos and book safe rooms near coaching hubs and universities.
          </p>
        </section>
      </main>
    </div>
  );
};
