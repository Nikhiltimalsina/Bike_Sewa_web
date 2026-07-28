'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Cookies from 'js-cookie';
import { getMyBookingsApi, cancelBookingApi, returnBikeApi, Booking } from '@/api/booking.api';
import { useAuth } from '@/context/AuthContext';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

// ─── Types ───────────────────────────────────────────────────────
type PaymentMethodItem = {
  id: string;
  icon: string;
  name: string;
  type: 'card' | 'esewa' | 'khalti' | 'bank';
  last4?: string | null;
  accountName?: string;
  isDefault: boolean;
  enabled: boolean;
};

// ─── Helpers ─────────────────────────────────────────────────────
function getAvatarUrl(avatar: string): string {
  if (!avatar) return '';
  if (avatar.startsWith('http') || avatar.startsWith('data:')) return avatar;
  return BACKEND_URL + '/uploads/avatars/' + avatar;
}

function getStatusBadge(status: string) {
  const config: Record<string, { label: string; colors: string }> = {
    pending: { label: 'Pending', colors: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' },
    confirmed: { label: 'Confirmed', colors: 'bg-blue-500/20 text-blue-300 border-blue-400/30' },
    active: { label: 'Active', colors: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' },
    completed: { label: 'Completed', colors: 'bg-green-500/20 text-green-300 border-green-400/30' },
    cancelled: { label: 'Cancelled', colors: 'bg-red-500/20 text-red-300 border-red-400/30' },
  };
  const c = config[status] || { label: status, colors: 'bg-white/10 text-white/50 border-white/20' };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${c.colors}`}>
      {c.label}
    </span>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// ─── Main Component ──────────────────────────────────────────────
export default function MyAccountPage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState({ fullName: 'Rider', email: 'rider@example.com', phone: '', avatar: '' });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Payment Methods state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodItem[]>([
    { id: '1', icon: '💳', name: 'Visa Card', type: 'card', last4: '4242', isDefault: true, enabled: true },
    { id: '2', icon: '🟢', name: 'eSewa Wallet', type: 'esewa', accountName: 'Rider eSewa (9800000000)', isDefault: false, enabled: true },
    { id: '3', icon: '🔵', name: 'Khalti Wallet', type: 'khalti', accountName: 'Rider Khalti', isDefault: false, enabled: true },
  ]);
  const [isAddPaymentModal, setIsAddPaymentModal] = useState(false);
  const [newPaymentType, setNewPaymentType] = useState<'card' | 'esewa' | 'khalti' | 'bank'>('card');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // Reviews state
  const [reviewSelectedId, setReviewSelectedId] = useState<number | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHovered, setReviewHovered] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [pastReviews] = useState([
    { id: 1, bike: 'Royal Enfield Classic 350', date: 'Nov 2023', amount: 'NPR 15,000', location: 'Pokhara Valley Tour', reviewed: false, rating: 0, comment: '', image: '/images/royal%20enfield.avif' },
    { id: 2, bike: 'Yamaha MT-15', date: 'Aug 2023', amount: 'NPR 5,600', location: 'Kathmandu City', reviewed: true, rating: 4, comment: 'Great bike for city rides.', image: '/images/mt15.jpeg' },
  ]);

  // Return Bike state
  const [returnBookingId, setReturnBookingId] = useState('');
  const [returnLocation, setReturnLocation] = useState('thamel');
  const [fuelLevel, setFuelLevel] = useState('full');
  const [odometerReading, setOdometerReading] = useState('');
  const [conditionNotes, setConditionNotes] = useState('');
  const [returnSubmitted, setReturnSubmitted] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnError, setReturnError] = useState('');

  useEffect(() => {
    const info = Cookies.get('user_info');
    if (info) {
      try {
        const parsed = JSON.parse(info);
        setUser(parsed);
      } catch (_e) {}
    } else if (authUser) {
      setUser({
        fullName: authUser.fullName || 'Rider',
        email: authUser.email || 'rider@example.com',
        phone: authUser.phone || '',
        avatar: authUser.avatar || '',
      });
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getMyBookingsApi();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error('Failed to load bookings', err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [authUser]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(bookingId);
    try {
      await cancelBookingApi(bookingId);
      const data = await getMyBookingsApi();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Failed to cancel booking', err);
    } finally {
      setCancellingId(null);
    }
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnBookingId.trim()) {
      setReturnError('Please select or enter a valid Booking ID');
      return;
    }
    setReturnError('');
    setReturnLoading(true);
    try {
      await returnBikeApi(returnBookingId);
      setReturnSubmitted(true);
    } catch {
      setReturnSubmitted(true);
    } finally {
      setReturnLoading(false);
    }
  };

  const handleReviewSubmit = () => {
    if (reviewRating === 0 || !reviewComment.trim()) return;
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSelectedId(null);
      setReviewRating(0);
      setReviewComment('');
      setReviewSubmitted(false);
    }, 2000);
  };

  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let icon = '💳', name = 'Credit Card';
    let last4: string | null = null, accountName: string | undefined;
    if (newPaymentType === 'card') { icon = '💳'; name = 'Visa / MasterCard'; last4 = cardNumber.slice(-4) || '4321'; }
    else if (newPaymentType === 'esewa') { icon = '🟢'; name = 'eSewa Wallet'; accountName = accountNumber ? `eSewa (${accountNumber})` : 'eSewa Account'; }
    else if (newPaymentType === 'khalti') { icon = '🔵'; name = 'Khalti Wallet'; accountName = accountNumber ? `Khalti (${accountNumber})` : 'Khalti Account'; }
    else if (newPaymentType === 'bank') { icon = '🏦'; name = 'Bank Deposit'; accountName = accountNumber ? `Bank Account (${accountNumber})` : 'Direct Transfer'; }
    const newMethod: PaymentMethodItem = { id: Date.now().toString(), icon, name, type: newPaymentType, last4, accountName, isDefault: paymentMethods.length === 0, enabled: true };
    setPaymentMethods(prev => [...prev, newMethod]);
    setIsAddPaymentModal(false);
    setCardHolder(''); setCardNumber(''); setAccountNumber('');
  };

  const activeRentals = bookings.filter((b: Booking) => b.status === 'active' || b.status === 'confirmed');
  const pastRentals = bookings.filter((b: Booking) => b.status === 'completed' || b.status === 'cancelled');
  const filteredHistory = pastRentals.filter((b: Booking) => {
    if (historyFilter === 'completed') return b.status === 'completed';
    if (historyFilter === 'cancelled') return b.status === 'cancelled';
    return true;
  });
  const totalSpent = bookings.filter((b: Booking) => b.status !== 'cancelled').reduce((sum: number, b: Booking) => sum + (Number(b.totalPrice) || 0), 0);

  // ─── SIDEBAR / SECTION NAV ─────────────────────────────────────
  const sections = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'active', label: `🏍️ Active (${activeRentals.length})` },
    { id: 'history', label: '📜 History' },
    { id: 'payments', label: '💳 Payments' },
    { id: 'reviews', label: '⭐ Reviews' },
    { id: 'return', label: '🔁 Return Bike' },
  ];

  // ─── MODAL OVERLAY ─────────────────────────────────────────────
  const ModalOverlay = ({ children }: { children: React.ReactNode }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      {children}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full">
        {/* ═══════ PROFILE HEADER ═══════ */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0d1627] via-[#111c33] to-[#0d1627] rounded-3xl border border-white/10 p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-600 p-0.5 shadow-xl shadow-emerald-500/20 shrink-0">
                <div className="w-full h-full rounded-[14px] bg-[#0c1322] flex items-center justify-center text-3xl font-black text-emerald-400 overflow-hidden">
                  {user.avatar ? (
                    <img src={getAvatarUrl(user.avatar)} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    user.fullName?.[0]?.toUpperCase() || 'R'
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-white">{user.fullName || 'Rider'}</h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">Verified Rider</span>
                </div>
                <p className="text-white/50 text-sm mt-0.5">{user.email}</p>
                {user.phone && <p className="text-white/40 text-xs mt-0.5">📞 {user.phone}</p>}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <Link href="/profile" className="flex-1 md:flex-none text-center px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all">✏️ Edit Profile</Link>
              <button onClick={() => setActiveSection('payments')} className="flex-1 md:flex-none text-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all">💳 Payment Methods</button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
            <div>
              <div className="text-xs text-white/40 font-medium">Total Rentals</div>
              <div className="text-2xl font-black text-white mt-1">{bookings.length}</div>
            </div>
            <div>
              <div className="text-xs text-white/40 font-medium">Active Rides</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{activeRentals.length}</div>
            </div>
            <div>
              <div className="text-xs text-white/40 font-medium">Completed Rides</div>
              <div className="text-2xl font-black text-blue-400 mt-1">{bookings.filter((b: Booking) => b.status === 'completed').length}</div>
            </div>
            <div>
              <div className="text-xs text-white/40 font-medium">Total NPR Spent</div>
              <div className="text-2xl font-black text-teal-300 mt-1">NPR {totalSpent.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* ═══════ SIDEBAR LAYOUT ═══════ */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:w-56 shrink-0">
            <nav className="bg-[#0d1627] rounded-2xl border border-white/10 p-2 sticky top-24">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all mb-0.5 ${
                    activeSection === s.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* ═══ OVERVIEW ═══ */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-white">Account Overview</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-[#0d1627] rounded-2xl border border-white/10 p-5">
                    <div className="text-white/40 text-xs font-medium mb-1">Membership</div>
                    <div className="text-white font-bold">Premium Rider</div>
                    <div className="text-emerald-400 text-xs mt-1">✅ Verified • Active since {new Date().getFullYear()}</div>
                  </div>
                  <div className="bg-[#0d1627] rounded-2xl border border-white/10 p-5">
                    <div className="text-white/40 text-xs font-medium mb-1">Quick Actions</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <button onClick={() => setActiveSection('active')} className="px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400 text-xs font-semibold">View Rentals</button>
                      <button onClick={() => setActiveSection('return')} className="px-3 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 text-xs font-semibold">Return Bike</button>
                      <button onClick={() => setActiveSection('reviews')} className="px-3 py-1 rounded-lg bg-yellow-600/20 text-yellow-400 text-xs font-semibold">Write Review</button>
                    </div>
                  </div>
                  <div className="bg-[#0d1627] rounded-2xl border border-white/10 p-5">
                    <div className="text-white/40 text-xs font-medium mb-1">Saved Payment Methods</div>
                    <div className="text-white font-bold">{paymentMethods.length} methods</div>
                    <div className="text-white/40 text-xs mt-1">{paymentMethods.find(m => m.isDefault)?.name || 'None set as default'}</div>
                  </div>
                  <div className="bg-[#0d1627] rounded-2xl border border-white/10 p-5">
                    <div className="text-white/40 text-xs font-medium mb-1">Reviews Given</div>
                    <div className="text-white font-bold">{pastReviews.filter(r => r.reviewed).length} reviews</div>
                    <button onClick={() => setActiveSection('reviews')} className="text-blue-400 text-xs font-semibold mt-1 hover:underline">Write a review →</button>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ ACTIVE RENTALS ═══ */}
            {activeSection === 'active' && (
              <section>
                <h2 className="text-lg font-bold text-white mb-4">Active & Upcoming Rentals</h2>
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-white/40 text-sm">Loading your rentals...</p>
                    </div>
                  </div>
                ) : activeRentals.length === 0 ? (
                  <div className="bg-[#0d1627] rounded-2xl border border-white/10 p-12 text-center">
                    <div className="text-5xl mb-4">🏍️</div>
                    <h3 className="text-xl font-bold text-white mb-2">No Active Rentals</h3>
                    <p className="text-white/40 text-sm max-w-md mx-auto mb-6">You don&apos;t have any active or upcoming rentals. Browse our bikes and start your journey!</p>
                    <Link href="/bikes" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/20">Browse Bikes</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeRentals.map((booking: Booking) => (
                      <div key={booking.id} className="bg-[#0d1627] rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all">
                        <div className="p-5 flex flex-col sm:flex-row gap-5">
                          <div className="w-full sm:w-32 h-24 rounded-xl bg-slate-800 border border-white/10 overflow-hidden shrink-0">
                            {booking.bikeImageUrl ? (
                              <img src={booking.bikeImageUrl} alt={booking.bikeName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-3xl">🏍️</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                              <div>
                                <h3 className="text-lg font-bold text-white">{booking.bikeName || 'Bike'}</h3>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  {getStatusBadge(booking.status)}
                                  <span className="text-white/30 text-xs">ID: {booking.id.slice(-6).toUpperCase()}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-black text-emerald-400">NPR {Number(booking.totalPrice).toLocaleString()}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-sm">
                              <div>
                                <span className="text-white/40 text-xs block">Start</span>
                                <span className="text-white font-medium">{formatDate(booking.startDate)}</span>
                                <span className="text-white/60 text-xs block">{formatTime(booking.startDate)}</span>
                              </div>
                              <div>
                                <span className="text-white/40 text-xs block">End</span>
                                <span className="text-white font-medium">{formatDate(booking.endDate)}</span>
                                <span className="text-white/60 text-xs block">{formatTime(booking.endDate)}</span>
                              </div>
                              {booking.pickupLocation && (
                                <div>
                                  <span className="text-white/40 text-xs block">Pickup</span>
                                  <span className="text-white/70 text-xs">{booking.pickupLocation}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                              <button onClick={() => setSelectedReceipt(booking)} className="px-4 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all">📋 View Details</button>
                              <button onClick={() => handleCancel(booking.id)} disabled={cancellingId === booking.id || booking.status !== 'confirmed'} className="px-4 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                {cancellingId === booking.id ? 'Cancelling...' : booking.status === 'confirmed' ? '✕ Cancel Booking' : 'Ongoing'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ═══ RENTAL HISTORY ═══ */}
            {activeSection === 'history' && (
              <section>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <h2 className="text-lg font-bold text-white">Rental History</h2>
                  <div className="flex items-center gap-2 bg-[#0d1627] rounded-lg border border-white/10 p-1">
                    {(['all', 'completed', 'cancelled'] as const).map((filter) => (
                      <button key={filter} onClick={() => setHistoryFilter(filter)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${historyFilter === filter ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>
                        {filter === 'all' ? 'All' : filter === 'completed' ? '✅ Completed' : '❌ Cancelled'}
                      </button>
                    ))}
                  </div>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-white/40 text-sm">Loading history...</p>
                    </div>
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="bg-[#0d1627] rounded-2xl border border-white/10 p-12 text-center">
                    <div className="text-5xl mb-4">📭</div>
                    <h3 className="text-xl font-bold text-white mb-2">No Rental History</h3>
                    <p className="text-white/40 text-sm max-w-md mx-auto">
                      {historyFilter === 'all' ? 'Your past rentals will appear here once you complete a ride.' : `No ${historyFilter} rentals found.`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredHistory.map((booking: Booking) => (
                      <div key={booking.id} className="bg-[#0d1627] rounded-xl border border-white/10 p-4 hover:border-white/20 transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className="w-14 h-14 rounded-xl bg-slate-800 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                              {booking.bikeImageUrl ? <img src={booking.bikeImageUrl} alt={booking.bikeName} className="w-full h-full object-cover" /> : <span className="text-2xl">🏍️</span>}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-white text-sm">{booking.bikeName || 'Bike'}</h4>
                                {getStatusBadge(booking.status)}
                              </div>
                              <p className="text-white/40 text-xs mt-0.5">{formatDate(booking.startDate)} – {formatDate(booking.endDate)}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-bold text-white">NPR {Number(booking.totalPrice).toLocaleString()}</div>
                            <button onClick={() => setSelectedReceipt(booking)} className="text-blue-400 hover:text-blue-300 text-xs font-semibold mt-1">View Receipt →</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ═══ PAYMENT METHODS ═══ */}
            {activeSection === 'payments' && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">💳 Payment Methods</h2>
                  <button onClick={() => setIsAddPaymentModal(true)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all">+ Add New Method</button>
                </div>
                <div className="space-y-3">
                  {paymentMethods.length === 0 ? (
                    <div className="bg-[#0d1627] rounded-2xl border border-white/10 p-12 text-center text-white/30 text-sm">No payment methods saved yet.</div>
                  ) : (
                    paymentMethods.map((m) => (
                      <div key={m.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${m.isDefault ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-2xl shrink-0">{m.icon}</div>
                          <div>
                            <div className="font-bold text-sm text-white flex items-center gap-2">
                              {m.name}{m.last4 && <span className="text-white/50 text-xs font-mono">•••• {m.last4}</span>}
                            </div>
                            <div className="text-white/40 text-xs mt-0.5 flex items-center gap-2">
                              {m.accountName && <span>{m.accountName}</span>}
                              {m.isDefault && <span className="text-emerald-400 font-bold text-[10px] uppercase bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">Default</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {!m.isDefault && <button onClick={() => setPaymentMethods(prev => prev.map(p => ({ ...p, isDefault: p.id === m.id })))} className="text-xs px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-semibold">Set Default</button>}
                          <button onClick={() => setPaymentMethods(prev => prev.filter(p => p.id !== m.id))} className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 font-semibold">Remove</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4 bg-white/5 rounded-2xl border border-white/5 p-4 text-center text-xs text-white/40">🔒 End-to-end encryption. We support eSewa, Khalti, Visa, Mastercard, and Bank Transfers.</div>
              </section>
            )}

            {/* ═══ REVIEWS ═══ */}
            {activeSection === 'reviews' && (
              <section>
                <h2 className="text-lg font-bold text-white mb-4">⭐ Your Reviews</h2>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    {pastReviews.map((rental) => (
                      <div key={rental.id} className={`bg-[#0d1627] rounded-2xl border p-5 transition-all ${reviewSelectedId === rental.id ? 'border-blue-500/50' : 'border-white/10'}`}>
                        <div className="flex gap-4 items-start">
                          <div className="w-16 h-12 rounded-xl bg-slate-800 overflow-hidden shrink-0" style={{ backgroundImage: `url('${rental.image}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.6 }} />
                          <div className="flex-1">
                            <h3 className="font-bold text-sm">{rental.bike}</h3>
                            <p className="text-white/40 text-xs">{rental.location} • {rental.date} • {rental.amount}</p>
                            {rental.reviewed ? (
                              <div className="mt-2">
                                <div className="text-yellow-400 text-sm">{'★'.repeat(rental.rating)}{'☆'.repeat(5 - rental.rating)}</div>
                                <p className="text-white/40 text-xs mt-1">{rental.comment}</p>
                              </div>
                            ) : (
                              <button onClick={() => { setReviewSelectedId(rental.id); setReviewRating(0); setReviewComment(''); }} className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:bg-blue-600/30 font-semibold">+ Write Review</button>
                            )}
                          </div>
                        </div>
                        {reviewSelectedId === rental.id && !rental.reviewed && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="mb-3">
                              <div className="text-xs font-semibold text-white/40 uppercase mb-2">Your Rating</div>
                              <div className="flex gap-1">{[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onMouseEnter={() => setReviewHovered(star)} onMouseLeave={() => setReviewHovered(0)} onClick={() => setReviewRating(star)}
                                  className={`text-2xl transition-colors ${(reviewHovered || reviewRating) >= star ? 'text-yellow-400' : 'text-white/20'}`}>★</button>
                              ))}</div>
                            </div>
                            <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Share your experience..." rows={3}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 placeholder:text-white/30 resize-none" />
                            <div className="flex gap-2 mt-3">
                              <button onClick={handleReviewSubmit} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold text-white transition-colors">
                                {reviewSubmitted ? '✓ Submitted!' : 'Submit Review'}
                              </button>
                              <button onClick={() => setReviewSelectedId(null)} className="px-5 py-2 border border-white/10 rounded-xl text-sm text-white/50 hover:text-white">Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {pastReviews.filter(r => !r.reviewed).length === 0 && (
                      <div className="bg-[#0d1627] rounded-2xl border border-white/10 p-8 text-center">
                        <div className="text-4xl mb-2">⭐</div>
                        <p className="text-white/40 text-sm">You&apos;ve reviewed all your rides. Rent a new bike to leave another review!</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="bg-[#0d1627] rounded-2xl border border-white/10 p-6">
                      <div className="flex items-start justify-between mb-5">
                        <div>
                          <div className="text-5xl font-black">4.8</div>
                          <div className="text-yellow-400 text-lg mt-1">★★★★★</div>
                          <div className="text-white/40 text-xs mt-1">Based on 2,341 reviews</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const pcts: Record<number, number> = { 5: 78, 4: 14, 3: 5, 2: 2, 1: 1 };
                          return (
                            <div key={stars} className="flex items-center gap-3">
                              <span className="text-xs text-white/40 w-4">{stars}</span>
                              <span className="text-yellow-400 text-xs">★</span>
                              <div className="flex-1 bg-white/10 rounded-full h-1.5"><div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${pcts[stars]}%` }} /></div>
                              <span className="text-xs text-white/40 w-8">{pcts[stars]}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="bg-[#0d1627] rounded-2xl border border-white/10 p-6">
                      <h3 className="font-bold mb-4">Community Ratings</h3>
                      <div className="space-y-3">
                        {[['Overall', 4.8], ['Bike Quality', 4.9], ['Service', 4.7], ['Value', 4.6]].map(([label, val]) => (
                          <div key={label} className="flex items-center justify-between">
                            <span className="text-sm text-white/60">{label}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-white/10 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(Number(val) / 5) * 100}%` }} /></div>
                              <span className="text-sm font-bold">{val}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ═══ RETURN BIKE ═══ */}
            {activeSection === 'return' && (
              <section>
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">🔁 Vehicle Return Center</span>
                  <h2 className="text-lg font-bold text-white">Return Bike</h2>
                  <p className="text-white/50 text-xs mt-1">Initiate vehicle return, submit inspection details, and finalize your rental.</p>
                </div>

                {returnSubmitted ? (
                  <div className="bg-[#0d1627] rounded-3xl border border-emerald-500/30 p-8 sm:p-10 text-center shadow-2xl">
                    <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-400/30 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl shadow-emerald-500/20">✅</div>
                    <h2 className="text-2xl font-black mb-2 text-white">Return Request Received!</h2>
                    <p className="text-white/60 text-sm max-w-md mx-auto mb-6">
                      Your return request for booking <strong className="text-emerald-400 font-mono">#{returnBookingId.slice(-8).toUpperCase()}</strong> has been processed.
                    </p>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10 max-w-md mx-auto text-xs space-y-2 mb-6 text-left">
                      <div className="flex justify-between"><span className="text-white/40">Return Location</span><span className="font-bold text-white uppercase">{returnLocation}</span></div>
                      <div className="flex justify-between"><span className="text-white/40">Fuel Level</span><span className="font-bold text-emerald-400 uppercase">{fuelLevel}</span></div>
                      {odometerReading && <div className="flex justify-between"><span className="text-white/40">Odometer</span><span className="font-bold text-white">{odometerReading} km</span></div>}
                    </div>
                    <button onClick={() => { setReturnSubmitted(false); setReturnBookingId(''); setConditionNotes(''); setOdometerReading(''); }}
                      className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl text-sm transition-all">Done</button>
                  </div>
                ) : (
                  <div className="bg-[#0d1627] rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl">
                    {returnError && <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{returnError}</div>}
                    <form onSubmit={handleReturnSubmit} className="space-y-5">
                      <div>
                        <label className="text-xs font-semibold text-white/50 uppercase mb-2 block">Select Active Booking</label>
                        {activeRentals.length > 0 ? (
                          <select value={returnBookingId} onChange={(e) => setReturnBookingId(e.target.value)}
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-400">
                            <option value="" className="bg-[#0d1627]">Select a booking...</option>
                            {activeRentals.map((b) => (
                              <option key={b.id} value={b.id} className="bg-[#0d1627]">#{b.id.slice(-8).toUpperCase()} - {b.bikeName}</option>
                            ))}
                          </select>
                        ) : (
                          <input type="text" value={returnBookingId} onChange={(e) => setReturnBookingId(e.target.value)} placeholder="Enter Booking ID"
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 placeholder:text-white/30" />
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-white/50 uppercase mb-2 block">Return Location</label>
                        <select value={returnLocation} onChange={(e) => setReturnLocation(e.target.value)}
                          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-400">
                          <option value="thamel" className="bg-[#0d1627]">Thamel Hub (Kathmandu)</option>
                          <option value="boudha" className="bg-[#0d1627]">Boudha Hub (Kathmandu)</option>
                          <option value="lalitpur" className="bg-[#0d1627]">Jhamsikhel (Lalitpur)</option>
                          <option value="pokhara" className="bg-[#0d1627]">Lakeside Hub (Pokhara)</option>
                          <option value="bhaktapur" className="bg-[#0d1627]">Durbar Square Hub (Bhaktapur)</option>
                        </select>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-white/50 uppercase mb-2 block">Fuel Level</label>
                          <select value={fuelLevel} onChange={(e) => setFuelLevel(e.target.value)}
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-400">
                            <option value="full" className="bg-[#0d1627]">Full Tank (100%)</option>
                            <option value="3/4" className="bg-[#0d1627]">3/4 Tank (75%)</option>
                            <option value="1/2" className="bg-[#0d1627]">Half Tank (50%)</option>
                            <option value="1/4" className="bg-[#0d1627]">1/4 Tank (25%)</option>
                            <option value="empty" className="bg-[#0d1627]">Reserve / Empty</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-white/50 uppercase mb-2 block">Odometer (KM)</label>
                          <input type="number" value={odometerReading} onChange={(e) => setOdometerReading(e.target.value)} placeholder="e.g. 14250"
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 placeholder:text-white/30" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-white/50 uppercase mb-2 block">Condition Notes (Optional)</label>
                        <textarea rows={3} value={conditionNotes} onChange={(e) => setConditionNotes(e.target.value)} placeholder="Mention any scratches or issues..."
                          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 placeholder:text-white/30 resize-none" />
                      </div>
                      <button type="submit" disabled={returnLoading || !returnBookingId.trim()}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 rounded-xl text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all">
                        {returnLoading ? 'Submitting...' : 'Submit Return Request →'}
                      </button>
                    </form>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </main>

      {/* ═══════ RECEIPT MODAL ═══════ */}
      {selectedReceipt && (
        <ModalOverlay>
          <div className="bg-[#0d1627] rounded-3xl border border-white/10 w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-emerald-500/10 to-blue-600/10 px-6 py-5 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white">Booking Receipt</h3>
                <button onClick={() => setSelectedReceipt(null)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all">✕</button>
              </div>
              <p className="text-white/40 text-xs mt-1">Booking ID: #{selectedReceipt.id.slice(-8).toUpperCase()}</p>
            </div>
            <div className="p-6 space-y-5">
              {selectedReceipt.bikeImageUrl && (
                <div className="h-36 rounded-xl overflow-hidden border border-white/10 bg-slate-800">
                  <img src={selectedReceipt.bikeImageUrl} alt={selectedReceipt.bikeName} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-lg">{selectedReceipt.bikeName || 'Bike'}</h4>
                  {getStatusBadge(selectedReceipt.status)}
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/40">Total Paid</div>
                  <div className="text-2xl font-black text-emerald-400">NPR {Number(selectedReceipt.totalPrice).toLocaleString()}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm bg-white/5 rounded-xl p-4 border border-white/10">
                <div><div className="text-white/40 text-xs">Start</div><div className="text-white font-semibold">{formatDate(selectedReceipt.startDate)}</div><div className="text-white/50 text-xs">{formatTime(selectedReceipt.startDate)}</div></div>
                <div><div className="text-white/40 text-xs">End</div><div className="text-white font-semibold">{formatDate(selectedReceipt.endDate)}</div><div className="text-white/50 text-xs">{formatTime(selectedReceipt.endDate)}</div></div>
                {selectedReceipt.pickupLocation && <div><div className="text-white/40 text-xs">Pickup</div><div className="text-white/70 text-xs">{selectedReceipt.pickupLocation}</div></div>}
                <div><div className="text-white/40 text-xs">Booked On</div><div className="text-white/70 text-xs">{formatDate(selectedReceipt.createdAt)}</div></div>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between text-sm">
                <span className="text-white/40">Booking ID</span>
                <span className="text-white font-mono text-xs">{selectedReceipt.id}</span>
              </div>
            </div>
            <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex justify-end">
              <button onClick={() => setSelectedReceipt(null)} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-sm transition-all">Close</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* ═══════ ADD PAYMENT MODAL ═══════ */}
      {isAddPaymentModal && (
        <ModalOverlay>
          <div className="bg-[#0d1627] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setIsAddPaymentModal(false)} className="absolute top-4 right-4 text-white/40 hover:text-white">✕</button>
            <h3 className="text-xl font-black text-white mb-1">Add Payment Method</h3>
            <p className="text-white/40 text-xs mb-6">Select payment channel and save details</p>
            <form onSubmit={handleAddPaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-white/50 mb-2">Payment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: '💳' },
                    { id: 'esewa', label: 'eSewa', icon: '🟢' },
                    { id: 'khalti', label: 'Khalti', icon: '🔵' },
                    { id: 'bank', label: 'Bank Transfer', icon: '🏦' },
                  ].map((item) => (
                    <button key={item.id} type="button" onClick={() => setNewPaymentType(item.id as any)}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${newPaymentType === item.id ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}`}>
                      <span>{item.icon}</span><span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {newPaymentType === 'card' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-white/50 mb-1">Cardholder Name</label>
                    <input type="text" required value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} placeholder="e.g. Aashish Sharma"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-white/50 mb-1">Card Number</label>
                    <input type="text" required maxLength={16} value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4242 •••• •••• 4242"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-400" />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-semibold uppercase text-white/50 mb-1">
                    {newPaymentType === 'esewa' ? 'eSewa ID / Mobile' : newPaymentType === 'khalti' ? 'Khalti Number' : 'Account Number'}
                  </label>
                  <input type="text" required value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="98XXXXXXXX"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-400" />
                </div>
              )}
              <button type="submit" className="w-full py-3 mt-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all">Save Payment Method</button>
            </form>
          </div>
        </ModalOverlay>
      )}

      <Footer />
    </div>
  );
}

