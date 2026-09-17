import React, { useState, useMemo } from 'react';
import { Property, PropertyType, GenderPreference } from '../types';
import { 
  Search, SlidersHorizontal, MapPin, Heart, ShieldCheck, 
  Utensils, Wifi, Wind, Shirt, Bath, ArrowUpDown, X,
  CheckCircle2, RefreshCw, Landmark, Building2
} from 'lucide-react';
import { INDIAN_STATES_DATA, getAllIndianStates, isCapitalCity } from '../data/indianCities';

interface SearchScreenProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  initialCity?: string;
  initialType?: PropertyType | 'All';
  initialSearchQuery?: string;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  properties,
  onSelectProperty,
  favorites,
  onToggleFavorite,
  initialCity = '',
  initialType = 'All',
  initialSearchQuery = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [filterCapitalsOnly, setFilterCapitalsOnly] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<PropertyType | 'All'>(initialType);
  const [selectedGender, setSelectedGender] = useState<GenderPreference | 'All'>('All');
  const [maxRent, setMaxRent] = useState<number>(20000);
  const [minRent, setMinRent] = useState<number>(0);
  const [filterFood, setFilterFood] = useState(false);
  const [filterWifi, setFilterWifi] = useState(false);
  const [filterAC, setFilterAC] = useState(false);
  const [filterLaundry, setFilterLaundry] = useState(false);
  const [filterAttachedBath, setFilterAttachedBath] = useState(false);
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating'>('recommended');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const allStates = useMemo(() => {
    return ['All States', ...getAllIndianStates()];
  }, []);

  const availableCities = useMemo(() => {
    if (selectedState && selectedState !== 'All States') {
      const stateObj = INDIAN_STATES_DATA.find(s => s.state.toLowerCase() === selectedState.toLowerCase());
      if (stateObj) {
        const cityList = [stateObj.capital, ...stateObj.majorCities.filter(c => c.toLowerCase() !== stateObj.capital.toLowerCase())];
        return ['All Cities in ' + stateObj.state, ...cityList];
      }
    }
    const set = new Set(properties.map(p => p.city));
    return ['All Cities', ...Array.from(set)];
  }, [properties, selectedState]);

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Only available listings
      if (!prop.available) return false;

      // State filter
      if (selectedState && selectedState !== 'All States') {
        if (prop.state && prop.state.toLowerCase() !== selectedState.toLowerCase()) {
          return false;
        }
      }

      // Capitals only filter
      if (filterCapitalsOnly) {
        const isCap = prop.is_capital ?? isCapitalCity(prop.city, prop.state);
        if (!isCap) return false;
      }

      // City filter
      if (selectedCity && !selectedCity.startsWith('All Cities') && prop.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Property type filter (property_type = $index)
      if (selectedType !== 'All' && prop.property_type !== selectedType) {
        return false;
      }

      // Gender filter (gender = $index)
      if (selectedGender !== 'All' && prop.gender !== selectedGender) {
        return false;
      }

      // Rent range (rent >= minRent AND rent <= maxRent)
      if (prop.rent < minRent || prop.rent > maxRent) {
        return false;
      }

      // Amenities filters
      if (filterFood && !prop.food_available) return false;
      if (filterWifi && !prop.wifi) return false;
      if (filterAC && !prop.ac) return false;
      if (filterLaundry && !prop.laundry) return false;
      if (filterAttachedBath && !prop.attached_bathroom) return false;

      // Verified filter
      if (filterVerifiedOnly && !prop.verified) return false;

      // Free text search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesCity = prop.city.toLowerCase().includes(query);
        const matchesState = prop.state?.toLowerCase().includes(query);
        const matchesArea = prop.area.toLowerCase().includes(query);
        const matchesDesc = prop.description.toLowerCase().includes(query);
        const matchesNearby = prop.nearby_institutes?.some(inst => inst.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCity && !matchesState && !matchesArea && !matchesDesc && !matchesNearby) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.rent - b.rent;
      if (sortBy === 'price_high') return b.rent - a.rent;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      // Default recommended: verified first, then newest
      if (a.verified !== b.verified) return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
      return b.id - a.id;
    });
  }, [
    properties,
    selectedState,
    filterCapitalsOnly,
    selectedCity,
    selectedType,
    selectedGender,
    minRent,
    maxRent,
    filterFood,
    filterWifi,
    filterAC,
    filterLaundry,
    filterAttachedBath,
    filterVerifiedOnly,
    searchTerm,
    sortBy
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedState('All States');
    setSelectedCity('');
    setFilterCapitalsOnly(false);
    setSelectedType('All');
    setSelectedGender('All');
    setMinRent(0);
    setMaxRent(20000);
    setFilterFood(false);
    setFilterWifi(false);
    setFilterAC(false);
    setFilterLaundry(false);
    setFilterAttachedBath(false);
    setFilterVerifiedOnly(false);
    setSortBy('recommended');
  };

  const activeFilterCount = (selectedState && selectedState !== 'All States' ? 1 : 0)
    + (selectedCity && !selectedCity.startsWith('All Cities') ? 1 : 0)
    + (filterCapitalsOnly ? 1 : 0)
    + (selectedType !== 'All' ? 1 : 0)
    + (selectedGender !== 'All' ? 1 : 0)
    + (maxRent < 20000 ? 1 : 0)
    + (filterFood ? 1 : 0)
    + (filterWifi ? 1 : 0)
    + (filterAC ? 1 : 0)
    + (filterLaundry ? 1 : 0)
    + (filterAttachedBath ? 1 : 0)
    + (filterVerifiedOnly ? 1 : 0);

  const getCategoryBadgeClass = (type: PropertyType) => {
    switch (type) {
      case 'PG': return 'bg-indigo-600 text-white';
      case 'Hostel': return 'bg-amber-600 text-white';
      case 'Hotel': return 'bg-sky-600 text-white';
      case 'Room': return 'bg-emerald-600 text-white';
      case 'Lounge': return 'bg-rose-600 text-white';
      case 'Flat': return 'bg-purple-600 text-white';
      default: return 'bg-indigo-900/85 text-white';
    }
  };

  return (
    <div className="pb-16 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Sticky Search & Filter Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-4xl mx-auto space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                id="search-input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search college, coaching, locality or city..."
                className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              id="filter-drawer-toggle-btn"
              onClick={() => setShowFilterDrawer(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                activeFilterCount > 0
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-indigo-700 text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Filter Horizontal Scrollbar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            {/* State Selector */}
            <div className="flex items-center gap-1 shrink-0">
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity('');
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold focus:ring-1 focus:ring-indigo-600 shrink-0"
              >
                {allStates.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* State Capitals Only Toggle Chip */}
            <button
              onClick={() => setFilterCapitalsOnly(!filterCapitalsOnly)}
              className={`px-3 py-1.5 rounded-lg shrink-0 text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterCapitalsOnly
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Landmark className="w-3 h-3" />
              <span>State Capitals</span>
            </button>

            {/* City Selector */}
            <select
              value={selectedCity || (selectedState !== 'All States' ? `All Cities in ${selectedState}` : 'All Cities')}
              onChange={(e) => setSelectedCity(e.target.value.startsWith('All Cities') ? '' : e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium focus:ring-1 focus:ring-indigo-600 shrink-0"
            >
              {availableCities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Type Quick Chips */}
            {(['All', 'PG', 'Hostel', 'Hotel', 'Room', 'Lounge', 'Flat'] as const).map(type => {
              const count = type === 'All' ? properties.length : properties.filter(p => p.property_type === type).length;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg shrink-0 font-medium transition-colors flex items-center gap-1.5 ${
                    selectedType === type
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{type}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedType === type ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Sort Selector */}
            <div className="ml-auto flex items-center gap-1 shrink-0 text-slate-600">
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-medium border-none focus:ring-0 text-slate-700 cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price_low">Rent: Low to High</option>
                <option value="price_high">Rent: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Results Container */}
      <main className="max-w-4xl mx-auto px-4 pt-4 space-y-4">
        {/* Results Count & Active Tags */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800 font-bold">{filteredProperties.length}</strong> student accommodations
            {selectedCity && selectedCity !== 'All Cities' && ` in ${selectedCity}`}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reset all
            </button>
          )}
        </div>

        {/* Listings Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 my-6">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No student rooms match your filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your rent budget, removing amenity filters, or selecting a different student city like Kota, Jaipur, Delhi, or Pune.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProperties.map((prop) => {
              const isFav = favorites.includes(prop.id);
              return (
                <div
                  key={prop.id}
                  id={`search-card-${prop.id}`}
                  onClick={() => onSelectProperty(prop)}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col group"
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
                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded-lg backdrop-blur-xs ${
                        prop.gender === 'Girls' ? 'bg-rose-900/80 text-white' :
                        prop.gender === 'Boys' ? 'bg-blue-900/80 text-white' : 'bg-emerald-900/80 text-white'
                      }`}>
                        {prop.gender}
                      </span>
                    </div>

                    {prop.verified && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-bold shadow-xs">
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

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-indigo-600 flex items-center gap-1">
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
                        </div>
                        <span className="font-bold text-amber-500 shrink-0">
                          ★ {prop.rating || 4.5}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm mt-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {prop.title}
                      </h4>

                      {prop.nearby_institutes && prop.nearby_institutes[0] && (
                        <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                          📍 Near {prop.nearby_institutes[0]}
                        </div>
                      )}
                    </div>

                    {/* Amenities Tag Line */}
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600">
                      {prop.food_available && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 flex items-center gap-1">
                          <Utensils className="w-3 h-3 text-indigo-600" /> Mess
                        </span>
                      )}
                      {prop.wifi && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 flex items-center gap-1">
                          <Wifi className="w-3 h-3 text-indigo-600" /> WiFi
                        </span>
                      )}
                      {prop.ac && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 flex items-center gap-1">
                          <Wind className="w-3 h-3 text-indigo-600" /> AC
                        </span>
                      )}
                      {prop.attached_bathroom && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 flex items-center gap-1">
                          <Bath className="w-3 h-3 text-indigo-600" /> Attached Bath
                        </span>
                      )}
                    </div>

                    {/* Pricing Footer */}
                    <div className="flex items-baseline justify-between border-t border-slate-100 pt-2">
                      <span className="text-xs text-slate-400">Monthly Rent</span>
                      <span className="text-base font-extrabold text-indigo-700">
                        ₹{prop.rent.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-slate-500">/mo</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Filter Modal / Drawer */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="sticky top-0 z-10 px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Search Filters</h3>
                <p className="text-xs text-slate-500">Fine-tune according to college & budget</p>
              </div>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 space-y-6 flex-1 text-xs">
              {/* State Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Indian State / Union Territory</label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCity('');
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:ring-1 focus:ring-indigo-600 text-xs"
                >
                  {allStates.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>

                <div className="mt-2.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filterCapitalsOnly}
                      onChange={(e) => setFilterCapitalsOnly(e.target.checked)}
                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      🏛️ Show State Capitals Only
                    </span>
                  </label>
                </div>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Target Student City {selectedState !== 'All States' && `in ${selectedState}`}
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {availableCities.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCity(c.startsWith('All Cities') ? '' : c)}
                      className={`p-2 rounded-xl border text-left font-medium transition-all text-xs truncate ${
                        (c.startsWith('All Cities') && !selectedCity) || selectedCity === c
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Accommodation Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['All', 'PG', 'Hostel', 'Hotel', 'Room', 'Lounge', 'Flat'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedType(t)}
                      className={`p-2 rounded-xl border text-center font-medium transition-all ${
                        selectedType === t
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {t === 'All' ? 'All Types' : t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Gender Preference</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['All', 'Boys', 'Girls', 'Co-ed'] as const).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedGender(g)}
                      className={`p-2 rounded-xl border text-center font-medium transition-all ${
                        selectedGender === g
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rent Range Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800">Monthly Budget (Max Rent)</label>
                  <span className="text-xs font-extrabold text-indigo-700">₹{maxRent.toLocaleString('en-IN')} / mo</span>
                </div>
                <input
                  type="range"
                  min="4000"
                  max="25000"
                  step="500"
                  value={maxRent}
                  onChange={(e) => setMaxRent(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹4,000</span>
                  <span>₹15,000</span>
                  <span>₹25,000+</span>
                </div>
              </div>

              {/* Student Amenities Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2.5">Must-Have Amenities</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={filterFood}
                      onChange={(e) => setFilterFood(e.target.checked)}
                      className="accent-indigo-600 rounded"
                    />
                    <Utensils className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium text-slate-700">Mess / Food Available</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={filterWifi}
                      onChange={(e) => setFilterWifi(e.target.checked)}
                      className="accent-indigo-600 rounded"
                    />
                    <Wifi className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium text-slate-700">High-Speed Wi-Fi</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={filterAC}
                      onChange={(e) => setFilterAC(e.target.checked)}
                      className="accent-indigo-600 rounded"
                    />
                    <Wind className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium text-slate-700">Air Conditioner (AC)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={filterLaundry}
                      onChange={(e) => setFilterLaundry(e.target.checked)}
                      className="accent-indigo-600 rounded"
                    />
                    <Shirt className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium text-slate-700">Laundry Service</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={filterAttachedBath}
                      onChange={(e) => setFilterAttachedBath(e.target.checked)}
                      className="accent-indigo-600 rounded"
                    />
                    <Bath className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium text-slate-700">Attached Bathroom</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={filterVerifiedOnly}
                      onChange={(e) => setFilterVerifiedOnly(e.target.checked)}
                      className="accent-indigo-600 rounded"
                    />
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium text-slate-700">Verified Properties Only</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="sticky bottom-0 z-10 p-4 bg-white border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setShowFilterDrawer(false)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
              >
                Apply ({filteredProperties.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
