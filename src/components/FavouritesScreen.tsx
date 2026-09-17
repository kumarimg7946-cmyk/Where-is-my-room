import React from 'react';
import { Property, PropertyType } from '../types';
import { Heart, MapPin, Trash2, ArrowRight, ShieldCheck, Search } from 'lucide-react';

interface FavouritesScreenProps {
  properties: Property[];
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onSelectProperty: (property: Property) => void;
  onExplore: () => void;
}

export const FavouritesScreen: React.FC<FavouritesScreenProps> = ({
  properties,
  favorites,
  onToggleFavorite,
  onSelectProperty,
  onExplore,
}) => {
  const favoriteProperties = properties.filter(p => favorites.includes(p.id));

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

  return (
    <div className="pb-16 bg-slate-50 min-h-screen text-slate-800">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Saved Rooms</h1>
            <p className="text-xs text-slate-500">Compare shortlisted PGs, hostels & flats</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-50 text-rose-600 border border-rose-200">
            {favoriteProperties.length} Saved
          </span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-5">
        {favoriteProperties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4 my-8 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <Heart className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">No saved accommodations yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tap the heart icon on any PG, hostel or room card to shortlist it and compare prices.
              </p>
            </div>
            <button
              id="explore-from-favs-btn"
              onClick={onExplore}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
            >
              <Search className="w-4 h-4" />
              Explore Student Rooms
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favoriteProperties.map((prop) => (
              <div
                key={prop.id}
                id={`fav-card-${prop.id}`}
                onClick={() => onSelectProperty(prop)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col group relative"
              >
                <div className="relative h-44 w-full bg-slate-100">
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

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(prop.id);
                    }}
                    title="Remove from saved"
                    className="absolute top-3 right-3 p-2 rounded-full bg-white text-rose-500 hover:bg-rose-50 shadow-sm transition-transform active:scale-90"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-indigo-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {prop.area}, {prop.city}
                      </span>
                      {prop.verified && (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {prop.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {prop.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                    <div>
                      <div className="text-[10px] text-slate-400">Monthly Rent</div>
                      <div className="text-base font-bold text-indigo-700">
                        ₹{prop.rent.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-slate-500">/mo</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                      View Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
