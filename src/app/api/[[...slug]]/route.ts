import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { User, Service, Booking, Transaction } from '@/server/models';
import { generateToken, getAuthUser, seedDefaultsIfNeeded } from '@/server/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_wedplan');

type RouteContext = {
  params: Promise<{ slug?: string[] }>;
};

// Helper to sanitize user object
function sanitizeUser(user: any) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
}

// GET Handler
export async function GET(request: NextRequest, context: RouteContext) {
  await connectToDatabase();
  await seedDefaultsIfNeeded();

  const { slug = [] } = await context.params;
  const path = slug.join('/');
  const { searchParams } = new URL(request.url);

  try {
    // 1. Health check
    if (path === 'health' || path === '') {
      return NextResponse.json({
        status: 'ok',
        service: 'WedPlan Wedding Planning Platform API (Next.js Hybrid)',
        timestamp: new Date().toISOString(),
      });
    }

    // 2. Auth: Current User
    if (path === 'auth/me') {
      const user = await getAuthUser(request);
      if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.json({ success: true, user: sanitizeUser(user), data: { user: sanitizeUser(user) } });
    }

    // 3. Services: Browse / Search / Filter
    if (path === 'services') {
      const category = searchParams.get('category');
      const search = searchParams.get('search');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const sortBy = searchParams.get('sortBy') || 'createdAt';
      const order = searchParams.get('order') === 'asc' ? 1 : -1;
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '12', 10);

      const query: any = { status: 'active' };
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
        ];
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      const total = await Service.countDocuments(query);
      const services = await Service.find(query)
        .populate('vendorId', 'name email businessName image')
        .sort({ [sortBy]: order })
        .skip((page - 1) * limit)
        .limit(limit);

      return NextResponse.json({
        success: true,
        data: services,
        services,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      });
    }

    // 4. Single Service Details: services/:id
    if (path.startsWith('services/') && slug.length === 2) {
      const id = slug[1];
      const service = await Service.findById(id).populate('vendorId', 'name email businessName phone image bio');
      if (!service) {
        return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: service, service });
    }

    // 5. Vendor Dashboard Services: vendor/services
    if (path === 'vendor/services') {
      const user = await getAuthUser(request);
      if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
        return NextResponse.json({ success: false, error: 'Unauthorized vendor' }, { status: 401 });
      }
      const services = await Service.find({ vendorId: user._id }).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: services, services });
    }

    // 6. Vendor Dashboard Bookings: vendor/bookings
    if (path === 'vendor/bookings') {
      const user = await getAuthUser(request);
      if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
        return NextResponse.json({ success: false, error: 'Unauthorized vendor' }, { status: 401 });
      }
      const bookings = await Booking.find({ vendorId: user._id })
        .populate('customerId', 'name email phone image')
        .populate('serviceId', 'title category price images')
        .sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: bookings, bookings });
    }

    // 7. Vendor Stats: vendor/stats
    if (path === 'vendor/stats') {
      const user = await getAuthUser(request);
      if (!user || user.role !== 'vendor') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      const totalServices = await Service.countDocuments({ vendorId: user._id });
      const totalBookings = await Booking.countDocuments({ vendorId: user._id });
      const pendingBookings = await Booking.countDocuments({ vendorId: user._id, status: 'pending' });
      const acceptedBookings = await Booking.countDocuments({ vendorId: user._id, status: 'accepted' });

      return NextResponse.json({
        success: true,
        stats: {
          totalServices,
          totalBookings,
          pendingBookings,
          acceptedBookings,
          isPremium: user.isPremium,
          serviceLimit: user.isPremium ? 'Unlimited' : 3,
        },
      });
    }

    // 8. Customer Dashboard Bookings: customer/bookings or bookings/my
    if (path === 'customer/bookings' || path === 'bookings') {
      const user = await getAuthUser(request);
      if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      const query = user.role === 'vendor' ? { vendorId: user._id } : { customerId: user._id };
      const bookings = await Booking.find(query)
        .populate('vendorId', 'name email businessName phone image')
        .populate('serviceId', 'title category price images location')
        .sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: bookings, bookings });
    }

    // 9. Admin Overview: admin/overview
    if (path === 'admin/overview') {
      const user = await getAuthUser(request);
      if (!user || user.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized admin' }, { status: 403 });
      }
      const totalUsers = await User.countDocuments();
      const totalVendors = await User.countDocuments({ role: 'vendor' });
      const totalCustomers = await User.countDocuments({ role: 'customer' });
      const totalServices = await Service.countDocuments();
      const activeServices = await Service.countDocuments({ status: 'active' });
      const pendingServices = await Service.countDocuments({ status: 'pending' });
      const totalBookings = await Booking.countDocuments();
      const transactions = await Transaction.find().sort({ createdAt: -1 }).limit(5);

      return NextResponse.json({
        success: true,
        stats: {
          totalUsers,
          totalVendors,
          totalCustomers,
          totalServices,
          activeServices,
          pendingServices,
          totalBookings,
        },
        recentTransactions: transactions,
      });
    }

    // 10. Admin Users: admin/users
    if (path === 'admin/users') {
      const user = await getAuthUser(request);
      if (!user || user.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized admin' }, { status: 403 });
      }
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return NextResponse.json({ success: true, users, data: users });
    }

    // 11. Admin Services: admin/services
    if (path === 'admin/services') {
      const user = await getAuthUser(request);
      if (!user || user.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized admin' }, { status: 403 });
      }
      const services = await Service.find()
        .populate('vendorId', 'name email businessName')
        .sort({ createdAt: -1 });
      return NextResponse.json({ success: true, services, data: services });
    }

    // 12. Admin Transactions: admin/transactions
    if (path === 'admin/transactions') {
      const user = await getAuthUser(request);
      if (!user || user.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized admin' }, { status: 403 });
      }
      const transactions = await Transaction.find()
        .populate('vendorId', 'name email businessName')
        .sort({ createdAt: -1 });
      return NextResponse.json({ success: true, transactions, data: transactions });
    }

    // 13. Stripe Session Verify: stripe/verify-session
    if (path === 'stripe/verify-session') {
      const sessionId = searchParams.get('session_id');
      if (!sessionId) {
        return NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 });
      }
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === 'paid' && session.metadata?.vendorId) {
        await User.findByIdAndUpdate(session.metadata.vendorId, { isPremium: true });
        await Transaction.findOneAndUpdate(
          { stripeSessionId: sessionId },
          { status: 'completed', stripePaymentIntentId: session.payment_intent as string },
          { upsert: true }
        );
      }
      return NextResponse.json({ success: true, status: session.payment_status, session });
    }

    return NextResponse.json({ success: false, error: `Route not found: ${path}` }, { status: 404 });
  } catch (error: any) {
    console.error('API GET Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal error' }, { status: 500 });
  }
}

// POST Handler
export async function POST(request: NextRequest, context: RouteContext) {
  await connectToDatabase();
  await seedDefaultsIfNeeded();

  const { slug = [] } = await context.params;
  const path = slug.join('/');
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  try {
    // 1. Auth: Register
    if (path === 'auth/register') {
      const { name, email, password, role = 'customer', businessName, image } = body;
      if (!name || !email || !password) {
        return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
      }

      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return NextResponse.json({ success: false, error: 'An account with this email already exists' }, { status: 400 });
      }

      const newUser = new User({
        name,
        email: email.toLowerCase(),
        password,
        role,
        businessName: role === 'vendor' ? businessName || `${name}'s Services` : '',
        image: image || '',
      });
      await newUser.save();

      const token = generateToken(newUser);
      return NextResponse.json(
        {
          success: true,
          message: 'Account created successfully',
          token,
          user: sanitizeUser(newUser),
          data: { token, user: sanitizeUser(newUser) },
        },
        { status: 201 }
      );
    }

    // 2. Auth: Login
    if (path === 'auth/login') {
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
      }

      if (user.isBlocked) {
        return NextResponse.json({ success: false, error: 'Your account has been suspended by an administrator' }, { status: 403 });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
      }

      const token = generateToken(user);
      return NextResponse.json({
        success: true,
        message: 'Signed in successfully',
        token,
        user: sanitizeUser(user),
        data: { token, user: sanitizeUser(user) },
      });
    }

    // 3. Auth: Google Demo / OAuth
    if (path === 'auth/google') {
      const { email, name, image, role = 'customer' } = body;
      if (!email) {
        return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 });
      }

      let user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        user = new User({
          name: name || 'Google User',
          email: email.toLowerCase(),
          password: 'GoogleOAuthPassword@2026',
          role,
          image: image || '',
        });
        await user.save();
      }

      const token = generateToken(user);
      return NextResponse.json({
        success: true,
        token,
        user: sanitizeUser(user),
        data: { token, user: sanitizeUser(user) },
      });
    }

    // 4. Create Service: services
    if (path === 'services') {
      const user = await getAuthUser(request);
      if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
        return NextResponse.json({ success: false, error: 'Only vendors can publish services' }, { status: 403 });
      }

      // Check service limit for free vendors
      if (user.role === 'vendor' && !user.isPremium) {
        const count = await Service.countDocuments({ vendorId: user._id });
        if (count >= 3) {
          return NextResponse.json(
            {
              success: false,
              error: 'Free tier limit reached (max 3 services). Please upgrade to Premium for unlimited publishing.',
            },
            { status: 403 }
          );
        }
      }

      const { title, description, category, price, pricingUnit, images, location, features } = body;
      if (!title || !description || !category || !price || !location) {
        return NextResponse.json({ success: false, error: 'All primary fields are required' }, { status: 400 });
      }

      const service = new Service({
        vendorId: user._id,
        title,
        description,
        category,
        price: Number(price),
        pricingUnit: pricingUnit || 'per day',
        images: images && images.length ? images : ['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'],
        location,
        features: Array.isArray(features) ? features : [],
        status: 'active',
      });
      await service.save();

      return NextResponse.json({ success: true, service, data: service }, { status: 201 });
    }

    // 5. Submit Booking Request: bookings
    if (path === 'bookings') {
      const user = await getAuthUser(request);
      if (!user) {
        return NextResponse.json({ success: false, error: 'Please sign in to submit a booking request' }, { status: 401 });
      }

      const { serviceId, eventDate, guestCount, specialRequests, contactPhone, contactEmail } = body;
      if (!serviceId || !eventDate || !contactPhone) {
        return NextResponse.json({ success: false, error: 'Service, event date, and phone are required' }, { status: 400 });
      }

      const service = await Service.findById(serviceId);
      if (!service) {
        return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
      }

      const booking = new Booking({
        customerId: user._id,
        vendorId: service.vendorId,
        serviceId: service._id,
        eventDate: new Date(eventDate),
        guestCount: Number(guestCount) || 100,
        specialRequests: specialRequests || '',
        contactPhone,
        contactEmail: contactEmail || user.email,
        totalPrice: service.price,
        status: 'pending',
      });
      await booking.save();

      return NextResponse.json({ success: true, booking, data: booking }, { status: 201 });
    }

    // 6. Stripe Checkout Session: stripe/create-checkout-session
    if (path === 'stripe/create-checkout-session') {
      const user = await getAuthUser(request);
      if (!user || user.role !== 'vendor') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://wedplan-frontend-two.vercel.app';

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'WedPlan Vendor Premium Lifetime Membership',
                description: 'Unlimited service listings, verified badge, priority placement, and 24/7 dedicated support.',
              },
              unit_amount: 4900, // $49.00 USD
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer_email: user.email,
        metadata: {
          vendorId: user._id.toString(),
        },
        success_url: `${origin}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/dashboard/payment-cancel`,
      });

      // Save pending transaction
      await Transaction.create({
        vendorId: user._id,
        stripeSessionId: session.id,
        amount: 49,
        status: 'pending',
      });

      return NextResponse.json({ success: true, url: session.url, sessionId: session.id, data: { url: session.url } });
    }

    return NextResponse.json({ success: false, error: `Route not found: ${path}` }, { status: 404 });
  } catch (error: any) {
    console.error('API POST Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal error' }, { status: 500 });
  }
}

// PATCH Handler
export async function PATCH(request: NextRequest, context: RouteContext) {
  await connectToDatabase();
  const { slug = [] } = await context.params;
  const path = slug.join('/');
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  try {
    // 1. Update Profile: users/profile or auth/profile
    if (path === 'users/profile' || path === 'auth/profile') {
      const user = await getAuthUser(request);
      if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      const allowed = ['name', 'phone', 'businessName', 'address', 'bio', 'image'];
      allowed.forEach((field) => {
        if (body[field] !== undefined) (user as any)[field] = body[field];
      });
      await user.save();
      return NextResponse.json({ success: true, user: sanitizeUser(user), data: { user: sanitizeUser(user) } });
    }

    // 2. Vendor Updates Booking Status: bookings/:id/status
    if (path.startsWith('bookings/') && path.endsWith('/status')) {
      const id = slug[1];
      const user = await getAuthUser(request);
      if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      const { status } = body;
      const booking = await Booking.findById(id);
      if (!booking) {
        return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
      }
      if (booking.vendorId.toString() !== user._id.toString() && user.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
      }
      booking.status = status;
      await booking.save();
      return NextResponse.json({ success: true, booking, data: booking });
    }

    // 3. Customer Cancels Booking: bookings/:id/cancel
    if (path.startsWith('bookings/') && path.endsWith('/cancel')) {
      const id = slug[1];
      const user = await getAuthUser(request);
      if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      const booking = await Booking.findById(id);
      if (!booking) {
        return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
      }
      if (booking.customerId.toString() !== user._id.toString() && user.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
      }
      booking.status = 'cancelled';
      booking.cancellationReason = body.reason || 'Cancelled by customer';
      await booking.save();
      return NextResponse.json({ success: true, booking, data: booking });
    }

    // 4. Admin Block/Unblock User: admin/users/:id/block
    if (path.startsWith('admin/users/') && path.endsWith('/block')) {
      const id = slug[2];
      const user = await getAuthUser(request);
      if (!user || user.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized admin' }, { status: 403 });
      }
      const targetUser = await User.findById(id);
      if (!targetUser) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }
      targetUser.isBlocked = !targetUser.isBlocked;
      await targetUser.save();
      return NextResponse.json({ success: true, user: sanitizeUser(targetUser), isBlocked: targetUser.isBlocked });
    }

    // 5. Admin Approve/Pause Service: admin/services/:id/status
    if (path.startsWith('admin/services/') && path.endsWith('/status')) {
      const id = slug[2];
      const user = await getAuthUser(request);
      if (!user || user.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized admin' }, { status: 403 });
      }
      const service = await Service.findById(id);
      if (!service) {
        return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
      }
      service.status = body.status;
      await service.save();
      return NextResponse.json({ success: true, service, data: service });
    }

    // 6. Update Service: services/:id
    if (path.startsWith('services/') && slug.length === 2) {
      const id = slug[1];
      const user = await getAuthUser(request);
      if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      const service = await Service.findById(id);
      if (!service) {
        return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
      }
      if (service.vendorId.toString() !== user._id.toString() && user.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
      }
      Object.assign(service, body);
      await service.save();
      return NextResponse.json({ success: true, service, data: service });
    }

    return NextResponse.json({ success: false, error: `Route not found: ${path}` }, { status: 404 });
  } catch (error: any) {
    console.error('API PATCH Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal error' }, { status: 500 });
  }
}

// PUT Handler (maps to PATCH)
export async function PUT(request: NextRequest, context: RouteContext) {
  return PATCH(request, context);
}

// DELETE Handler
export async function DELETE(request: NextRequest, context: RouteContext) {
  await connectToDatabase();
  const { slug = [] } = await context.params;
  const path = slug.join('/');

  try {
    // Delete service: services/:id or admin/services/:id
    const id = path.startsWith('admin/services/') ? slug[2] : path.startsWith('services/') ? slug[1] : null;
    if (id) {
      const user = await getAuthUser(request);
      if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      const service = await Service.findById(id);
      if (!service) {
        return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
      }
      if (service.vendorId.toString() !== user._id.toString() && user.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
      }
      await Service.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: 'Service deleted successfully' });
    }

    return NextResponse.json({ success: false, error: `Route not found: ${path}` }, { status: 404 });
  } catch (error: any) {
    console.error('API DELETE Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal error' }, { status: 500 });
  }
}
