import React, { useState } from 'react';
import { User, Property, UserType } from '../types';
import { 
  User as UserIcon, Phone, Mail, Shield, 
  Building, Calendar, Heart, PlusCircle, CheckCircle, 
  ExternalLink, Bell, Settings, LogOut, LogIn, UserPlus,
  Edit3, KeyRound, MapPin, GraduationCap, X, Check
} from 'lucide-react';

interface ProfileScreenProps {
  currentUser: User | null;
  onUpdateUserType: (type: UserType) => void;
  onUpdateUser: (updatedUser: User) => void;
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
  onLogout: () => void;
  properties: Property[];
  favoritesCount: number;
  scheduledVisits: Array<{
    propertyTitle: string;
    city: string;
    date: string;
    time: string;
  }>;
  onNavigateToPostProperty: () => void;
  onNavigateToSaved: () => void;
  onSelectProperty: (property: Property) => void;
  onOpenPlayStoreHub?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onUpdateUserType,
  onUpdateUser,
  onOpenLogin,
  onOpenSignUp,
  onLogout,
  properties,
  favoritesCount,
  scheduledVisits,
  onNavigateToPostProperty,
  onNavigateToSaved,
  onSelectProperty,
  onOpenPlayStoreHub
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editCity, setEditCity] = useState(currentUser?.city || 'Kota');
  const [editCollege, setEditCollege] = useState(currentUser?.college_or_institute || '');
  const [editBusinessName, setEditBusinessName] = useState(currentUser?.business_name || '');
  const [saveFeedback, setSaveFeedback] = useState(false);

  const myProperties = currentUser 
    ? properties.filter(p => p.owner_id === currentUser.id)
    : [];

  const handleOpenEdit = () => {
    if (!currentUser) return;
    setEditName(currentUser.name);
    setEditPhone(currentUser.phone);
    setEditCity(currentUser.city || 'Kota');
    setEditCollege(currentUser.college_or_institute || '');
    setEditBusinessName(currentUser.business_name || '');
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updated: User = {
      ...currentUser,
      name: editName.trim() || currentUser.name,
      phone: editPhone.trim() || currentUser.phone,
      city: editCity,
      college_or_institute: editCollege.trim() || undefined,
      business_name: editBusinessName.trim() || undefined,
    };

    onUpdateUser(updated);
    setSaveFeedback(true);
    setTimeout(() => {
      setSaveFeedback(false);
      setIsEditingProfile(false);
    }, 600);
  };

  return (
    <div className="pb-16 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-indigo-800 to-indigo-950 text-white px-4 pt-6 pb-12 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {currentUser ? (
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-2xl text-white border border-white/20 shadow-inner">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">{currentUser.name}</h1>
                <p className="text-xs text-indigo-200 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                  {currentUser.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white uppercase tracking-wider">
                    {currentUser.user_type}
                  </span>
                  <span className="text-[11px] text-indigo-200">
                    {currentUser.city ? `📍 ${currentUser.city}` : 'India'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white border border-white/20">
                <UserIcon className="w-8 h-8 opacity-80" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Guest User</h1>
                <p className="text-xs text-indigo-200 mt-0.5">Sign in to manage rooms & visits</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Guest Mode
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons in Header */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenEdit}
                id="profile-edit-btn"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                title="Edit Profile"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={onLogout}
                id="profile-logout-btn"
                className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                id="header-guest-login-btn"
                className="px-3 py-1.5 rounded-xl bg-white text-indigo-900 text-xs font-bold shadow-sm hover:bg-indigo-50 transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
              <button
                onClick={onOpenSignUp}
                id="header-guest-signup-btn"
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold border border-indigo-400/40 transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 -mt-6 space-y-5">
        {/* Guest Banner if not logged in */}
        {!currentUser && (
          <div className="bg-white rounded-2xl p-5 border border-indigo-200 shadow-md space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-indigo-600" />
                  Log in or create an account
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Access saved rooms across devices, list accommodations, schedule in-person visits, and chat with verified owners.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                onClick={onOpenLogin}
                id="guest-banner-login-btn"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In to Account</span>
              </button>
              <button
                onClick={onOpenSignUp}
                id="guest-banner-signup-btn"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create New Account</span>
              </button>
            </div>
          </div>
        )}

        {/* User Role Switcher Card (when logged in) */}
        {currentUser && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">Current Role Mode</div>
              <div className="text-xs text-slate-500">
                {currentUser.user_type === 'student' 
                  ? 'Looking for rooms, hostels, & flatmates' 
                  : currentUser.user_type === 'owner'
                  ? 'Listing & managing student PG accommodations'
                  : 'Managing study lounge & commercial spaces'}
              </div>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => onUpdateUserType('student')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentUser.user_type === 'student'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => onUpdateUserType('owner')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentUser.user_type === 'owner'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Owner / PG
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div 
            onClick={onNavigateToSaved}
            className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center cursor-pointer hover:border-indigo-300 transition-colors shadow-xs"
          >
            <Heart className="w-5 h-5 text-rose-500 mx-auto mb-1" />
            <div className="text-lg font-extrabold text-slate-900">{favoritesCount}</div>
            <div className="text-[11px] text-slate-500">Saved Rooms</div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
            <Calendar className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
            <div className="text-lg font-extrabold text-slate-900">{scheduledVisits.length}</div>
            <div className="text-[11px] text-slate-500">Room Visits</div>
          </div>

          <div 
            onClick={onNavigateToPostProperty}
            className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center cursor-pointer hover:border-indigo-300 transition-colors shadow-xs"
          >
            <Building className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <div className="text-lg font-extrabold text-slate-900">{myProperties.length}</div>
            <div className="text-[11px] text-slate-500">My Listings</div>
          </div>
        </div>

        {/* Account Details Summary (when logged in) */}
        {currentUser && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <UserIcon className="w-4 h-4 text-indigo-600" />
                Profile Information
              </h3>
              <button
                onClick={handleOpenEdit}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Info
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px]">Mobile Phone</div>
                  <div className="font-bold text-slate-800">{currentUser.phone || 'Not provided'}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px]">Email Address</div>
                  <div className="font-bold text-slate-800 truncate">{currentUser.email}</div>
                </div>
              </div>

              {currentUser.city && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <div className="text-slate-400 text-[10px]">City / Hub</div>
                    <div className="font-bold text-slate-800">{currentUser.city}</div>
                  </div>
                </div>
              )}

              {currentUser.college_or_institute && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <div className="text-slate-400 text-[10px]">Institute / College</div>
                    <div className="font-bold text-slate-800 truncate">{currentUser.college_or_institute}</div>
                  </div>
                </div>
              )}

              {currentUser.business_name && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5 sm:col-span-2">
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <div className="text-slate-400 text-[10px]">Business / PG Brand</div>
                    <div className="font-bold text-slate-800">{currentUser.business_name}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scheduled Room Visits */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Scheduled Visits & Inquiries
            </h3>
            <span className="text-xs text-slate-500">{scheduledVisits.length} upcoming</span>
          </div>

          {scheduledVisits.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2">
              You haven't scheduled any room visits yet. Browse properties and tap "Schedule Visit".
            </p>
          ) : (
            <div className="space-y-2">
              {scheduledVisits.map((visit, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{visit.propertyTitle}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      📍 {visit.city} &bull; Date: {visit.date} at {visit.time}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Listed Properties */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-indigo-600" />
              My Listed Properties ({myProperties.length})
            </h3>
            <button
              onClick={onNavigateToPostProperty}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Room
            </button>
          </div>

          {myProperties.length === 0 ? (
            <div className="text-center py-5 space-y-2">
              <p className="text-xs text-slate-500">
                Are you a hostel owner or looking for a replacement roommate in your flat?
              </p>
              <button
                onClick={onNavigateToPostProperty}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Post Your Property
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {myProperties.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => onSelectProperty(prop)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-indigo-300 bg-slate-50 hover:bg-white flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img src={prop.images[0]} alt={prop.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{prop.title}</h4>
                      <p className="text-[11px] text-slate-500">{prop.area}, {prop.city} &bull; ₹{prop.rent}/mo</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      prop.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {prop.verified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Google Play Store Release & Installation Card */}
        {onOpenPlayStoreHub && (
          <div 
            onClick={onOpenPlayStoreHub}
            className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 to-indigo-950 text-white border border-indigo-800 shadow-md cursor-pointer hover:shadow-lg transition-all flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <img 
                src="/app-logo.png" 
                alt="Where is my room Logo" 
                className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-xs border border-white/20" 
                referrerPolicy="no-referrer" 
              />
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Google Play Store Release & APK Hub
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                    Ready
                  </span>
                </h4>
                <p className="text-[11px] text-indigo-200 mt-0.5">
                  Package .aab, Bubblewrap CLI setup, Digital Asset Links & Play Console submission
                </p>
              </div>
            </div>
            <button 
              className="px-3 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-xs font-bold text-white shrink-0 border border-indigo-500/40"
            >
              Open Hub
            </button>
          </div>
        )}

        {/* Safety & Verification Notice */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
            <Shield className="w-4 h-4 text-emerald-600" />
            Student Safety & Verification Guarantee
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            All verified accommodations on Where is my room are audited for fire exits, hygienic food mess, operational CCTV, and emergency doctor connectivity. Never transfer token money before inspecting the room.
          </p>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setIsEditingProfile(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-600" />
              Edit Profile Information
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Update your account details shown on property inquiries & listings.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / Region</label>
                <select
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Kota">Kota</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Pune">Pune</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Indore">Indore</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Patna">Patna</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
              </div>

              {currentUser?.user_type === 'student' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">College / Coaching Institute</label>
                  <input
                    type="text"
                    value={editCollege}
                    onChange={(e) => setEditCollege(e.target.value)}
                    placeholder="e.g. Allen Career Institute, IIT Delhi"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business / PG Brand Name</label>
                  <input
                    type="text"
                    value={editBusinessName}
                    onChange={(e) => setEditBusinessName(e.target.value)}
                    placeholder="e.g. Royal Star Hostels"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  {saveFeedback ? <Check className="w-4 h-4 text-white" /> : <span>Save Changes</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
