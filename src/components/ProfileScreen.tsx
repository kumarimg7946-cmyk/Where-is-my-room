import React, { useState } from 'react';
import { User, Property } from '../types';
import { 
  User as UserIcon, Phone, Mail, Shield, 
  Building, Calendar, Heart, PlusCircle, CheckCircle, 
  ExternalLink, Bell, Settings, LogOut
} from 'lucide-react';

interface ProfileScreenProps {
  currentUser: User;
  onUpdateUserType: (type: 'student' | 'owner') => void;
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
  properties,
  favoritesCount,
  scheduledVisits,
  onNavigateToPostProperty,
  onNavigateToSaved,
  onSelectProperty,
  onOpenPlayStoreHub
}) => {
  const [targetCity, setTargetCity] = useState('Kota');
  const [collegeName, setCollegeName] = useState('Allen Coaching Hub / IIT Delhi');

  const myProperties = properties.filter(p => p.owner_id === currentUser.id);

  return (
    <div className="pb-16 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Header */}
      <div className="bg-indigo-700 text-white px-4 pt-6 pb-12 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-2xl text-white border border-white/20">
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
                  Joined Feb 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 -mt-6 space-y-5">
        {/* User Role Switcher Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-900">Current Role Mode</div>
            <div className="text-xs text-slate-500">
              {currentUser.user_type === 'student' 
                ? 'Looking for rooms, hostels, & flatmates' 
                : 'Listing & managing student PG accommodations'}
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

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div 
            onClick={onNavigateToSaved}
            className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center cursor-pointer hover:border-indigo-300 transition-colors"
          >
            <Heart className="w-5 h-5 text-rose-500 mx-auto mb-1" />
            <div className="text-lg font-extrabold text-slate-900">{favoritesCount}</div>
            <div className="text-[11px] text-slate-500">Saved Rooms</div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center">
            <Calendar className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
            <div className="text-lg font-extrabold text-slate-900">{scheduledVisits.length}</div>
            <div className="text-[11px] text-slate-500">Room Visits</div>
          </div>

          <div 
            onClick={onNavigateToPostProperty}
            className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center cursor-pointer hover:border-indigo-300 transition-colors"
          >
            <Building className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <div className="text-lg font-extrabold text-slate-900">{myProperties.length}</div>
            <div className="text-[11px] text-slate-500">My Listings</div>
          </div>
        </div>

        {/* Scheduled Room Visits */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
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

        {/* My Listed Properties (if owner or listings exist) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
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
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 font-black text-xs text-white">
                WIMR
              </div>
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
    </div>
  );
};
