import React, { useState } from 'react';
import { Property, PropertyType, GenderPreference, PaymentRecord } from '../types';
import { 
  ALL_INDIAN_CITIES, 
  getAllIndianStates, 
  getCitiesForState, 
  isCapitalCity, 
  getCapitalForState,
  INDIAN_STATES_DATA
} from '../data/indianCities';
import { PaymentModal } from './PaymentModal';
import { 
  Building2, Home, Hotel as HotelIcon, Coffee, BookOpen, 
  MapPin, CheckCircle2, IndianRupee, ShieldCheck, Sparkles, 
  Wifi, Utensils, Wind, Shirt, Bath, Clock, AlertCircle, 
  Plus, Check, ArrowRight, Eye, Phone, QrCode, Layers, Landmark
} from 'lucide-react';

interface RetailerListingPortalProps {
  onAddProperty: (property: Omit<Property, 'id' | 'created_at'>) => void;
  properties: Property[];
  onSelectProperty?: (property: Property) => void;
}

export const RetailerListingPortal: React.FC<RetailerListingPortalProps> = ({
  onAddProperty,
  properties,
  onSelectProperty
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'my_listings'>('create');
  
  // Selected Category
  const [selectedCategory, setSelectedCategory] = useState<PropertyType>('PG');
  
  // Basic & Location
  const [retailerBusiness, setRetailerBusiness] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [title, setTitle] = useState('');
  const [selectedState, setSelectedState] = useState<string>('Rajasthan');
  const [city, setCity] = useState('Jaipur');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [rent, setRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [gender, setGender] = useState<GenderPreference>('Boys');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Universal Amenities
  const [wifi, setWifi] = useState(true);
  const [food, setFood] = useState(true);
  const [ac, setAc] = useState(true);
  const [laundry, setLaundry] = useState(true);
  const [attachedBath, setAttachedBath] = useState(true);
  const [curfew, setCurfew] = useState('10:00 PM');
  const [electricity, setElectricity] = useState('₹12 / unit meter reading');

  // Category-Specific Details
  // 1. Room
  const [furnishing, setFurnishing] = useState<'Furnished' | 'Semi-Furnished' | 'Unfurnished'>('Furnished');
  const [roomSize, setRoomSize] = useState('160');
  const [floorNo, setFloorNo] = useState('2');
  const [privateEntry, setPrivateEntry] = useState(true);
  const [kitchenAccess, setKitchenAccess] = useState(false);

  // 2. PG
  const [foodType, setFoodType] = useState<'Pure Veg' | 'Veg & Non-Veg' | 'Jain Food Available'>('Pure Veg');
  const [meals, setMeals] = useState<string[]>(['Breakfast', 'Lunch', 'Dinner', 'Evening Snacks']);
  const [hasWarden, setHasWarden] = useState(true);
  const [laundryFreq, setLaundryFreq] = useState('Daily Clothes Wash & Iron');

  // 3. Hostel
  const [hostelSharing, setHostelSharing] = useState<'Single' | 'Double' | 'Triple' | '4-Sharing'>('Double');
  const [biometric, setBiometric] = useState(true);
  const [studyHallCapacity, setStudyHallCapacity] = useState('60');
  const [visitorPolicy, setVisitorPolicy] = useState('Parents allowed until 7:00 PM in visitor lounge');

  // 4. Hotel
  const [dailyTariff, setDailyTariff] = useState('1200');
  const [checkInTime, setCheckInTime] = useState('12:00 PM');
  const [checkOutTime, setCheckOutTime] = useState('11:00 AM');
  const [examWakeCall, setExamWakeCall] = useState(true);
  const [transitPickup, setTransitPickup] = useState(true);

  // 5. Lounge
  const [hourlyRate, setHourlyRate] = useState('40');
  const [monthlyPass, setMonthlyPass] = useState('1800');
  const [loungeHours, setLoungeHours] = useState<'24/7 Open' | '6:00 AM - 12:00 Midnight'>('24/7 Open');
  const [wifiSpeed, setWifiSpeed] = useState('300');
  const [soundproofPod, setSoundproofPod] = useState(true);
  const [powerBackup, setPowerBackup] = useState('100% DG Generator Backup');

  // Payment states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paidRecord, setPaidRecord] = useState<PaymentRecord | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Selected City object
  const currentCityObj = ALL_INDIAN_CITIES.find(c => c.name.toLowerCase() === city.toLowerCase());

  const handleCategoryChange = (type: PropertyType) => {
    setSelectedCategory(type);
    if (!title || title.includes('PG') || title.includes('Hostel') || title.includes('Hotel') || title.includes('Room') || title.includes('Lounge')) {
      if (type === 'PG') setTitle('Premium Student PG with Homely Mess');
      else if (type === 'Hostel') setTitle('Coaching Campus Student Hostel');
      else if (type === 'Hotel') setTitle('Exam Day & Transit Student Hotel');
      else if (type === 'Room') setTitle('Furnished Independent Single Room');
      else if (type === 'Lounge') setTitle('24/7 Silent Study Lounge & AC Pods');
      else if (type === 'Flat') setTitle('Fully Furnished Student Sharing Flat');
    }
  };

  const handleValidateAndPay = () => {
    setFormError('');
    if (!title.trim()) {
      setFormError('Please enter a Title for your listing.');
      return;
    }
    if (!ownerName.trim()) {
      setFormError('Please enter Retailer / Owner Contact Name.');
      return;
    }
    if (!ownerPhone.trim()) {
      setFormError('Please enter WhatsApp / Calling Phone number.');
      return;
    }
    if (!area.trim() || !address.trim()) {
      setFormError('Please provide the area locality and complete street address.');
      return;
    }
    if (!rent || isNaN(Number(rent)) || Number(rent) <= 0) {
      setFormError('Please enter a valid monthly rent or pass amount.');
      return;
    }

    // Open ₹100 Payment Gateway
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (record: PaymentRecord) => {
    setPaidRecord(record);

    // Build category-specific metadata
    const categoryDetails = {
      ...(selectedCategory === 'Room' ? {
        furnishing_status: furnishing,
        room_size_sqft: Number(roomSize) || 150,
        floor_number: Number(floorNo) || 1,
        private_entry: privateEntry,
        kitchen_access: kitchenAccess
      } : {}),
      ...(selectedCategory === 'PG' ? {
        meal_offerings: meals,
        food_type: foodType,
        has_live_in_warden: hasWarden,
        laundry_frequency: laundryFreq
      } : {}),
      ...(selectedCategory === 'Hostel' ? {
        sharing_capacity: hostelSharing,
        biometric_entry: biometric,
        study_hall_capacity: Number(studyHallCapacity) || 40,
        visitor_policy: visitorPolicy
      } : {}),
      ...(selectedCategory === 'Hotel' ? {
        daily_tariff: Number(dailyTariff) || 1200,
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
        exam_day_wake_call: examWakeCall,
        transit_pickup_available: transitPickup
      } : {}),
      ...(selectedCategory === 'Lounge' ? {
        hourly_pass_rate: Number(hourlyRate) || 40,
        monthly_pass_rate: Number(monthlyPass) || 1800,
        operating_hours: loungeHours,
        internet_speed_mbps: Number(wifiSpeed) || 300,
        has_soundproof_pod: soundproofPod,
        power_backup_hours: powerBackup
      } : {})
    };

    const newProp: Omit<Property, 'id' | 'created_at'> = {
      owner_id: 999,
      owner_name: ownerName,
      owner_phone: ownerPhone,
      retailer_business_name: retailerBusiness || `${ownerName}'s Properties`,
      title,
      property_type: selectedCategory,
      city,
      state: selectedState,
      is_capital: isCapitalCity(city, selectedState),
      area,
      address,
      latitude: 25.2138,
      longitude: 75.8648,
      rent: Number(rent),
      security_deposit: Number(securityDeposit) || 0,
      available_from: 'Immediate',
      gender,
      food_available: food,
      wifi,
      ac,
      laundry,
      attached_bathroom: attachedBath,
      description: description || `Verified ${selectedCategory} listing in ${area}, ${city}. Includes modern amenities, hygienic environment, and 24/7 support.`,
      verified: true,
      available: true,
      application_fee_paid: true,
      application_fee_transaction_id: record.transaction_id,
      images: imageUrl.trim() ? [imageUrl.trim()] : [
        selectedCategory === 'Hotel'
          ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'
          : selectedCategory === 'Lounge'
          ? 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80'
          : selectedCategory === 'Room'
          ? 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80'
      ],
      curfew_time: curfew,
      electricity_charges: electricity,
      rating: 4.8,
      review_count: 1,
      category_details: categoryDetails
    };

    onAddProperty(newProp);
    setSubmissionSuccess(true);
  };

  const handleResetForm = () => {
    setTitle('');
    setArea('');
    setAddress('');
    setRent('');
    setSecurityDeposit('');
    setDescription('');
    setImageUrl('');
    setPaidRecord(null);
    setSubmissionSuccess(false);
  };

  const allStatesList = getAllIndianStates();
  const stateCitiesData = getCitiesForState(selectedState);
  const stateCitiesList = stateCitiesData.allCities;
  const capitalOfSelectedState = getCapitalForState(selectedState);
  const isSelectedCityCapital = isCapitalCity(city, selectedState);

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const citiesInState = getCitiesForState(newState).allCities;
    const capital = getCapitalForState(newState);
    if (capital) {
      setCity(capital);
    } else if (citiesInState.length > 0) {
      setCity(citiesInState[0]);
    }
  };

  return (
    <div className="pb-16 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  Retailer Onboarding Mode
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 text-[11px] font-semibold">
                  Multi-Category Portal
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Retailer All-Category Listing Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Fill all property details for <strong>Room</strong>, <strong>PG</strong>, <strong>Hostel</strong>, <strong>Hotel</strong>, or <strong>Lounge</strong> across all Indian State Capitals & major cities with instant ₹100 verification fee clearance.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-white/10 p-1 rounded-2xl border border-white/20 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'create' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                Fill Listing Form
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('my_listings')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'my_listings' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                All Listings ({properties.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-4">

        {activeTab === 'create' ? (
          submissionSuccess ? (
            /* Submission Success Screen */
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-12 h-12 stroke-[2.5px]" />
              </div>

              <div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-full border border-emerald-200">
                  Application Fee Paid & Verified
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">
                  Your {selectedCategory} is Live & Verified!
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  The listing has been registered in the database with instant student visibility. Transaction ID: <strong className="font-mono text-slate-800">{paidRecord?.transaction_id}</strong>
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Property Title:</span>
                  <span className="font-bold text-slate-800">{title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-bold text-indigo-700">{selectedCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-slate-800">
                    {city}, {selectedState} {isSelectedCityCapital ? '🏛️ (Capital)' : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Application Fee:</span>
                  <span className="font-extrabold text-emerald-700">₹100 (Paid via {paidRecord?.payment_mode})</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md transition-all text-xs flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Property / Category
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('my_listings')}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all text-xs"
                >
                  View in My Listings
                </button>
              </div>
            </div>
          ) : (
            /* Multi-Category Form */
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              
              {/* Step 1: Select Category to Fill */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                      Choose Accommodation Category
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tailored fields adapt instantly for Room, PG, Hotel, Lounge, and Hostel.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                    Active: {selectedCategory}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {[
                    { type: 'Room', label: 'Room', desc: 'Single / 1RK / Sharing', icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-300' },
                    { type: 'PG', label: 'PG', desc: 'Food & Mess Included', icon: Utensils, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-300' },
                    { type: 'Hostel', label: 'Hostel', desc: 'Campus & Coaching', icon: Building2, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-300' },
                    { type: 'Hotel', label: 'Hotel', desc: 'Exam & Parent Stay', icon: HotelIcon, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-300' },
                    { type: 'Lounge', label: 'Lounge', desc: '24/7 Study AC Pods', icon: Coffee, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-300' },
                    { type: 'Flat', label: 'Flat', desc: '1/2 BHK Student Flat', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-300' },
                  ].map((cat) => {
                    const IconComp = cat.icon;
                    const isSelected = selectedCategory === cat.type;
                    return (
                      <button
                        key={cat.type}
                        type="button"
                        onClick={() => handleCategoryChange(cat.type as PropertyType)}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? `${cat.bg} ring-2 ring-indigo-500 shadow-xs font-bold`
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <IconComp className={`w-5 h-5 ${cat.color}`} />
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-700" />}
                        </div>
                        <div className="mt-2">
                          <div className="text-xs font-black text-slate-900">{cat.label}</div>
                          <div className="text-[10px] text-slate-500 line-clamp-1">{cat.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                
                {formError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Section 2: Retailer & Listing Profile */}
                <div>
                  <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                    Retailer Business & Contact Info
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Retailer / Business Name
                      </label>
                      <input
                        type="text"
                        value={retailerBusiness}
                        onChange={(e) => setRetailerBusiness(e.target.value)}
                        placeholder="e.g. Royal Homes & Lounges"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="e.g. Rajendra Meena"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        WhatsApp / Calling Phone *
                      </label>
                      <input
                        type="text"
                        required
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        placeholder="+91 98290 12345"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Listing Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Landmark City Luxury Air-Conditioned Boys PG"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold text-slate-800"
                    />
                  </div>
                </div>

                {/* Section 3: Indian State & City Coverage */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                      Location Coverage (All States & Capitals)
                    </h3>
                    <div className="flex items-center gap-1.5">
                      {isSelectedCityCapital ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <Landmark className="w-3 h-3 text-amber-700" /> State Capital ({selectedState})
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Major City ({selectedState})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* State Selection Tabs & Dropdown */}
                  <div className="space-y-2.5 mb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-bold text-slate-700">Indian State / Union Territory *</label>
                      <select
                        value={selectedState}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        {allStatesList.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    {/* Quick State Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                      {['Rajasthan', 'Delhi (NCR)', 'Maharashtra', 'Karnataka', 'Uttar Pradesh', 'Tamil Nadu', 'Bihar', 'Madhya Pradesh', 'Gujarat', 'West Bengal'].map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStateChange(st)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                            selectedState === st
                              ? 'bg-indigo-600 text-white font-bold shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700">Target City *</label>
                        {capitalOfSelectedState && (
                          <span className="text-[10px] text-amber-700 font-bold flex items-center gap-0.5">
                            <Landmark className="w-2.5 h-2.5" /> Cap: {capitalOfSelectedState}
                          </span>
                        )}
                      </div>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        {stateCitiesList.map(cName => {
                          const isCap = isCapitalCity(cName, selectedState);
                          return (
                            <option key={cName} value={cName}>
                              {isCap ? `🏛️ ${cName} (State Capital)` : cName}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Area / Locality *</label>
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="e.g. Landmark City, Coral Park, Piprali Rd"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">State & Capital Status</label>
                      <div className="px-3 py-2 bg-slate-100 rounded-xl text-[11px] font-semibold text-slate-700 truncate border border-slate-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-indigo-600 shrink-0" />
                        <span>{city}, {selectedState}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Complete Street Address *</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Plot No 42, Opposite Sangyan Building, Landmark City, Kota"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Section 4: CATEGORY-SPECIFIC DETAILS (Dynamic based on selected category) */}
                <div className="pt-2 border-t border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">4</span>
                    Category Specific Configuration ({selectedCategory})
                  </h3>

                  {/* ROOM SPECIFIC FIELDS */}
                  {selectedCategory === 'Room' && (
                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                        <Home className="w-4 h-4 text-emerald-600" />
                        <span>Independent Room Parameters</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Furnishing Status</label>
                          <select
                            value={furnishing}
                            onChange={(e) => setFurnishing(e.target.value as any)}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                          >
                            <option value="Furnished">Fully Furnished (Bed + Desk + Almirah)</option>
                            <option value="Semi-Furnished">Semi-Furnished</option>
                            <option value="Unfurnished">Unfurnished</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Room Carpet Area (sq ft)</label>
                          <input
                            type="number"
                            value={roomSize}
                            onChange={(e) => setRoomSize(e.target.value)}
                            placeholder="160"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Floor Level</label>
                          <input
                            type="number"
                            value={floorNo}
                            onChange={(e) => setFloorNo(e.target.value)}
                            placeholder="2"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 pt-1 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privateEntry}
                            onChange={(e) => setPrivateEntry(e.target.checked)}
                            className="rounded text-emerald-600"
                          />
                          <span className="font-semibold text-slate-700">Separate Private Entry Gate</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={kitchenAccess}
                            onChange={(e) => setKitchenAccess(e.target.checked)}
                            className="rounded text-emerald-600"
                          />
                          <span className="font-semibold text-slate-700">Private / Shared Kitchen Access</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* PG SPECIFIC FIELDS */}
                  {selectedCategory === 'PG' && (
                    <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-indigo-800 text-xs font-bold">
                        <Utensils className="w-4 h-4 text-indigo-600" />
                        <span>Paying Guest (PG) & Mess Details</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Mess Food Type</label>
                          <select
                            value={foodType}
                            onChange={(e) => setFoodType(e.target.value as any)}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                          >
                            <option value="Pure Veg">Pure Veg (Separate Kitchen)</option>
                            <option value="Veg & Non-Veg">Veg & Non-Veg on Specific Days</option>
                            <option value="Jain Food Available">Jain Food (No Onion/Garlic Available)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Laundry Service</label>
                          <input
                            type="text"
                            value={laundryFreq}
                            onChange={(e) => setLaundryFreq(e.target.value)}
                            placeholder="Daily Clothes Wash & Iron"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="block text-[11px] font-bold text-slate-700">Included Daily Meals:</span>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {['Breakfast', 'Lunch', 'Dinner', 'Evening Snacks', 'Milk at Night'].map(meal => (
                            <label key={meal} className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={meals.includes(meal)}
                                onChange={(e) => {
                                  if (e.target.checked) setMeals([...meals, meal]);
                                  else setMeals(meals.filter(m => m !== meal));
                                }}
                                className="rounded text-indigo-600"
                              />
                              <span>{meal}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* HOSTEL SPECIFIC FIELDS */}
                  {selectedCategory === 'Hostel' && (
                    <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
                        <Building2 className="w-4 h-4 text-amber-600" />
                        <span>Hostel Occupancy & Discipline Parameters</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Room Sharing Capacity</label>
                          <select
                            value={hostelSharing}
                            onChange={(e) => setHostelSharing(e.target.value as any)}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                          >
                            <option value="Single">Single Occupancy</option>
                            <option value="Double">Double Sharing</option>
                            <option value="Triple">Triple Sharing</option>
                            <option value="4-Sharing">4-Sharing Dormitory</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Study Hall Seating</label>
                          <input
                            type="number"
                            value={studyHallCapacity}
                            onChange={(e) => setStudyHallCapacity(e.target.value)}
                            placeholder="60 students"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Parent Visitor Rules</label>
                          <input
                            type="text"
                            value={visitorPolicy}
                            onChange={(e) => setVisitorPolicy(e.target.value)}
                            placeholder="Allowed till 7:00 PM"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer text-xs pt-1">
                        <input
                          type="checkbox"
                          checked={biometric}
                          onChange={(e) => setBiometric(e.target.checked)}
                          className="rounded text-amber-600"
                        />
                        <span className="font-semibold text-slate-700">Biometric / RFID Attendance Machine at Entrance Gate</span>
                      </label>
                    </div>
                  )}

                  {/* HOTEL SPECIFIC FIELDS */}
                  {selectedCategory === 'Hotel' && (
                    <div className="bg-sky-50/60 border border-sky-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sky-800 text-xs font-bold">
                        <HotelIcon className="w-4 h-4 text-sky-600" />
                        <span>Exam Transit & Short Stay Hotel Rules</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Daily Tariff Rate (₹/day)</label>
                          <input
                            type="number"
                            value={dailyTariff}
                            onChange={(e) => setDailyTariff(e.target.value)}
                            placeholder="1200"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Check-in Time</label>
                          <input
                            type="text"
                            value={checkInTime}
                            onChange={(e) => setCheckInTime(e.target.value)}
                            placeholder="12:00 PM"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Check-out Time</label>
                          <input
                            type="text"
                            value={checkOutTime}
                            onChange={(e) => setCheckOutTime(e.target.value)}
                            placeholder="11:00 AM"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={examWakeCall}
                            onChange={(e) => setExamWakeCall(e.target.checked)}
                            className="rounded text-sky-600"
                          />
                          <span className="font-semibold text-slate-700">Exam Morning Special Wake-Up Call Service</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={transitPickup}
                            onChange={(e) => setTransitPickup(e.target.checked)}
                            className="rounded text-sky-600"
                          />
                          <span className="font-semibold text-slate-700">Railway / Exam Center Shuttle Transit</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* LOUNGE SPECIFIC FIELDS */}
                  {selectedCategory === 'Lounge' && (
                    <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                        <Coffee className="w-4 h-4 text-rose-600" />
                        <span>24/7 Study Lounge & Silent Pod Features</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Hourly Pass Rate (₹/hr)</label>
                          <input
                            type="number"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(e.target.value)}
                            placeholder="40"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Monthly Reserved Desk (₹/mo)</label>
                          <input
                            type="number"
                            value={monthlyPass}
                            onChange={(e) => setMonthlyPass(e.target.value)}
                            placeholder="1800"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Internet Speed (Mbps)</label>
                          <input
                            type="number"
                            value={wifiSpeed}
                            onChange={(e) => setWifiSpeed(e.target.value)}
                            placeholder="300"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={soundproofPod}
                            onChange={(e) => setSoundproofPod(e.target.checked)}
                            className="rounded text-rose-600"
                          />
                          <span className="font-semibold text-slate-700">Soundproof Private Online Test & Doubt Pods</span>
                        </label>
                        <div className="text-slate-600 flex items-center gap-1 text-xs">
                          <Clock className="w-3.5 h-3.5 text-rose-600" />
                          <span>Hours: <strong>24/7 Uninterrupted Air Conditioning</strong></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 5: Pricing, Amenities & Photos */}
                <div className="pt-2 border-t border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">5</span>
                    Pricing, Amenities & Images
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Monthly Rent / Tariff (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        value={rent}
                        onChange={(e) => setRent(e.target.value)}
                        placeholder="e.g. 7500"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Security Deposit (₹)
                      </label>
                      <input
                        type="number"
                        value={securityDeposit}
                        onChange={(e) => setSecurityDeposit(e.target.value)}
                        placeholder="e.g. 5000"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Gender Allowed
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as GenderPreference)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="Boys">Boys Only</option>
                        <option value="Girls">Girls Only</option>
                        <option value="Co-ed">Co-ed (Both allowed)</option>
                        <option value="Any">Any / Neutral</option>
                      </select>
                    </div>
                  </div>

                  {/* Amenities checkboxes */}
                  <div className="mt-3">
                    <span className="block text-xs font-bold text-slate-700 mb-1.5">Universal Amenities:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                      {[
                        { label: 'High-Speed Wi-Fi', val: wifi, set: setWifi, icon: Wifi },
                        { label: 'Daily Meals Included', val: food, set: setFood, icon: Utensils },
                        { label: 'Air Conditioner (AC)', val: ac, set: setAc, icon: Wind },
                        { label: 'Laundry Service', val: laundry, set: setLaundry, icon: Shirt },
                        { label: 'Attached Washroom', val: attachedBath, set: setAttachedBath, icon: Bath },
                      ].map(item => {
                        const Icon = item.icon;
                        return (
                          <label key={item.label} className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                            item.val ? 'bg-indigo-50/80 border-indigo-300 text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}>
                            <input
                              type="checkbox"
                              checked={item.val}
                              onChange={(e) => item.set(e.target.checked)}
                              className="rounded text-indigo-600"
                            />
                            <Icon className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold">{item.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Photo Image URL (Optional)</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Section 6: ₹100 RETAILER APPLICATION FEE NOTICE & SUBMISSION */}
                <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[11px] uppercase tracking-wider inline-flex items-center gap-1 shadow-xs">
                          <Sparkles className="w-3 h-3" />
                          Mandatory Retailer Fee
                        </span>
                        <h4 className="text-xl font-black text-white mt-1">
                          ₹100 Retailer Application & Verification Fee
                        </h4>
                        <p className="text-xs text-indigo-200 max-w-lg mt-0.5">
                          In accordance with platform guidelines, every retailer pays a one-time ₹100 onboarding verification fee per listing. Covers identity check, address verification, and instant live publication.
                        </p>
                      </div>

                      <div className="bg-white/10 border border-white/20 rounded-2xl p-3 text-center shrink-0">
                        <span className="text-[10px] text-indigo-300 uppercase block font-bold">Fee Amount</span>
                        <span className="text-2xl font-black text-white">₹100</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-3 text-xs text-indigo-200">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Accepts UPI (GPay/PhonePe), Debit/Credit Cards & NetBanking</span>
                      </div>

                      <button
                        type="button"
                        id="retailer-pay-and-publish-btn"
                        onClick={handleValidateAndPay}
                        className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all text-xs"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Pay ₹100 & Publish Listing</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )
        ) : (
          /* Retailer My Listings Overview */
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-slate-900">Retailer Active Portfolio</h3>
                <p className="text-xs text-slate-500">All registered listings across Room, PG, Hotel, Hostel, and Lounge</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Listing
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.map(p => (
                <div 
                  key={p.id}
                  onClick={() => onSelectProperty?.(p)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex gap-3 p-3">
                    <img
                      src={p.images[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400'}
                      alt={p.title}
                      className="w-24 h-24 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-100 text-indigo-700">
                          {p.property_type}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                          {p.city}{p.state ? `, ${p.state}` : ''}
                        </span>
                        {p.is_capital && (
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-0.5">
                            <Landmark className="w-2.5 h-2.5 text-amber-700" /> Capital
                          </span>
                        )}
                        {p.application_fee_paid && (
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> ₹100 Paid
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 truncate">{p.title}</h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{p.address}</p>
                      <div className="mt-2 text-xs font-black text-indigo-700 flex items-center justify-between">
                        <span>₹{p.rent.toLocaleString('en-IN')}/mo</span>
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Active & Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Retailer Onboarding Fee"
        subtitle={`Mandatory verification fee for ${title || selectedCategory}`}
        amount={100}
        paymentType="retailer_application_fee"
        payerName={ownerName || retailerBusiness || "Property Retailer"}
        payerPhone={ownerPhone || "+91 98290 12345"}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
