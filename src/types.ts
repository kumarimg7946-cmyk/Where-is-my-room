export type PropertyType = 'PG' | 'Hostel' | 'Hotel' | 'Room' | 'Lounge' | 'Flat';
export type GenderPreference = 'Boys' | 'Girls' | 'Co-ed' | 'Any';
export type UserType = 'student' | 'owner' | 'retailer' | 'admin';
export type PaymentMode = 'UPI' | 'Card' | 'NetBanking' | 'Cash';

export interface IndianCity {
  name: string;
  state: string;
  isCapital: boolean;
  famousHubs: string;
  isPopular?: boolean;
}

export interface IndianStateInfo {
  state: string;
  capital: string;
  majorCities: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  user_type: UserType;
  password?: string;
  avatar_url?: string;
  city?: string;
  college_or_institute?: string;
  business_name?: string;
  gst_number?: string;
  created_at: string;
}

export interface CategorySpecificDetails {
  // Room specifics
  furnishing_status?: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  room_size_sqft?: number;
  floor_number?: number;
  private_entry?: boolean;
  kitchen_access?: boolean;

  // PG specifics
  meal_offerings?: string[]; // Breakfast, Lunch, Dinner, Evening Snacks
  food_type?: 'Pure Veg' | 'Veg & Non-Veg' | 'Jain Food Available';
  has_live_in_warden?: boolean;
  laundry_frequency?: string;

  // Hostel specifics
  sharing_capacity?: 'Single' | 'Double' | 'Triple' | '4-Sharing' | 'Dormitory';
  biometric_entry?: boolean;
  study_hall_capacity?: number;
  visitor_policy?: string;

  // Hotel specifics
  daily_tariff?: number;
  check_in_time?: string;
  check_out_time?: string;
  exam_day_wake_call?: boolean;
  transit_pickup_available?: boolean;

  // Lounge specifics
  hourly_pass_rate?: number;
  monthly_pass_rate?: number;
  operating_hours?: '24/7 Open' | '6:00 AM - 12:00 Midnight' | '8:00 AM - 10:00 PM';
  internet_speed_mbps?: number;
  has_soundproof_pod?: boolean;
  power_backup_hours?: string;
}

export interface Property {
  id: number;
  owner_id: number;
  owner_name?: string;
  owner_phone?: string;
  retailer_business_name?: string;
  title: string;
  property_type: PropertyType;
  city: string;
  is_capital?: boolean;
  state?: string;
  area: string;
  address: string;
  latitude: number;
  longitude: number;
  rent: number;
  security_deposit: number;
  available_from: string;
  gender: GenderPreference;
  food_available: boolean;
  wifi: boolean;
  ac: boolean;
  laundry: boolean;
  attached_bathroom: boolean;
  description: string;
  verified: boolean;
  available: boolean;
  application_fee_paid?: boolean;
  application_fee_transaction_id?: string;
  created_at: string;
  images: string[];
  sharing_options?: string;
  nearby_institutes?: string[];
  curfew_time?: string;
  electricity_charges?: string;
  rating?: number;
  review_count?: number;
  category_details?: CategorySpecificDetails;
  google_place_id?: string;
  google_rating?: number;
  google_reviews_count?: number;
  verified_source?: string;
  google_maps_url?: string;
}

export interface Review {
  id: number;
  user_id: number;
  user_name: string;
  property_id: number;
  rating: number;
  review: string;
  created_at: string;
}

export interface Favourite {
  id: number;
  user_id: number;
  property_id: number;
}

export interface ScheduledVisit {
  id: string | number;
  property_id?: number;
  property_title: string;
  propertyTitle?: string;
  city: string;
  date: string;
  time: string;
  student_name?: string;
  student_phone?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  created_at?: string;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  payment_type: 'retailer_application_fee' | 'student_booking_token' | 'security_deposit';
  payer_name: string;
  payer_phone: string;
  payer_email?: string;
  payment_mode: PaymentMode;
  upi_id?: string;
  card_last4?: string;
  bank_name?: string;
  transaction_id: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  property_id?: number;
  property_title?: string;
  notes?: string;
  created_at: string;
}
