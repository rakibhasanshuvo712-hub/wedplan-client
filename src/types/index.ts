export type UserRole = 'customer' | 'vendor' | 'admin';
export type SubscriptionPlan = 'free' | 'premium';
export type ServiceStatus = 'pending' | 'approved' | 'rejected';
export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  isBlocked: boolean;
  businessName?: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceVendor {
  _id: string;
  name: string;
  email: string;
  businessName?: string;
  image?: string;
  subscriptionPlan?: SubscriptionPlan;
  isBlocked?: boolean;
}

export interface Service {
  _id: string;
  vendorId: ServiceVendor;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: ServiceStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  serviceId: {
    _id: string;
    serviceName: string;
    category: string;
    price: number;
    images: string[];
    location: string;
  };
  vendorId: {
    _id: string;
    name: string;
    businessName?: string;
    email: string;
    image?: string;
  };
  customerId: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  eventDate: string;
  eventLocation: string;
  message?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  vendorId: {
    _id: string;
    name: string;
    businessName?: string;
    email: string;
    subscriptionPlan?: string;
  };
  plan: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  stripeSubscriptionId?: string | null;
  status: 'succeeded' | 'pending' | 'failed';
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalServices: number;
  pendingServices: number;
  approvedServices: number;
  totalBookings: number;
  totalTransactions: number;
  totalRevenue: number;
}

export interface CategoryItem {
  name: string;
  count: number;
  icon?: string;
  image?: string;
}
