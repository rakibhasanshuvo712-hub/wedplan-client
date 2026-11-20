import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// User Schema
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
    isPremium: { type: Boolean, default: false },
    premiumExpiresAt: { type: Date, default: null },
    image: { type: String, default: '' },
    businessName: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    bio: { type: String, default: '' },
    isBlocked: { type: Boolean, default: false },
    googleId: { type: String, default: null },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Service Schema
const serviceSchema = new Schema(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Photography', 'Catering', 'Decoration', 'Music & DJ', 'Venue', 'Makeup & Styling', 'Bridal Wear', 'Planning & Coordination'],
    },
    price: { type: Number, required: true, min: 0 },
    pricingUnit: { type: String, default: 'per day' },
    images: { type: [String], default: [] },
    location: { type: String, required: true },
    features: { type: [String], default: [] },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'paused', 'pending', 'rejected'], default: 'active' },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Booking Schema
const bookingSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    eventDate: { type: Date, required: true },
    guestCount: { type: Number, default: 100 },
    specialRequests: { type: String, default: '' },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
    cancellationReason: { type: String, default: '' },
    vendorNotes: { type: String, default: '' },
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Transaction Schema
const transactionSchema = new Schema(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stripeSessionId: { type: String, required: true, unique: true },
    stripePaymentIntentId: { type: String, default: null },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    plan: { type: String, default: 'Premium Plan' },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    paymentMethod: { type: String, default: 'card' },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
