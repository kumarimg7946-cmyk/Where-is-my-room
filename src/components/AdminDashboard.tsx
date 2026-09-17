import React, { useState, useMemo } from 'react';
import { Property, PropertyType } from '../types';
import { 
  ShieldCheck, ShieldAlert, Check, X, Building, 
  Users, IndianRupee, MapPin, Eye, Trash2, 
  Filter, Search, AlertCircle, RefreshCw, BarChart3
} from 'lucide-react';

interface AdminDashboardProps {
  properties: Property[];
  onToggleVerify: (id: number) => void;
  onToggleAvailability: (id: number) => void;
  onDeleteProperty: (id: number) => void;
  onSelectProperty: (property: Property) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  properties,
  onToggleVerify,
  onToggleAvailability,
  onDeleteProperty,
  onSelectProperty
}) => {
  const [filterCity, setFilterCity] = useState('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterVerified, setFilterVerified] = useState<'All' | 'Verified' | 'Pending'>('All');
  const [adminSearch, setAdminSearch] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = properties.length;
    const verified = properties.filter(p => p.verified).length;
    const pending = total - verified;
    const totalRent = properties.reduce((acc, p) => acc + p.rent, 0);
    const avgRent = total > 0 ? Math.round(totalRent / total) : 0;
    const kotaCount = properties.filter(p => p.city.toLowerCase() === 'kota').length;
    const delhiCount = properties.filter(p => p.city.toLowerCase() === 'delhi').length;
    const jaipurCount = properties.filter(p => p.city.toLowerCase() === 'jaipur').length;
    const puneCount = properties.filter(p => p.city.toLowerCase() === 'pune').length;
    
    const pgCount = properties.filter(p => p.property_type === 'PG').length;
    const hostelCount = properties.filter(p => p.property_type === 'Hostel').length;
    const hotelCount = properties.filter(p => p.property_type === 'Hotel').length;
    const roomCount = properties.filter(p => p.property_type === 'Room').length;
    const loungeCount = properties.filter(p => p.property_type === 'Lounge').length;
    const flatCount = properties.filter(p => p.property_type === 'Flat').length;

    return { 
      total, verified, pending, avgRent, 
      kotaCount, delhiCount, jaipurCount, puneCount,
      pgCount, hostelCount, hotelCount, roomCount, loungeCount, flatCount
    };
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      if (filterCity !== 'All' && p.city.toLowerCase() !== filterCity.toLowerCase()) {
        return false;
      }
      if (filterType !== 'All' && p.property_type !== filterType) {
        return false;
      }
      if (filterVerified === 'Verified' && !p.verified) return false;
      if (filterVerified === 'Pending' && p.verified) return false;
      if (adminSearch.trim()) {
        const q = adminSearch.toLowerCase();
        return p.title.toLowerCase().includes(q) || 
               p.city.toLowerCase().includes(q) || 
               p.area.toLowerCase().includes(q) ||
               (p.owner_name && p.owner_name.toLowerCase().includes(q));
      }
      return true;
    });
  }, [properties, filterCity, filterType, filterVerified, adminSearch]);

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 2500);
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen pb-16">
      {/* Top Admin Navbar */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-md">
            AD
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Next.js Admin Console &bull; Where is my room
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                Production Database
              </span>
            </h1>
            <p className="text-xs text-slate-400">PostgreSQL Schema &bull; Property Moderation & Verification</p>
          </div>
        </div>

        {actionNotice && (
          <div className="bg-emerald-500 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-lg animate-fade-in flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            {actionNotice}
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-6 space-y-6">
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Accommodations</span>
              <Building className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{stats.total}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Active in 4 major student cities
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Verified Status</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {stats.verified} / {stats.total}
            </div>
            <div className="text-[11px] text-emerald-400/80 mt-1">
              {Math.round((stats.verified / (stats.total || 1)) * 100)}% Verified Listings
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Pending Moderation</span>
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 mt-1">{stats.pending}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Awaiting safety & facility audit
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Avg Student Rent</span>
              <IndianRupee className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              ₹{stats.avgRent.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Delhi: ₹12.8k &bull; Kota: ₹9.1k
            </div>
          </div>
        </div>

        {/* City and Category Breakdown Pills */}
        <div className="space-y-2">
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Listings by Category:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-lg">
                PG: <strong>{stats.pgCount}</strong>
              </span>
              <span className="px-2.5 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-lg">
                Hostel: <strong>{stats.hostelCount}</strong>
              </span>
              <span className="px-2.5 py-1 bg-sky-950 text-sky-300 border border-sky-800 rounded-lg">
                Hotel: <strong>{stats.hotelCount}</strong>
              </span>
              <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg">
                Room: <strong>{stats.roomCount}</strong>
              </span>
              <span className="px-2.5 py-1 bg-rose-950 text-rose-300 border border-rose-800 rounded-lg">
                Lounge: <strong>{stats.loungeCount}</strong>
              </span>
              <span className="px-2.5 py-1 bg-purple-950 text-purple-300 border border-purple-800 rounded-lg">
                Flat: <strong>{stats.flatCount}</strong>
              </span>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/80 p-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-400">Listings by City:</span>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-0.5 bg-slate-700/80 rounded-md text-slate-300 text-[11px]">
                Kota: <strong>{stats.kotaCount}</strong>
              </span>
              <span className="px-2 py-0.5 bg-slate-700/80 rounded-md text-slate-300 text-[11px]">
                Delhi: <strong>{stats.delhiCount}</strong>
              </span>
              <span className="px-2 py-0.5 bg-slate-700/80 rounded-md text-slate-300 text-[11px]">
                Jaipur: <strong>{stats.jaipurCount}</strong>
              </span>
              <span className="px-2 py-0.5 bg-slate-700/80 rounded-md text-slate-300 text-[11px]">
                Pune: <strong>{stats.puneCount}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Search title, owner, area..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="PG">PG</option>
              <option value="Hostel">Hostel</option>
              <option value="Hotel">Hotel</option>
              <option value="Room">Room</option>
              <option value="Lounge">Lounge</option>
              <option value="Flat">Flat</option>
            </select>

            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="All">All Cities</option>
              <option value="Kota">Kota</option>
              <option value="Delhi">Delhi</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Pune">Pune</option>
            </select>

            <select
              value={filterVerified}
              onChange={(e) => setFilterVerified(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="All">All Verification</option>
              <option value="Verified">Verified Only</option>
              <option value="Pending">Pending Audit</option>
            </select>
          </div>
        </div>

        {/* Property Moderation Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              Properties Management ({filteredProperties.length})
            </h3>
            <span className="text-xs text-slate-400">Click actions to verify or toggle availability</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/70 text-slate-400 font-semibold border-b border-slate-700 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Property & Location</th>
                  <th className="px-4 py-3">Type / Gender</th>
                  <th className="px-4 py-3">Monthly Rent</th>
                  <th className="px-4 py-3">Owner Contact</th>
                  <th className="px-4 py-3">Verification Badge</th>
                  <th className="px-4 py-3">Availability</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">
                      No properties found matching admin filters.
                    </td>
                  </tr>
                ) : (
                  filteredProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <img 
                            src={prop.images[0]} 
                            alt={prop.title} 
                            className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0" 
                          />
                          <div>
                            <div className="font-bold text-white hover:text-indigo-400 cursor-pointer line-clamp-1" onClick={() => onSelectProperty(prop)}>
                              {prop.title}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-indigo-400" />
                              {prop.area}, {prop.city}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-900 font-semibold text-indigo-300 text-[11px]">
                          {prop.property_type}
                        </span>
                        <span className="ml-1.5 text-slate-400 text-[11px]">
                          {prop.gender}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-bold text-white">
                        ₹{prop.rent.toLocaleString('en-IN')}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="text-slate-200 font-medium">{prop.owner_name || 'Hostel Warden'}</div>
                        <div className="text-[11px] text-slate-400">{prop.owner_phone || '+91 98290 12345'}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => {
                            onToggleVerify(prop.id);
                            triggerNotice(prop.verified ? `Property #${prop.id} unverified` : `Property #${prop.id} verified with badge!`);
                          }}
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] flex items-center gap-1 transition-all ${
                            prop.verified 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30' 
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                          }`}
                        >
                          {prop.verified ? (
                            <>
                              <ShieldCheck className="w-3 h-3" />
                              Verified
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="w-3 h-3" />
                              Pending
                            </>
                          )}
                        </button>
                      </td>

                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => {
                            onToggleAvailability(prop.id);
                            triggerNotice(`Property #${prop.id} status updated`);
                          }}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                            prop.available
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {prop.available ? 'Available' : 'Booked'}
                        </button>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectProperty(prop)}
                            title="View Property Details"
                            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              onDeleteProperty(prop.id);
                              triggerNotice(`Property #${prop.id} removed`);
                            }}
                            title="Delete Listing"
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
