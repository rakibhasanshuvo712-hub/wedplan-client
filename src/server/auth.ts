import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { User, Service } from './models';
import { connectToDatabase } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'wedplan_production_secret_jwt_key_2026_super_secure';
const JWT_EXPIRES_IN = '7d';

export function generateToken(user: any) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getAuthUser(request: NextRequest) {
  await connectToDatabase();
  const authHeader = request.headers.get('authorization');
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = request.cookies.get('wedplan_token')?.value || null;
  }

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) return null;

  const user = await User.findById(decoded.id);
  if (!user || user.isBlocked) return null;

  return user;
}

export async function seedDefaultsIfNeeded() {
  await connectToDatabase();
  const count = await User.countDocuments();
  if (count === 0) {
    const admin = new User({
      name: 'WedPlan Admin',
      email: 'admin@wedplan.com',
      password: 'Admin@123456',
      role: 'admin',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });
    await admin.save();

    const vendor = new User({
      name: 'Bella Rose Events',
      email: 'vendor@wedplan.com',
      password: 'Vendor@123456',
      role: 'vendor',
      businessName: 'Bella Rose Luxury Events',
      isPremium: true,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    });
    await vendor.save();

    const customer = new User({
      name: 'Emily Watson',
      email: 'customer@wedplan.com',
      password: 'Customer@123456',
      role: 'customer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    });
    await customer.save();

    // Add sample services for vendor
    const services = [
      {
        vendorId: vendor._id,
        title: 'Cinematic Wedding & Aerial 4K Photography',
        description: 'Complete full-day photo & video coverage with 2 primary shooters, drone cinematography, and private digital gallery.',
        category: 'Photography',
        price: 1850,
        pricingUnit: 'per wedding',
        location: 'New York, NY',
        features: ['Full Day Coverage', 'Drone 4K Drone Footage', 'High-Res Edited Gallery', 'Teaser Reel within 48h'],
        rating: 4.95,
        reviewsCount: 38,
        status: 'active',
        isFeatured: true,
        images: [
          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        ],
      },
      {
        vendorId: vendor._id,
        title: 'Chateau Grand Rose Luxury Ballroom & Garden',
        description: 'Iconic crystal chandelier ballroom and manicured French rose garden accommodating up to 450 guests.',
        category: 'Venue',
        price: 6500,
        pricingUnit: 'per event',
        location: 'Beverly Hills, CA',
        features: ['Up to 450 Guests', 'Bridal & Groom Suites', 'Valet Parking', 'Indoor & Outdoor Zones'],
        rating: 4.98,
        reviewsCount: 54,
        status: 'active',
        isFeatured: true,
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
        ],
      },
      {
        vendorId: vendor._id,
        title: 'Gourmet 5-Course Plated Reception & Artisanal Bar',
        description: 'Award-winning farm-to-table culinary feast with craft cocktail open bar and dessert display.',
        category: 'Catering',
        price: 85,
        pricingUnit: 'per guest',
        location: 'Austin, TX',
        features: ['Custom Tasting Menu', 'Craft Cocktails & Wine', 'Late Night Snack Station', 'White Glove Service'],
        rating: 4.9,
        reviewsCount: 29,
        status: 'active',
        isFeatured: true,
        images: [
          'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
        ],
      },
    ];
    await Service.insertMany(services);
  }
}
