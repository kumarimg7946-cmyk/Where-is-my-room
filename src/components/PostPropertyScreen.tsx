import React, { useState } from 'react';
import { Property, PropertyType, GenderPreference, User } from '../types';
import { 
  PlusCircle, Building, MapPin, IndianRupee, 
  Utensils, Wifi, Wind, Shirt, Bath, Check, Sparkles,
  Image as ImageIcon, Clock, LogIn, KeyRound
} from 'lucide-react';

interface PostPropertyScreenProps {
  onAddProperty: (newProperty: Omit<Property, 'id' | 'created_at'>) => void;
  onSuccess: (newPropId: number) => void;
  currentUser?: User | null;
  onOpenLogin?: () => void;
}

const SAMPLE_ROOM_IMAGES = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
];

export const PostPropertyScreen: React.FC<PostPropertyScreenProps> = ({
  onAddProperty,
  onSuccess,
  currentUser,
  onOpenLogin
}) => {
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('PG');
  const [city, setCity] = useState(currentUser?.city || 'Kota');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [rent, setRent] = useState(7500);
  const [securityDeposit, setSecurityDeposit] = useState(7500);
  const [availableFrom, setAvailableFrom] = useState('2026-03-01');
  const [gender, setGender] = useState<GenderPreference>('Boys');
  const [foodAvailable, setFoodAvailable] = useState(true);
  const [wifi, setWifi] = useState(true);
  const [ac, setAc] = useState(false);
  const [laundry, setLaundry] = useState(true);
  const [attachedBathroom, setAttachedBathroom] = useState(true);
  const [curfewTime, setCurfewTime] = useState('10:00 PM');
  const [sharingOptions, setSharingOptions] = useState('Twin Sharing / Single');
  const [nearbyInstitutes, setNearbyInstitutes] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(SAMPLE_ROOM_IMAGES[0]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [ownerName, setOwnerName] = useState(currentUser?.name || 'Rajesh Kumar (Owner)');
  const [ownerPhone, setOwnerPhone] = useState(currentUser?.phone || '+91 98290 88990');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Update when currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setOwnerName(currentUser.name);
      setOwnerPhone(currentUser.phone);
      if (currentUser.city) setCity(currentUser.city);
    }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !area || !address) return;

    setIsSubmitting(true);

    const imageUrl = customImageUrl.trim() || selectedImage;
    const institutesList = nearbyInstitutes
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    setTimeout(() => {
      onAddProperty({
        owner_id: currentUser ? currentUser.id : 1,
        owner_name: ownerName,
        owner_phone: ownerPhone,
        retailer_business_name: currentUser?.business_name || (ownerName.includes('(') ? ownerName : `${ownerName}'s Accommodation`),
        title,
        property_type: propertyType,
        city,
        area,
        address,
        latitude: city === 'Kota' ? 25.2138 : city === 'Delhi' ? 28.7041 : city === 'Jaipur' ? 26.9124 : 18.5204,
        longitude: city === 'Kota' ? 75.8648 : city === 'Delhi' ? 77.1025 : city === 'Jaipur' ? 75.7873 : 73.8567,
        rent: Number(rent),
        security_deposit: Number(securityDeposit),
        available_from: availableFrom,
        gender,
        food_available: foodAvailable,
        wifi,
        ac,
        laundry,
        attached_bathroom: attachedBathroom,
        description: description || `Clean, student-friendly ${propertyType} in ${area}, ${city}. Includes amenities like Wi-Fi, study table and peaceful environment.`,
        verified: false, // newly posted properties start unverified for admin review!
        available: true,
        images: [imageUrl],
        sharing_options: sharingOptions,
        curfew_time: curfewTime,
        nearby_institutes: institutesList.length > 0 ? institutesList : [`Coaching Hubs (${area})`],
        rating: 5.0,
        review_count: 0
      });

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        onSuccess(Date.now());
      }, 1500);
    }, 400);
  };

  return (
    <div className="pb-16 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-600" />
              List a Student Room / PG
            </h1>
            <p className="text-xs text-slate-500">Post your property directly to thousands of students</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Free Listing
          </span>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {submitSuccess ? (
          <div className="bg-white rounded-2xl border border-emerald-200 p-8 text-center space-y-3 shadow-md animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Property Listed Successfully!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your student room has been submitted. It is now visible to students and is queued for verified badge review by our admin team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
            {/* Account Context Banner */}
            {!currentUser ? (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-900">
                  <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>You are listing as Guest. Sign in to easily manage bookings and edit inquiries.</span>
                </div>
                {onOpenLogin && (
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shrink-0 flex items-center gap-1 shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Log In</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span>Listing as <strong>{currentUser.name}</strong> ({currentUser.email})</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-indigo-200/70 text-indigo-800 text-[10px] font-bold uppercase">
                  {currentUser.user_type}
                </span>
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Building className="w-4 h-4" /> 1. Property Details
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Listing Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Allen Coaching Hub Boys PG with AC & Mess"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type *</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white"
                  >
                    <option value="PG">PG (Paying Guest)</option>
                    <option value="Hostel">Student Hostel</option>
                    <option value="Hotel">Hotel (Exam & Transit Stay)</option>
                    <option value="Room">Independent Single/Double Room</option>
                    <option value="Lounge">24/7 Study Lounge & Pods</option>
                    <option value="Flat">Furnished Student Flat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white"
                  >
                    <option value="Kota">Kota</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Jaipur">Jaipur</option>
                    <option value="Pune">Pune</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender Preference *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as GenderPreference)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white"
                  >
                    <option value="Boys">Boys Only</option>
                    <option value="Girls">Girls Only</option>
                    <option value="Co-ed">Co-ed / Any</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Area / Locality *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Landmark City / North Campus / Viman Nagar"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="Plot / Flat number, street, landmark, pincode"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Rent & Commercials */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4" /> 2. Rent & Availability
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Rent (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="100"
                    value={rent}
                    onChange={(e) => setRent(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Available From</label>
                  <input
                    type="date"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Curfew Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 PM or No Curfew"
                    value={curfewTime}
                    onChange={(e) => setCurfewTime(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nearby Colleges / Coaching</label>
                  <input
                    type="text"
                    placeholder="e.g. Allen Sangyan (200m), Hindu College (600m)"
                    value={nearbyInstitutes}
                    onChange={(e) => setNearbyInstitutes(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Amenities Checklist */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> 3. Student Amenities
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  foodAvailable ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={foodAvailable}
                    onChange={(e) => setFoodAvailable(e.target.checked)}
                    className="accent-indigo-600"
                  />
                  <Utensils className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs">Mess / Meals</span>
                </label>

                <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  wifi ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={wifi}
                    onChange={(e) => setWifi(e.target.checked)}
                    className="accent-indigo-600"
                  />
                  <Wifi className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs">Wi-Fi Internet</span>
                </label>

                <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  ac ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={ac}
                    onChange={(e) => setAc(e.target.checked)}
                    className="accent-indigo-600"
                  />
                  <Wind className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs">Air Conditioner</span>
                </label>

                <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  laundry ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={laundry}
                    onChange={(e) => setLaundry(e.target.checked)}
                    className="accent-indigo-600"
                  />
                  <Shirt className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs">Laundry</span>
                </label>

                <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  attachedBathroom ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={attachedBathroom}
                    onChange={(e) => setAttachedBathroom(e.target.checked)}
                    className="accent-indigo-600"
                  />
                  <Bath className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs">Attached Bath</span>
                </label>
              </div>
            </div>

            {/* Photos & Description */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" /> 4. Photos & Description
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Select Cover Photo</label>
                <div className="grid grid-cols-5 gap-2">
                  {SAMPLE_ROOM_IMAGES.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedImage(img);
                        setCustomImageUrl('');
                      }}
                      className={`relative h-16 rounded-lg overflow-hidden border-2 cursor-pointer ${
                        selectedImage === img && !customImageUrl ? 'border-indigo-600 ring-2 ring-indigo-600/30' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="room" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Or Paste Custom Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Property Description</label>
                <textarea
                  rows={3}
                  placeholder="Mention room size, study environment, meal timings, rules..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Owner Contact */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600">
                5. Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name / Designation *</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                id="submit-property-btn"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Publishing Room Listing...</span>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    Publish Property Listing
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};
