import React, { useState, useMemo } from 'react';
import { 
  Property, PropertyType, GenderPreference, User, UserType, 
  Review, PaymentRecord, ScheduledVisit, PaymentMode 
} from '../types';
import { 
  ShieldCheck, ShieldAlert, Check, X, Building, 
  Users, IndianRupee, MapPin, Eye, Trash2, 
  Filter, Search, AlertCircle, RefreshCw, BarChart3,
  Plus, Edit, Download, Upload, Copy, ExternalLink,
  Calendar, Star, Phone, Mail, CheckCircle2, FileText,
  Database, ArrowUpRight, Clock, Tag, Smartphone,
  Layers, ChevronRight, Sparkles, CheckSquare, Save
} from 'lucide-react';

export interface AdminDashboardProps {
  properties: Property[];
  onUpdateProperty: (property: Property) => void;
  onAddProperty: (property: Omit<Property, 'id' | 'created_at'>) => void;
  onToggleVerify: (id: number) => void;
  onToggleAvailability: (id: number) => void;
  onDeleteProperty: (id: number) => void;
  onSelectProperty: (property: Property) => void;
  
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'created_at'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: number) => void;

  scheduledVisits: ScheduledVisit[];
  onAddVisit: (visit: Omit<ScheduledVisit, 'id' | 'created_at'>) => void;
  onUpdateVisitStatus: (visitId: string | number, status: ScheduledVisit['status']) => void;
  onDeleteVisit: (visitId: string | number) => void;

  payments: PaymentRecord[];
  onAddPayment: (payment: PaymentRecord) => void;
  onDeletePayment: (paymentId: string) => void;

  reviews: Review[];
  onDeleteReview: (reviewId: number) => void;

  onRestoreAllData: (data: {
    properties?: Property[];
    users?: User[];
    scheduledVisits?: ScheduledVisit[];
    payments?: PaymentRecord[];
    reviews?: Review[];
  }) => void;
  onResetAllData: () => void;
  onOpenPlayStoreHub?: () => void;
}

type AdminTab = 'overview' | 'properties' | 'users' | 'visits' | 'payments' | 'reviews' | 'backup';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  properties,
  onUpdateProperty,
  onAddProperty,
  onToggleVerify,
  onToggleAvailability,
  onDeleteProperty,
  onSelectProperty,
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  scheduledVisits,
  onAddVisit,
  onUpdateVisitStatus,
  onDeleteVisit,
  payments,
  onAddPayment,
  onDeletePayment,
  reviews,
  onDeleteReview,
  onRestoreAllData,
  onResetAllData,
  onOpenPlayStoreHub
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Notifications
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // -------------------------------------------------------------
  // Filter States
  // -------------------------------------------------------------
  // Property filters
  const [filterCity, setFilterCity] = useState('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterVerified, setFilterVerified] = useState<'All' | 'Verified' | 'Pending'>('All');
  const [propertySearch, setPropertySearch] = useState('');

  // User filters
  const [userRoleFilter, setUserRoleFilter] = useState<'All' | UserType>('All');
  const [userSearch, setUserSearch] = useState('');

  // Visit filters
  const [visitStatusFilter, setVisitStatusFilter] = useState<'All' | ScheduledVisit['status']>('All');
  const [visitSearch, setVisitSearch] = useState('');

  // Payment filters
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<'All' | PaymentRecord['payment_type']>('All');
  const [paymentSearch, setPaymentSearch] = useState('');

  // Review filters
  const [reviewRatingFilter, setReviewRatingFilter] = useState<'All' | '5' | '4' | 'low'>('All');

  // -------------------------------------------------------------
  // Modal States
  // -------------------------------------------------------------
  // Property Add/Edit Modal
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [propForm, setPropForm] = useState({
    title: '',
    property_type: 'PG' as PropertyType,
    city: 'Kota',
    area: 'Landmark City',
    address: 'Near Allen Samyak',
    rent: 9500,
    security_deposit: 9500,
    gender: 'Boys' as GenderPreference,
    owner_name: 'Rajesh Kumar',
    owner_phone: '+91 98290 12345',
    retailer_business_name: "Premier Stays Hub",
    description: 'Spacious student accommodation with study table, high speed wifi and hygienic mess.',
    wifi: true,
    ac: true,
    food_available: true,
    laundry: true,
    attached_bathroom: true,
    verified: true,
    available: true,
    sharing_options: 'Single & Double Sharing',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
  });

  // User Add/Edit Modal
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    user_type: 'student' as UserType,
    password: 'password123',
    city: 'Kota',
    college_or_institute: '',
    business_name: '',
    gst_number: ''
  });

  // Visit Add Modal
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [visitForm, setVisitForm] = useState({
    property_id: properties[0]?.id || 101,
    property_title: properties[0]?.title || 'Allen Coaching Hub Boys PG',
    city: 'Kota',
    date: '2026-03-10',
    time: '11:00 AM',
    student_name: '',
    student_phone: '',
    notes: 'Parent visit scheduled'
  });

  // Manual Payment Add Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: 100,
    payment_type: 'retailer_application_fee' as PaymentRecord['payment_type'],
    payer_name: '',
    payer_phone: '',
    payer_email: '',
    payment_mode: 'UPI' as PaymentMode,
    transaction_id: `TXN-ADM-${Date.now().toString().slice(-6)}`,
    property_title: properties[0]?.title || '',
    notes: 'Verified offline transaction'
  });

  // Backup import state
  const [jsonImportText, setJsonImportText] = useState('');
  const [copiedBackup, setCopiedBackup] = useState(false);

  // -------------------------------------------------------------
  // Computed Analytics
  // -------------------------------------------------------------
  const stats = useMemo(() => {
    const totalListings = properties.length;
    const verifiedListings = properties.filter(p => p.verified).length;
    const pendingListings = totalListings - verifiedListings;
    const availableListings = properties.filter(p => p.available).length;
    const totalRent = properties.reduce((acc, p) => acc + p.rent, 0);
    const avgRent = totalListings > 0 ? Math.round(totalRent / totalListings) : 0;

    // Users
    const totalUsers = users.length;
    const studentCount = users.filter(u => u.user_type === 'student').length;
    const ownerCount = users.filter(u => u.user_type === 'owner' || u.user_type === 'retailer').length;
    const adminCount = users.filter(u => u.user_type === 'admin').length;

    // Revenue
    const totalRevenue = payments.reduce((acc, p) => p.status === 'SUCCESS' ? acc + p.amount : acc, 0);
    const listingFeesRevenue = payments
      .filter(p => p.payment_type === 'retailer_application_fee' && p.status === 'SUCCESS')
      .reduce((acc, p) => acc + p.amount, 0);
    const tokenDepositRevenue = payments
      .filter(p => p.payment_type !== 'retailer_application_fee' && p.status === 'SUCCESS')
      .reduce((acc, p) => acc + p.amount, 0);

    // City Breakdown
    const cityCounts: Record<string, number> = {};
    properties.forEach(p => {
      const c = p.city;
      cityCounts[c] = (cityCounts[c] || 0) + 1;
    });

    // Category Breakdown
    const typeCounts: Record<string, number> = {
      PG: 0, Hostel: 0, Hotel: 0, Room: 0, Lounge: 0, Flat: 0
    };
    properties.forEach(p => {
      if (typeCounts[p.property_type] !== undefined) {
        typeCounts[p.property_type]++;
      }
    });

    // Visits
    const totalVisits = scheduledVisits.length;
    const pendingVisits = scheduledVisits.filter(v => v.status === 'Pending').length;
    const confirmedVisits = scheduledVisits.filter(v => v.status === 'Confirmed').length;

    return {
      totalListings,
      verifiedListings,
      pendingListings,
      availableListings,
      avgRent,
      totalUsers,
      studentCount,
      ownerCount,
      adminCount,
      totalRevenue,
      listingFeesRevenue,
      tokenDepositRevenue,
      cityCounts,
      typeCounts,
      totalVisits,
      pendingVisits,
      confirmedVisits,
      totalReviews: reviews.length
    };
  }, [properties, users, payments, scheduledVisits, reviews]);

  // -------------------------------------------------------------
  // Filtered Lists
  // -------------------------------------------------------------
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      if (filterCity !== 'All' && p.city.toLowerCase() !== filterCity.toLowerCase()) return false;
      if (filterType !== 'All' && p.property_type !== filterType) return false;
      if (filterVerified === 'Verified' && !p.verified) return false;
      if (filterVerified === 'Pending' && p.verified) return false;
      if (propertySearch.trim()) {
        const q = propertySearch.toLowerCase();
        return p.title.toLowerCase().includes(q) || 
               p.city.toLowerCase().includes(q) || 
               p.area.toLowerCase().includes(q) ||
               (p.owner_name && p.owner_name.toLowerCase().includes(q));
      }
      return true;
    });
  }, [properties, filterCity, filterType, filterVerified, propertySearch]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (userRoleFilter !== 'All' && u.user_type !== userRoleFilter) return false;
      if (userSearch.trim()) {
        const q = userSearch.toLowerCase();
        return u.name.toLowerCase().includes(q) || 
               u.email.toLowerCase().includes(q) || 
               u.phone.includes(q) ||
               (u.city && u.city.toLowerCase().includes(q));
      }
      return true;
    });
  }, [users, userRoleFilter, userSearch]);

  const filteredVisits = useMemo(() => {
    return scheduledVisits.filter(v => {
      if (visitStatusFilter !== 'All' && v.status !== visitStatusFilter) return false;
      if (visitSearch.trim()) {
        const q = visitSearch.toLowerCase();
        const title = v.property_title || v.propertyTitle || '';
        const name = v.student_name || '';
        return title.toLowerCase().includes(q) || 
               name.toLowerCase().includes(q) || 
               v.city.toLowerCase().includes(q);
      }
      return true;
    });
  }, [scheduledVisits, visitStatusFilter, visitSearch]);

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      if (paymentTypeFilter !== 'All' && p.payment_type !== paymentTypeFilter) return false;
      if (paymentSearch.trim()) {
        const q = paymentSearch.toLowerCase();
        return p.payer_name.toLowerCase().includes(q) || 
               p.transaction_id.toLowerCase().includes(q) ||
               (p.property_title && p.property_title.toLowerCase().includes(q));
      }
      return true;
    });
  }, [payments, paymentTypeFilter, paymentSearch]);

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      if (reviewRatingFilter === '5' && r.rating !== 5) return false;
      if (reviewRatingFilter === '4' && r.rating !== 4) return false;
      if (reviewRatingFilter === 'low' && r.rating > 3) return false;
      return true;
    });
  }, [reviews, reviewRatingFilter]);

  // -------------------------------------------------------------
  // Property Actions
  // -------------------------------------------------------------
  const handleOpenAddProperty = () => {
    setEditingProperty(null);
    setPropForm({
      title: '',
      property_type: 'PG',
      city: 'Kota',
      area: 'Landmark City',
      address: 'Near Allen Career Institute',
      rent: 9000,
      security_deposit: 9000,
      gender: 'Boys',
      owner_name: 'Verified Host',
      owner_phone: '+91 98290 12345',
      retailer_business_name: 'Student Residency Hub',
      description: 'Fully furnished, high speed wifi, CCTV security, biometric attendance, study table, and 3-time pure veg home food.',
      wifi: true,
      ac: true,
      food_available: true,
      laundry: true,
      attached_bathroom: true,
      verified: true,
      available: true,
      sharing_options: 'Single & Double Sharing',
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
    });
    setIsPropertyModalOpen(true);
  };

  const handleOpenEditProperty = (prop: Property) => {
    setEditingProperty(prop);
    setPropForm({
      title: prop.title,
      property_type: prop.property_type,
      city: prop.city,
      area: prop.area,
      address: prop.address,
      rent: prop.rent,
      security_deposit: prop.security_deposit,
      gender: prop.gender,
      owner_name: prop.owner_name || '',
      owner_phone: prop.owner_phone || '',
      retailer_business_name: prop.retailer_business_name || '',
      description: prop.description,
      wifi: prop.wifi,
      ac: prop.ac,
      food_available: prop.food_available,
      laundry: prop.laundry,
      attached_bathroom: prop.attached_bathroom,
      verified: prop.verified,
      available: prop.available,
      sharing_options: prop.sharing_options || 'Single / Double',
      imageUrl: prop.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
    });
    setIsPropertyModalOpen(true);
  };

  const handleSavePropertyForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propForm.title || !propForm.area || !propForm.rent) {
      alert('Please fill in title, area and rent amount.');
      return;
    }

    if (editingProperty) {
      // Update
      const updated: Property = {
        ...editingProperty,
        title: propForm.title,
        property_type: propForm.property_type,
        city: propForm.city,
        area: propForm.area,
        address: propForm.address,
        rent: Number(propForm.rent),
        security_deposit: Number(propForm.security_deposit),
        gender: propForm.gender,
        owner_name: propForm.owner_name,
        owner_phone: propForm.owner_phone,
        retailer_business_name: propForm.retailer_business_name,
        description: propForm.description,
        wifi: propForm.wifi,
        ac: propForm.ac,
        food_available: propForm.food_available,
        laundry: propForm.laundry,
        attached_bathroom: propForm.attached_bathroom,
        verified: propForm.verified,
        available: propForm.available,
        sharing_options: propForm.sharing_options,
        images: [propForm.imageUrl, ...(editingProperty.images.slice(1))]
      };
      onUpdateProperty(updated);
      triggerNotice(`Property #${editingProperty.id} updated and saved!`);
    } else {
      // Create new
      onAddProperty({
        owner_id: 1,
        title: propForm.title,
        property_type: propForm.property_type,
        city: propForm.city,
        area: propForm.area,
        address: propForm.address,
        latitude: 25.1388,
        longitude: 75.8362,
        rent: Number(propForm.rent),
        security_deposit: Number(propForm.security_deposit),
        available_from: new Date().toISOString().split('T')[0],
        gender: propForm.gender,
        owner_name: propForm.owner_name,
        owner_phone: propForm.owner_phone,
        retailer_business_name: propForm.retailer_business_name,
        description: propForm.description,
        wifi: propForm.wifi,
        ac: propForm.ac,
        food_available: propForm.food_available,
        laundry: propForm.laundry,
        attached_bathroom: propForm.attached_bathroom,
        verified: propForm.verified,
        available: propForm.available,
        sharing_options: propForm.sharing_options,
        images: [propForm.imageUrl]
      });
      triggerNotice('New property created and saved to database!');
    }

    setIsPropertyModalOpen(false);
  };

  // -------------------------------------------------------------
  // User Actions
  // -------------------------------------------------------------
  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      phone: '',
      user_type: 'student',
      password: 'password123',
      city: 'Kota',
      college_or_institute: 'Allen Career Institute',
      business_name: '',
      gst_number: ''
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (u: User) => {
    setEditingUser(u);
    setUserForm({
      name: u.name,
      email: u.email,
      phone: u.phone,
      user_type: u.user_type,
      password: u.password || 'password123',
      city: u.city || 'Kota',
      college_or_institute: u.college_or_institute || '',
      business_name: u.business_name || '',
      gst_number: u.gst_number || ''
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUserForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email || !userForm.phone) {
      alert('Name, Email and Phone are required.');
      return;
    }

    if (editingUser) {
      const updated: User = {
        ...editingUser,
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone,
        user_type: userForm.user_type,
        password: userForm.password,
        city: userForm.city,
        college_or_institute: userForm.college_or_institute,
        business_name: userForm.business_name,
        gst_number: userForm.gst_number
      };
      onUpdateUser(updated);
      triggerNotice(`User ${userForm.name} updated and saved!`);
    } else {
      onAddUser({
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone,
        user_type: userForm.user_type,
        password: userForm.password,
        city: userForm.city,
        college_or_institute: userForm.college_or_institute,
        business_name: userForm.business_name,
        gst_number: userForm.gst_number
      });
      triggerNotice(`User ${userForm.name} created!`);
    }
    setIsUserModalOpen(false);
  };

  // -------------------------------------------------------------
  // Visit Actions
  // -------------------------------------------------------------
  const handleSaveVisitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitForm.student_name || !visitForm.student_phone) {
      alert('Student Name and Phone are required.');
      return;
    }

    const selectedProp = properties.find(p => p.id === Number(visitForm.property_id));

    onAddVisit({
      property_id: Number(visitForm.property_id),
      property_title: selectedProp?.title || visitForm.property_title,
      propertyTitle: selectedProp?.title || visitForm.property_title,
      city: selectedProp?.city || visitForm.city,
      date: visitForm.date,
      time: visitForm.time,
      student_name: visitForm.student_name,
      student_phone: visitForm.student_phone,
      status: 'Confirmed',
      notes: visitForm.notes
    });

    triggerNotice('New room visit inquiry logged and saved!');
    setIsVisitModalOpen(false);
  };

  // -------------------------------------------------------------
  // Payment Actions
  // -------------------------------------------------------------
  const handleSavePaymentForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.payer_name || !paymentForm.payer_phone || !paymentForm.amount) {
      alert('Payer Name, Phone and Amount are required.');
      return;
    }

    const newPayment: PaymentRecord = {
      id: `PAY-ADM-${Date.now().toString().slice(-6)}`,
      amount: Number(paymentForm.amount),
      payment_type: paymentForm.payment_type,
      payer_name: paymentForm.payer_name,
      payer_phone: paymentForm.payer_phone,
      payer_email: paymentForm.payer_email,
      payment_mode: paymentForm.payment_mode,
      transaction_id: paymentForm.transaction_id,
      status: 'SUCCESS',
      property_title: paymentForm.property_title,
      notes: paymentForm.notes,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    onAddPayment(newPayment);
    triggerNotice(`Payment record ₹${paymentForm.amount} saved!`);
    setIsPaymentModalOpen(false);
  };

  // -------------------------------------------------------------
  // Backup / Export / Restore Handlers
  // -------------------------------------------------------------
  const handleDownloadBackup = () => {
    const fullData = {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      appName: 'Where is my room',
      properties,
      users,
      scheduledVisits,
      payments,
      reviews
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `wimr_full_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerNotice('Complete platform data exported to JSON file!');
  };

  const handleCopyBackup = () => {
    const fullData = {
      exportedAt: new Date().toISOString(),
      properties,
      users,
      scheduledVisits,
      payments,
      reviews
    };
    navigator.clipboard.writeText(JSON.stringify(fullData, null, 2));
    setCopiedBackup(true);
    triggerNotice('Complete database copied to clipboard!');
    setTimeout(() => setCopiedBackup(false), 2000);
  };

  const handleImportBackup = () => {
    if (!jsonImportText.trim()) {
      alert('Please paste a valid JSON backup text first.');
      return;
    }
    try {
      const parsed = JSON.parse(jsonImportText);
      if (!parsed.properties && !parsed.users) {
        alert('Invalid format. JSON must contain properties or users arrays.');
        return;
      }
      onRestoreAllData(parsed);
      setJsonImportText('');
      triggerNotice('All platform data successfully restored and saved!');
    } catch (err: any) {
      alert('Failed to parse JSON: ' + err.message);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-20 font-sans">
      {/* ========================================================================= */}
      {/* Top Admin Header Bar */}
      {/* ========================================================================= */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3.5 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img 
              src="/app-logo.png" 
              alt="Where is my room Logo" 
              className="w-9 h-9 rounded-xl object-cover shadow-sm border border-indigo-500/30 shrink-0" 
              referrerPolicy="no-referrer" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  Where is my room &bull; Master Admin Console
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Storage Synced
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                All-in-one Management: Accommodations, Users, Inquiries, ₹100 Listing Fees & Reviews
              </p>
            </div>
          </div>

          {/* Quick Notice Banner or Fast Actions */}
          <div className="flex items-center gap-2">
            {actionNotice ? (
              <div className="bg-emerald-500 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4 shrink-0" />
                <span>{actionNotice}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Auto-Saved to Browser Storage</span>
              </div>
            )}

            <button
              onClick={handleDownloadBackup}
              title="Download full JSON data backup"
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Save Backup</span>
            </button>

            {onOpenPlayStoreHub && (
              <button
                onClick={onOpenPlayStoreHub}
                title="Generate APK / AAB for Play Store"
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border border-emerald-400/30"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-200" />
                <span className="hidden sm:inline">Play Store & APK</span>
                <span className="sm:hidden">APK</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* Navigation Tabs Bar */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 text-xs font-bold scrollbar-none">
          <button
            id="admin-tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            id="admin-tab-properties"
            onClick={() => setActiveTab('properties')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'properties'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Properties & Listings ({properties.length})</span>
          </button>

          <button
            id="admin-tab-users"
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users & Retailers ({users.length})</span>
          </button>

          <button
            id="admin-tab-visits"
            onClick={() => setActiveTab('visits')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'visits'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Visits & Inquiries ({scheduledVisits.length})</span>
          </button>

          <button
            id="admin-tab-payments"
            onClick={() => setActiveTab('payments')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <IndianRupee className="w-4 h-4" />
            <span>₹100 Fees & Financials ({payments.length})</span>
          </button>

          <button
            id="admin-tab-reviews"
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews ({reviews.length})</span>
          </button>

          <button
            id="admin-tab-backup"
            onClick={() => setActiveTab('backup')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Data Save & Backup</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Main Container */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Stat KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Total Properties</span>
                  <Building className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1.5">{stats.totalListings}</div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                  <span className="text-emerald-400 font-semibold">{stats.verifiedListings} Verified</span>
                  <span>&bull;</span>
                  <span className="text-amber-400">{stats.pendingListings} Pending</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Registered Users</span>
                  <Users className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1.5">{stats.totalUsers}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {stats.studentCount} Students &bull; {stats.ownerCount} PG Owners &bull; {stats.adminCount} Admins
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Platform Revenue</span>
                  <IndianRupee className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1.5">
                  ₹{stats.totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  ₹{stats.listingFeesRevenue} from ₹100 Listing Fees
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Room Visits & Inquiries</span>
                  <Calendar className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1.5">{stats.totalVisits}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {stats.confirmedVisits} Confirmed &bull; {stats.pendingVisits} Awaiting Host
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-indigo-950/70 border border-indigo-800/60 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Direct Management Shortcuts</h3>
                  <p className="text-xs text-indigo-200">Perform instant operations with automatic local persistence</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleOpenAddProperty}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Property Listing</span>
                </button>
                <button
                  onClick={handleOpenAddUser}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  <span>Register User</span>
                </button>
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Record Payment</span>
                </button>
                <button
                  onClick={handleCopyBackup}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedBackup ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                  <span>{copiedBackup ? 'Copied DB' : 'Copy All Data'}</span>
                </button>
              </div>
            </div>

            {/* Visual Distribution Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    Accommodations by Category
                  </h3>
                  <span className="text-xs text-slate-400">Total: {stats.totalListings}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {Object.entries(stats.typeCounts).map(([cat, count]) => (
                    <div key={cat} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-200">{cat}</div>
                        <div className="text-[10px] text-slate-400">
                          {Math.round((Number(count) / (stats.totalListings || 1)) * 100)}% of total
                        </div>
                      </div>
                      <span className="text-lg font-black text-indigo-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* City Breakdown */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    City Listing Density
                  </h3>
                  <span className="text-xs text-slate-400">{Object.keys(stats.cityCounts).length} Cities</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {Object.entries(stats.cityCounts).map(([city, count]) => (
                    <div key={city} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-200">{city}</div>
                        <div className="text-[10px] text-slate-400">
                          Avg: ₹{Math.round(properties.filter(p => p.city === city).reduce((acc, c) => acc + c.rent, 0) / (Number(count) || 1))}
                        </div>
                      </div>
                      <span className="text-lg font-black text-emerald-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Bookings & Transactions Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Inquiries */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    Latest Room Visit Inquiries
                  </h3>
                  <button 
                    onClick={() => setActiveTab('visits')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-2">
                  {scheduledVisits.slice(0, 4).map((visit, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-200">{visit.property_title || visit.propertyTitle}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          {visit.student_name || 'Student'} &bull; {visit.city} &bull; {visit.date} at {visit.time}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        visit.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        visit.status === 'Completed' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {visit.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-400" />
                    Recent Payments & Listing Fees
                  </h3>
                  <button 
                    onClick={() => setActiveTab('payments')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-2">
                  {payments.slice(0, 4).map((pay) => (
                    <div key={pay.id} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-200">{pay.payer_name}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          {pay.transaction_id} &bull; {pay.payment_mode} &bull; {pay.payment_type === 'retailer_application_fee' ? '₹100 Listing Fee' : 'Booking Token'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-emerald-400">₹{pay.amount}</div>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">{pay.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 2: PROPERTIES MANAGEMENT */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'properties' && (
          <div className="space-y-4">
            {/* Header with Search, Filter & Add Button */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={propertySearch}
                  onChange={(e) => setPropertySearch(e.target.value)}
                  placeholder="Search title, area, owner, city..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
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
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="All">All Cities</option>
                  {Array.from(new Set(properties.map(p => p.city))).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  value={filterVerified}
                  onChange={(e) => setFilterVerified(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="All">All Verification</option>
                  <option value="Verified">Verified Only</option>
                  <option value="Pending">Pending Audit</option>
                </select>

                <button
                  onClick={handleOpenAddProperty}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Property</span>
                </button>
              </div>
            </div>

            {/* Properties Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-white">
                  Showing {filteredProperties.length} of {properties.length} Accommodations
                </span>
                <span className="text-slate-400 text-[11px]">Click "Edit" to modify details or "Verify" to toggle status</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Property & Location</th>
                      <th className="px-4 py-3">Type / Gender</th>
                      <th className="px-4 py-3">Monthly Rent</th>
                      <th className="px-4 py-3">Host / Contact</th>
                      <th className="px-4 py-3">Verification</th>
                      <th className="px-4 py-3">Availability</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredProperties.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-slate-500">
                          No accommodations found matching filters.
                        </td>
                      </tr>
                    ) : (
                      filteredProperties.map((prop) => (
                        <tr key={prop.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <img 
                                src={prop.images[0]} 
                                alt={prop.title} 
                                className="w-11 h-11 rounded-lg object-cover bg-slate-950 shrink-0 border border-slate-700" 
                              />
                              <div>
                                <div 
                                  className="font-bold text-white hover:text-indigo-400 cursor-pointer line-clamp-1 max-w-[220px]" 
                                  onClick={() => onSelectProperty(prop)}
                                  title={prop.title}
                                >
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
                            <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800/80 font-bold text-indigo-300 text-[10px]">
                              {prop.property_type}
                            </span>
                            <span className="ml-1.5 text-slate-400 text-[11px]">
                              {prop.gender}
                            </span>
                          </td>

                          <td className="px-4 py-3.5 font-bold text-white">
                            ₹{prop.rent.toLocaleString('en-IN')}
                            <div className="text-[10px] text-slate-500 font-normal">Dep: ₹{prop.security_deposit}</div>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="text-slate-200 font-medium truncate max-w-[130px]">{prop.owner_name || 'Hostel Owner'}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{prop.owner_phone || '+91 98290 12345'}</div>
                          </td>

                          <td className="px-4 py-3.5">
                            <button
                              onClick={() => {
                                onToggleVerify(prop.id);
                                triggerNotice(prop.verified ? `Property #${prop.id} marked as Pending` : `Property #${prop.id} verified with badge!`);
                              }}
                              className={`px-2.5 py-1 rounded-full font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
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
                                triggerNotice(`Property #${prop.id} availability toggled!`);
                              }}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                                prop.available
                                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                              }`}
                            >
                              {prop.available ? 'Available' : 'Booked'}
                            </button>
                          </td>

                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenEditProperty(prop)}
                                title="Edit Property Details"
                                className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onSelectProperty(prop)}
                                title="Preview Student Modal"
                                className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete listing "${prop.title}"? This cannot be undone.`)) {
                                    onDeleteProperty(prop.id);
                                    triggerNotice(`Property #${prop.id} deleted from database.`);
                                  }
                                }}
                                title="Delete Listing"
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
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
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 3: USERS & RETAILERS MANAGEMENT */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Header controls */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user name, email, phone..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="All">All Roles</option>
                  <option value="student">Students</option>
                  <option value="owner">PG / Hostel Owners</option>
                  <option value="admin">Administrators</option>
                </select>

                <button
                  onClick={handleOpenAddUser}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register User</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-white">
                  Showing {filteredUsers.length} of {users.length} Registered Accounts
                </span>
                <span className="text-slate-400 text-[11px]">All credentials & roles persist across sessions</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">User Details</th>
                      <th className="px-4 py-3">Account Role</th>
                      <th className="px-4 py-3">Phone / Contact</th>
                      <th className="px-4 py-3">City & Affiliation</th>
                      <th className="px-4 py-3">Password / Auth</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                {u.name}
                                {u.email.includes('sanjay') && (
                                  <span className="px-1.5 py-0.2 rounded bg-indigo-600 text-white text-[9px]">You</span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.user_type === 'student' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                            u.user_type === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {u.user_type}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 font-mono text-slate-300">
                          {u.phone}
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="text-slate-200">{u.city || 'Kota'}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">
                            {u.business_name || u.college_or_institute || 'General User'}
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <code className="text-xs bg-slate-950 px-2 py-1 rounded border border-slate-800 text-indigo-300 font-mono">
                            {u.password || 'password123'}
                          </code>
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditUser(u)}
                              title="Edit User Profile & Role"
                              className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Remove account for ${u.name}?`)) {
                                  onDeleteUser(u.id);
                                  triggerNotice(`User ${u.name} removed from database.`);
                                }
                              }}
                              title="Delete User"
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 4: VISITS & INQUIRIES MANAGEMENT */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'visits' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={visitSearch}
                  onChange={(e) => setVisitSearch(e.target.value)}
                  placeholder="Search student, property, city..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={visitStatusFilter}
                  onChange={(e) => setVisitStatusFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => setIsVisitModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Visit Inquiry</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-white">
                  Showing {filteredVisits.length} Room Visits & Student Scheduling Requests
                </span>
                <span className="text-slate-400 text-[11px]">Manage hostel check-in dates and warden appointment status</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Property Name</th>
                      <th className="px-4 py-3">Student / Visitor</th>
                      <th className="px-4 py-3">Scheduled Slot</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Notes</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredVisits.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-white max-w-[220px]">
                          {v.property_title || v.propertyTitle}
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-200">{v.student_name || 'Aman Gupta'}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{v.student_phone || '+91 97112 34567'}</div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-indigo-300">{v.date}</div>
                          <div className="text-[11px] text-slate-400">{v.time}</div>
                        </td>

                        <td className="px-4 py-3.5 text-slate-300">
                          {v.city}
                        </td>

                        <td className="px-4 py-3.5">
                          <select
                            value={v.status}
                            onChange={(e) => {
                              onUpdateVisitStatus(v.id, e.target.value as any);
                              triggerNotice(`Visit #${v.id} status changed to ${e.target.value}`);
                            }}
                            className="bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="px-4 py-3.5 text-slate-400 max-w-[180px] truncate text-[11px]">
                          {v.notes || 'Routine room inspection'}
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {v.student_phone && (
                              <a
                                href={`tel:${v.student_phone}`}
                                title="Call Student"
                                className="p-1.5 text-emerald-400 hover:bg-slate-800 rounded-lg"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => {
                                onDeleteVisit(v.id);
                                triggerNotice('Visit record removed.');
                              }}
                              title="Delete Record"
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 5: FINANCIALS & TRANSACTIONS (₹100 FEES) */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            {/* Payment Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xs">
                <div className="text-xs text-slate-400">Total Transaction Volume</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-slate-400 mt-1">{payments.length} total logged payments</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xs">
                <div className="text-xs text-slate-400">Retailer ₹100 Listing Fees</div>
                <div className="text-2xl font-black text-indigo-400 mt-1">₹{stats.listingFeesRevenue.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {payments.filter(p => p.payment_type === 'retailer_application_fee').length} listings verified with ₹100 fee
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xs">
                <div className="text-xs text-slate-400">Advance Student Booking Tokens</div>
                <div className="text-2xl font-black text-purple-400 mt-1">₹{stats.tokenDepositRevenue.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-slate-400 mt-1">Direct token reservations</div>
              </div>
            </div>

            {/* Filter and Add */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  placeholder="Search payer, txn id, property..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={paymentTypeFilter}
                  onChange={(e) => setPaymentTypeFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="All">All Payment Types</option>
                  <option value="retailer_application_fee">₹100 Retailer Listing Fee</option>
                  <option value="student_booking_token">Student Booking Token</option>
                </select>

                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Payment</span>
                </button>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-white">Payment Ledger ({filteredPayments.length} Transactions)</span>
                <span className="text-slate-400 text-[11px]">UPI, NetBanking & Card payment verification records</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Txn ID & Date</th>
                      <th className="px-4 py-3">Payer Name</th>
                      <th className="px-4 py-3">Payment Purpose</th>
                      <th className="px-4 py-3">Mode</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-mono font-bold text-indigo-300">{p.transaction_id}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{p.created_at}</div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-bold text-white">{p.payer_name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{p.payer_phone}</div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.payment_type === 'retailer_application_fee'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}>
                            {p.payment_type === 'retailer_application_fee' ? '₹100 Listing Fee' : 'Booking Token'}
                          </span>
                          {p.property_title && (
                            <div className="text-[11px] text-slate-400 mt-1 line-clamp-1 max-w-[180px]">
                              {p.property_title}
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-3.5 font-mono text-slate-300">
                          {p.payment_mode}
                        </td>

                        <td className="px-4 py-3.5 font-black text-emerald-400 text-sm">
                          ₹{p.amount.toLocaleString('en-IN')}
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            {p.status}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => {
                              onDeletePayment(p.id);
                              triggerNotice('Payment record removed.');
                            }}
                            title="Delete Payment Record"
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 6: REVIEWS MODERATION */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Student Reviews Moderation ({reviews.length})</h3>
                <p className="text-xs text-slate-400">Ensure high quality authentic student feedback across all coaching hubs</p>
              </div>

              <select
                value={reviewRatingFilter}
                onChange={(e) => setReviewRatingFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Star Reviews Only</option>
                <option value="4">4 Star Reviews</option>
                <option value="low">3 Stars or Lower</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReviews.map((r) => {
                const prop = properties.find(p => p.id === r.property_id);
                return (
                  <div key={r.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                          {r.user_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">{r.user_name}</div>
                          <div className="text-[10px] text-slate-400">{r.created_at}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-300" />
                        <span>{r.rating}.0</span>
                      </div>
                    </div>

                    <div className="text-xs text-indigo-300 font-semibold flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      <span>{prop?.title || `Property #${r.property_id}`}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      "{r.review}"
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Student Review
                      </span>

                      <button
                        onClick={() => {
                          onDeleteReview(r.id);
                          triggerNotice('Review moderated and removed.');
                        }}
                        className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 7: DATA SAVE & SYSTEM BACKUP */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Full Platform Data Persistence Hub</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Export, backup or restore the entire database (Properties, Users, Visits, ₹100 Payments & Reviews)
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Active Storage Engine
                </span>
              </div>

              {/* Data Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <div className="text-xl font-black text-white">{properties.length}</div>
                  <div className="text-[11px] text-slate-400 font-medium">Accommodations</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <div className="text-xl font-black text-white">{users.length}</div>
                  <div className="text-[11px] text-slate-400 font-medium">Users & Retailers</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <div className="text-xl font-black text-white">{scheduledVisits.length}</div>
                  <div className="text-[11px] text-slate-400 font-medium">Room Visits</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <div className="text-xl font-black text-emerald-400">{payments.length}</div>
                  <div className="text-[11px] text-slate-400 font-medium">Transactions</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center col-span-2 sm:col-span-1">
                  <div className="text-xl font-black text-indigo-400">{reviews.length}</div>
                  <div className="text-[11px] text-slate-400 font-medium">Reviews</div>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={handleDownloadBackup}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Complete JSON Backup</span>
                </button>

                <button
                  onClick={handleCopyBackup}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {copiedBackup ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
                  <span>{copiedBackup ? 'Copied to Clipboard!' : 'Copy Backup JSON'}</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Warning: This will reset all platform data to factory seed data. Any newly created listings will be cleared. Continue?')) {
                      onResetAllData();
                      triggerNotice('Platform data reset to factory seed data.');
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer ml-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset to Factory Data</span>
                </button>
              </div>
            </div>

            {/* Restore from JSON Box */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Upload className="w-4 h-4 text-emerald-400" />
                <h3>Restore or Import Data from JSON</h3>
              </div>
              <p className="text-xs text-slate-400">
                Paste an exported JSON backup below to restore or overwrite the app's database state.
              </p>

              <textarea
                value={jsonImportText}
                onChange={(e) => setJsonImportText(e.target.value)}
                rows={5}
                placeholder='Paste your JSON backup object here (e.g. {"properties": [...], "users": [...]})'
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              <button
                onClick={handleImportBackup}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Apply and Save Imported Data</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT PROPERTY */}
      {/* ========================================================================= */}
      {isPropertyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  {editingProperty ? `Edit Property #${editingProperty.id}` : 'Add New Accommodation'}
                </h3>
              </div>
              <button 
                onClick={() => setIsPropertyModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePropertyForm} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-300">Listing Title *</label>
                  <input
                    type="text"
                    value={propForm.title}
                    onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                    required
                    placeholder="e.g. Allen Coaching Hub Boys PG with Study Desk"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Category *</label>
                  <select
                    value={propForm.property_type}
                    onChange={(e) => setPropForm({ ...propForm, property_type: e.target.value as PropertyType })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="PG">PG</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Room">Room</option>
                    <option value="Lounge">Lounge</option>
                    <option value="Flat">Flat</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Gender Preference *</label>
                  <select
                    value={propForm.gender}
                    onChange={(e) => setPropForm({ ...propForm, gender: e.target.value as GenderPreference })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                    <option value="Co-ed">Co-ed</option>
                    <option value="Any">Any</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">City *</label>
                  <select
                    value={propForm.city}
                    onChange={(e) => setPropForm({ ...propForm, city: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Kota">Kota</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Jaipur">Jaipur</option>
                    <option value="Pune">Pune</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Lucknow">Lucknow</option>
                    <option value="Patna">Patna</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Area / Neighborhood *</label>
                  <input
                    type="text"
                    value={propForm.area}
                    onChange={(e) => setPropForm({ ...propForm, area: e.target.value })}
                    required
                    placeholder="e.g. Landmark City, Kunhari"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Monthly Rent (₹) *</label>
                  <input
                    type="number"
                    value={propForm.rent}
                    onChange={(e) => setPropForm({ ...propForm, rent: Number(e.target.value) })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={propForm.security_deposit}
                    onChange={(e) => setPropForm({ ...propForm, security_deposit: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Host / Owner Name</label>
                  <input
                    type="text"
                    value={propForm.owner_name}
                    onChange={(e) => setPropForm({ ...propForm, owner_name: e.target.value })}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Host Phone Number</label>
                  <input
                    type="text"
                    value={propForm.owner_phone}
                    onChange={(e) => setPropForm({ ...propForm, owner_phone: e.target.value })}
                    placeholder="+91 98290 12345"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-300">Cover Image URL</label>
                  <input
                    type="text"
                    value={propForm.imageUrl}
                    onChange={(e) => setPropForm({ ...propForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-300">Property Description</label>
                  <textarea
                    value={propForm.description}
                    onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                    rows={3}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={propForm.wifi}
                    onChange={(e) => setPropForm({ ...propForm, wifi: e.target.checked })}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>High Speed WiFi</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={propForm.ac}
                    onChange={(e) => setPropForm({ ...propForm, ac: e.target.checked })}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Air Conditioned</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={propForm.food_available}
                    onChange={(e) => setPropForm({ ...propForm, food_available: e.target.checked })}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Mess Food</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={propForm.attached_bathroom}
                    onChange={(e) => setPropForm({ ...propForm, attached_bathroom: e.target.checked })}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Attached Bath</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={propForm.verified}
                    onChange={(e) => setPropForm({ ...propForm, verified: e.target.checked })}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-emerald-400 font-bold">Verified Listing</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={propForm.available}
                    onChange={(e) => setPropForm({ ...propForm, available: e.target.checked })}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-indigo-400 font-bold">Available for Booking</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPropertyModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  {editingProperty ? 'Save Changes' : 'Create Accommodation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT USER */}
      {/* ========================================================================= */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  {editingUser ? `Edit User: ${editingUser.name}` : 'Register New User'}
                </h3>
              </div>
              <button 
                onClick={() => setIsUserModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserForm} className="space-y-3.5 pt-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Full Name *</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  required
                  placeholder="e.g. Aman Gupta"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    required
                    placeholder="student@domain.com"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Mobile Phone *</label>
                  <input
                    type="text"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    required
                    placeholder="+91 98290 12345"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">User Role *</label>
                  <select
                    value={userForm.user_type}
                    onChange={(e) => setUserForm({ ...userForm, user_type: e.target.value as UserType })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="student">Student / Aspirant</option>
                    <option value="owner">PG / Hostel Owner</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Password *</label>
                  <input
                    type="text"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">City</label>
                  <input
                    type="text"
                    value={userForm.city}
                    onChange={(e) => setUserForm({ ...userForm, city: e.target.value })}
                    placeholder="Kota, Delhi, Jaipur..."
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Institute / Business Name</label>
                  <input
                    type="text"
                    value={userForm.college_or_institute || userForm.business_name}
                    onChange={(e) => setUserForm({ 
                      ...userForm, 
                      college_or_institute: e.target.value,
                      business_name: e.target.value 
                    })}
                    placeholder="e.g. Allen Coaching / Stay Solutions"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  {editingUser ? 'Save User' : 'Register User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: LOG VISIT INQUIRY */}
      {/* ========================================================================= */}
      {isVisitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Log Room Visit / Inquiry</h3>
              </div>
              <button 
                onClick={() => setIsVisitModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVisitForm} className="space-y-3.5 pt-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Select Accommodation *</label>
                <select
                  value={visitForm.property_id}
                  onChange={(e) => {
                    const p = properties.find(prop => prop.id === Number(e.target.value));
                    setVisitForm({
                      ...visitForm,
                      property_id: Number(e.target.value),
                      property_title: p?.title || '',
                      city: p?.city || 'Kota'
                    });
                  }}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title} ({p.city})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Student Name *</label>
                  <input
                    type="text"
                    value={visitForm.student_name}
                    onChange={(e) => setVisitForm({ ...visitForm, student_name: e.target.value })}
                    required
                    placeholder="e.g. Aman Gupta"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Student Phone *</label>
                  <input
                    type="text"
                    value={visitForm.student_phone}
                    onChange={(e) => setVisitForm({ ...visitForm, student_phone: e.target.value })}
                    required
                    placeholder="+91 97112 34567"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Visit Date *</label>
                  <input
                    type="date"
                    value={visitForm.date}
                    onChange={(e) => setVisitForm({ ...visitForm, date: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Visit Time *</label>
                  <input
                    type="text"
                    value={visitForm.time}
                    onChange={(e) => setVisitForm({ ...visitForm, time: e.target.value })}
                    required
                    placeholder="11:00 AM"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Inquiry Notes</label>
                <textarea
                  value={visitForm.notes}
                  onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                  rows={2}
                  placeholder="Single room inquiry, parent visiting..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsVisitModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Save Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RECORD PAYMENT */}
      {/* ========================================================================= */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Record Offline / Online Payment</h3>
              </div>
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePaymentForm} className="space-y-3.5 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Amount (₹) *</label>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Payment Type *</label>
                  <select
                    value={paymentForm.payment_type}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_type: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  >
                    <option value="retailer_application_fee">₹100 Retailer Listing Fee</option>
                    <option value="student_booking_token">Student Booking Token</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Payer Name *</label>
                  <input
                    type="text"
                    value={paymentForm.payer_name}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payer_name: e.target.value })}
                    required
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Payer Phone *</label>
                  <input
                    type="text"
                    value={paymentForm.payer_phone}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payer_phone: e.target.value })}
                    required
                    placeholder="+91 98290 12345"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Payment Mode *</label>
                  <select
                    value={paymentForm.payment_mode}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_mode: e.target.value as PaymentMode })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="NetBanking">NetBanking</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Transaction ID *</label>
                  <input
                    type="text"
                    value={paymentForm.transaction_id}
                    onChange={(e) => setPaymentForm({ ...paymentForm, transaction_id: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Associated Property Title</label>
                <input
                  type="text"
                  value={paymentForm.property_title}
                  onChange={(e) => setPaymentForm({ ...paymentForm, property_title: e.target.value })}
                  placeholder="e.g. Allen Coaching Hub Boys PG"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
