import React, { useState } from 'react';
import { Property, PropertyType, Review, PaymentRecord } from '../types';
import { PaymentModal } from './PaymentModal';
import { 
  X, MapPin, ShieldCheck, Heart, Phone, MessageSquare, 
  Wifi, Utensils, Wind, Shirt, Bath, Clock, Zap, Star, 
  Calendar, Check, Send, User, ChevronLeft, ChevronRight,
  Share2, IndianRupee, QrCode, Sparkles
} from 'lucide-react';

interface PropertyDetailsModalProps {
  property: Property | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  reviews: Review[];
  onAddReview: (propertyId: number, rating: number, comment: string) => void;
  onScheduleVisit: (property: Property, date: string, time: string, studentName: string, studentPhone: string) => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  onClose,
  isFavorite,
  onToggleFavorite,
  reviews,
  onAddReview,
  onScheduleVisit,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitDate, setVisitDate] = useState('2026-03-01');
  const [visitTime, setVisitTime] = useState('11:00 AM');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitScheduledSuccess, setVisitScheduledSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBookingPaymentOpen, setIsBookingPaymentOpen] = useState(false);
  const [bookingPaidRecord, setBookingPaidRecord] = useState<PaymentRecord | null>(null);

  if (!property) return null;

  const propertyReviews = reviews.filter(r => r.property_id === property.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddReview(property.id, newRating, newComment);
    setNewComment('');
  };

  const handleConfirmVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorPhone) return;
    onScheduleVisit(property, visitDate, visitTime, visitorName, visitorPhone);
    setVisitScheduledSuccess(true);
    setTimeout(() => {
      setVisitScheduledSuccess(false);
      setShowVisitModal(false);
    }, 1800);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi! I saw your room "${property.title}" on Where is my room (${property.city}, ₹${property.rent}/mo). Is it currently available for visit?`
    );
    const phone = property.owner_phone ? property.owner_phone.replace(/[^0-9]/g, '') : '919829012345';
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleCall = () => {
    if (property.owner_phone) {
      window.location.href = `tel:${property.owner_phone.replace(/\s+/g, '')}`;
    }
  };

  const getCategoryBadgeClass = (type: PropertyType) => {
    switch (type) {
      case 'PG': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Hostel': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Hotel': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Room': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Lounge': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Flat': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div id="property-details-modal-overlay" className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div 
        id="property-details-card" 
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Header Controls */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getCategoryBadgeClass(property.property_type)}`}>
              {property.property_type}
            </span>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
              property.gender === 'Girls' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
              property.gender === 'Boys' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
              'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {property.gender}
            </span>
            {property.verified && (
              <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="share-property-btn"
              onClick={handleShare}
              title="Share listing"
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              id="toggle-fav-modal-btn"
              onClick={() => onToggleFavorite(property.id)}
              className={`p-2 rounded-full transition-colors ${
                isFavorite ? 'text-rose-500 bg-rose-50' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              id="close-property-details-btn"
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Photos Carousel */}
          <div className="relative h-64 sm:h-72 w-full bg-slate-100 overflow-hidden">
            <img
              src={property.images[activeImageIndex] || property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {property.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : property.images.length - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev < property.images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {property.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === activeImageIndex ? 'bg-white w-5' : 'bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="absolute top-3 left-3 bg-indigo-900/85 text-white text-xs px-2.5 py-1 rounded-md font-medium backdrop-blur-xs">
              Photo {activeImageIndex + 1} of {property.images.length}
            </div>
          </div>

          <div className="p-5 space-y-6">
            {/* Title & Price Header */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {property.title}
                </h1>
                <div className="text-left sm:text-right shrink-0">
                  <div className="text-2xl font-extrabold text-indigo-700">
                    ₹{property.rent.toLocaleString('en-IN')}
                    <span className="text-sm font-normal text-slate-500"> / month</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Security Deposit: ₹{property.security_deposit.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-slate-600 text-sm">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{property.area}, {property.city}{property.state ? `, ${property.state}` : ''}</span>
                </div>
                {property.is_capital && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    🏛️ State Capital
                  </span>
                )}
                {property.application_fee_paid && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> ₹100 Fee Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 pl-5.5">
                {property.address}
              </p>
            </div>

            {/* Category Specific Feature Highlights */}
            {property.category_details && (
              <div className="p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2">
                <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{property.property_type} Specific Highlights:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {property.category_details.furnishing_status && (
                    <div className="bg-white p-2 rounded-xl border border-indigo-100/70">
                      <span className="text-[10px] text-slate-400 block">Furnishing</span>
                      <strong className="text-slate-800">{property.category_details.furnishing_status}</strong>
                    </div>
                  )}
                  {property.category_details.room_size_sqft && (
                    <div className="bg-white p-2 rounded-xl border border-indigo-100/70">
                      <span className="text-[10px] text-slate-400 block">Room Size</span>
                      <strong className="text-slate-800">{property.category_details.room_size_sqft} sq.ft</strong>
                    </div>
                  )}
                  {property.category_details.food_type && (
                    <div className="bg-white p-2 rounded-xl border border-indigo-100/70">
                      <span className="text-[10px] text-slate-400 block">Diet / Mess</span>
                      <strong className="text-slate-800">{property.category_details.food_type}</strong>
                    </div>
                  )}
                  {property.category_details.sharing_capacity && (
                    <div className="bg-white p-2 rounded-xl border border-indigo-100/70">
                      <span className="text-[10px] text-slate-400 block">Room Capacity</span>
                      <strong className="text-slate-800">{property.category_details.sharing_capacity}</strong>
                    </div>
                  )}
                  {property.category_details.daily_tariff && (
                    <div className="bg-white p-2 rounded-xl border border-indigo-100/70">
                      <span className="text-[10px] text-slate-400 block">Daily Tariff</span>
                      <strong className="text-slate-800">₹{property.category_details.daily_tariff}/day</strong>
                    </div>
                  )}
                  {property.category_details.operating_hours && (
                    <div className="bg-white p-2 rounded-xl border border-indigo-100/70">
                      <span className="text-[10px] text-slate-400 block">Operating Hours</span>
                      <strong className="text-slate-800">{property.category_details.operating_hours}</strong>
                    </div>
                  )}
                  {property.category_details.internet_speed_mbps && (
                    <div className="bg-white p-2 rounded-xl border border-indigo-100/70">
                      <span className="text-[10px] text-slate-400 block">Wi-Fi Speed</span>
                      <strong className="text-slate-800">{property.category_details.internet_speed_mbps} Mbps Fiber</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Key Quick Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-center p-2 bg-white rounded-lg border border-slate-100">
                <div className="text-xs text-slate-400">Available From</div>
                <div className="text-sm font-semibold text-slate-800 mt-0.5">{property.available_from}</div>
              </div>
              <div className="text-center p-2 bg-white rounded-lg border border-slate-100">
                <div className="text-xs text-slate-400">Sharing</div>
                <div className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{property.sharing_options || 'Twin / Single'}</div>
              </div>
              <div className="text-center p-2 bg-white rounded-lg border border-slate-100">
                <div className="text-xs text-slate-400">Curfew Time</div>
                <div className="text-sm font-semibold text-slate-800 mt-0.5">{property.curfew_time || '10:00 PM'}</div>
              </div>
              <div className="text-center p-2 bg-white rounded-lg border border-slate-100">
                <div className="text-xs text-slate-400">Electricity</div>
                <div className="text-sm font-semibold text-slate-800 mt-0.5">{property.electricity_charges || 'Sub-meter'}</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities Section */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Student Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-sm ${
                  property.food_available ? 'bg-indigo-50/50 border-indigo-100 text-indigo-900' : 'bg-slate-50 border-slate-100 text-slate-400 line-through'
                }`}>
                  <Utensils className={`w-4 h-4 ${property.food_available ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>Mess / Food Included</span>
                </div>

                <div className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-sm ${
                  property.wifi ? 'bg-indigo-50/50 border-indigo-100 text-indigo-900' : 'bg-slate-50 border-slate-100 text-slate-400 line-through'
                }`}>
                  <Wifi className={`w-4 h-4 ${property.wifi ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>High-Speed Wi-Fi</span>
                </div>

                <div className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-sm ${
                  property.ac ? 'bg-indigo-50/50 border-indigo-100 text-indigo-900' : 'bg-slate-50 border-slate-100 text-slate-400 line-through'
                }`}>
                  <Wind className={`w-4 h-4 ${property.ac ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>Air Conditioning (AC)</span>
                </div>

                <div className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-sm ${
                  property.laundry ? 'bg-indigo-50/50 border-indigo-100 text-indigo-900' : 'bg-slate-50 border-slate-100 text-slate-400 line-through'
                }`}>
                  <Shirt className={`w-4 h-4 ${property.laundry ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>Laundry Service</span>
                </div>

                <div className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-sm ${
                  property.attached_bathroom ? 'bg-indigo-50/50 border-indigo-100 text-indigo-900' : 'bg-slate-50 border-slate-100 text-slate-400 line-through'
                }`}>
                  <Bath className={`w-4 h-4 ${property.attached_bathroom ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>Attached Bathroom</span>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-indigo-100 bg-indigo-50/50 text-indigo-900 text-sm">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Curfew: {property.curfew_time || '10 PM'}</span>
                </div>
              </div>
            </div>

            {/* Nearby Coaching Institutes & Colleges */}
            {property.nearby_institutes && property.nearby_institutes.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2.5">
                  Colleges & Coaching Centres Nearby
                </h3>
                <div className="flex flex-wrap gap-2">
                  {property.nearby_institutes.map((inst, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium"
                    >
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                      {inst}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Owner Details Card */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  {property.owner_name ? property.owner_name.charAt(0) : 'O'}
                </div>
                <div>
                  <div className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Property Owner / Manager</div>
                  <div className="font-bold text-slate-900 text-sm">{property.owner_name || 'Hostel Warden / Owner'}</div>
                  <div className="text-xs text-slate-500">{property.owner_phone || '+91 98290 12345'}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  id="whatsapp-owner-btn"
                  onClick={handleWhatsApp}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp
                </button>
                <button
                  id="call-owner-btn"
                  onClick={handleCall}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call
                </button>
              </div>
            </div>

            {/* Student Reviews & Feedback */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Student Reviews & Ratings</h3>
                  <p className="text-xs text-slate-500">From verified residents and student visitors</p>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{property.rating || 4.5}</span>
                  <span className="text-xs font-normal text-slate-500">({propertyReviews.length})</span>
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-3 mb-5">
                {propertyReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No reviews yet for this property. Be the first student to leave a review!</p>
                ) : (
                  propertyReviews.map((rev) => (
                    <div key={rev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-slate-800">{rev.user_name}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{rev.review}</p>
                      <div className="text-[10px] text-slate-400 mt-1">{rev.created_at}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleReviewSubmit} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                <div className="text-xs font-bold text-slate-700">Write a Review as Student</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setNewRating(num)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-4 h-4 ${num <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share feedback on cleanliness, mess food quality, WiFi speed, study environment..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  rows={2}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Booking Action Bar */}
        <div className="sticky bottom-0 z-20 px-5 py-3.5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-lg">
          <div>
            <div className="text-xs text-slate-400">Total Monthly Rent</div>
            <div className="text-lg font-bold text-indigo-900">
              ₹{property.rent.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-500"> / mo</span>
            </div>
            {bookingPaidRecord && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5">
                <Check className="w-3 h-3" /> Token Paid (TXN: {bookingPaidRecord.transaction_id})
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="schedule-visit-btn"
              onClick={() => setShowVisitModal(true)}
              className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              Schedule Visit
            </button>
            
            <button
              id="book-pay-token-btn"
              onClick={() => setIsBookingPaymentOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <QrCode className="w-3.5 h-3.5" />
              Book & Pay Token (₹1,000)
            </button>

            <button
              id="contact-owner-primary-btn"
              onClick={handleWhatsApp}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Contact
            </button>
          </div>
        </div>

        {/* Student Token Payment Gateway Modal */}
        <PaymentModal
          isOpen={isBookingPaymentOpen}
          onClose={() => setIsBookingPaymentOpen(false)}
          title="Reserve Accommodation Token"
          subtitle={`Hold reservation for ${property.title}`}
          amount={1000}
          paymentType="student_booking_token"
          propertyId={property.id}
          propertyTitle={property.title}
          payerName={visitorName || "Student Resident"}
          payerPhone={visitorPhone || "+91 97112 34567"}
          onPaymentSuccess={(rec) => {
            setBookingPaidRecord(rec);
          }}
        />

        {/* Schedule Visit Modal Popup */}
        {showVisitModal && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Schedule Room Visit</h4>
                <button 
                  onClick={() => setShowVisitModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {visitScheduledSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div className="text-xs font-bold text-emerald-900">Visit Scheduled!</div>
                  <p className="text-[11px] text-emerald-700">
                    The owner will contact you on WhatsApp with the landmark & room keys.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConfirmVisit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Mobile / WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Visit Date</label>
                      <input
                        type="date"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Preferred Time</label>
                      <select
                        value={visitTime}
                        onChange={(e) => setVisitTime(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-lg"
                      >
                        <option>10:00 AM</option>
                        <option>12:00 PM</option>
                        <option>02:00 PM</option>
                        <option>04:00 PM</option>
                        <option>06:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowVisitModal(false)}
                      className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
                    >
                      Confirm Visit
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {copiedLink && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-full shadow-lg z-50 animate-fade-in">
            Link copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
};
