import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/api/api_client.dart';
import '../../../../core/api/api_endpoints.dart';
import '../../../../core/providers/gyroscope_provider.dart';
import '../../data/models/bike_model.dart';
import '../../../../features/auth/presentation/providers/auth_provider.dart';
import '../../../../features/dashboard/presentation/pages/bike_detail_view.dart';
import '../../../../features/dashboard/presentation/pages/notifications_view.dart';
import '../../../../features/dashboard/presentation/pages/scan_view.dart';
import '../../../../features/dashboard/presentation/pages/activity_view.dart';
import '../../../../features/dashboard/presentation/widgets/bike_image_widget.dart';

class HomeView extends ConsumerStatefulWidget {
  const HomeView({
    super.key,
    this.onExploreBikes,
    this.onScanQr,
    this.onMyBookings,
  });

  final VoidCallback? onExploreBikes;
  final VoidCallback? onScanQr;
  final VoidCallback? onMyBookings;

  @override
  ConsumerState<HomeView> createState() => _HomeViewState();
}

class _HomeViewState extends ConsumerState<HomeView> {
  late Future<List<BikeModel>> _bikesFuture;
  final ScrollController _scrollController = ScrollController();
  StreamSubscription<void>? _shakeSubscription;

  @override
  void initState() {
    super.initState();
    _bikesFuture = _fetchBikes();

    final gyroscopeService = ref.read(gyroscopeServiceProvider);
    gyroscopeService.startListening();
    _shakeSubscription = gyroscopeService.shakeStream.listen((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          0,
          duration: const Duration(milliseconds: 400),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _shakeSubscription?.cancel();
    _scrollController.dispose();
    super.dispose();
  }

  Future<List<BikeModel>> _fetchBikes() async {
    final dio = ref.read(dioProvider);
    try {
      final response = await dio.get(ApiEndpoints.bikes);
      final List<dynamic> bikesJson = response.data['bikes'] as List<dynamic>;
      return bikesJson.map((json) => BikeModel.fromJson(json)).toList();
    } catch (_) {
      return [];
    }
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authViewModelProvider);
    final rawName = (authState.authEntity?.fullName ?? '').trim();
    final userName = rawName.isEmpty ? 'Rider' : rawName;
    final greeting = _getGreeting();

    return SafeArea(
      child: SingleChildScrollView(
        controller: _scrollController,
        physics: const BouncingScrollPhysics(),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 10),
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '$greeting 👋',
                          style: TextStyle(
                            color: Colors.grey.shade400,
                            fontSize: 15,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          userName,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 26,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const NotificationsView(),
                        ),
                      );
                    },
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white.withValues(alpha: 0.06)),
                      ),
                      child: const Icon(Icons.notifications_none, size: 24, color: Colors.white70),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 28),

              // Search Bar
              GestureDetector(
                onTap: widget.onExploreBikes,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.06),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.search, color: Colors.white38, size: 20),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Search bikes by model or location',
                          style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Quick Actions
              Row(
                children: [
                  Expanded(
                    child: _QuickActionCard(
                      icon: Icons.search_rounded,
                      label: 'Find Bike',
                      onTap: widget.onExploreBikes,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _QuickActionCard(
                      icon: Icons.qr_code_scanner_rounded,
                      label: 'Scan QR',
                      onTap: () {
                        if (widget.onScanQr != null) {
                          widget.onScanQr!();
                        } else {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const ScanView()),
                          );
                        }
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _QuickActionCard(
                      icon: Icons.calendar_month_rounded,
                      label: 'My Bookings',
                      onTap: () {
                        if (widget.onMyBookings != null) {
                          widget.onMyBookings!();
                        } else {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const ActivityView()),
                          );
                        }
                      },
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 28),

              // Categories horizontal scroll
              _CategoryScroll(onCategoryTap: () {
                if (widget.onExploreBikes != null) {
                  widget.onExploreBikes!();
                }
              }),

              const SizedBox(height: 28),

              // Featured Bikes section
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Featured Bikes',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.3,
                    ),
                  ),
                  TextButton.icon(
                    onPressed: widget.onExploreBikes,
                    icon: const Icon(Icons.explore_outlined, size: 18, color: Color(0xFF00C2CB)),
                    label: const Text(
                      'See All',
                      style: TextStyle(
                        color: Color(0xFF00C2CB),
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              FutureBuilder<List<BikeModel>>(
                future: _bikesFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Center(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 40),
                        child: CircularProgressIndicator(
                          color: const Color(0xFF00C2CB),
                          strokeWidth: 2.5,
                        ),
                      ),
                    );
                  }

                  if (snapshot.hasError || !snapshot.hasData || snapshot.data!.isEmpty) {
                    return Center(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 40),
                        child: Text(
                          'No bikes available right now',
                          style: TextStyle(color: Colors.grey.shade500, fontSize: 14),
                        ),
                      ),
                    );
                  }

                  final bikes = snapshot.data!;
                  final available = bikes.where((b) => b.isAvailable).toList();
                  final displayBikes = available.isEmpty ? bikes : available;
                  final featured = displayBikes.length > 4 ? displayBikes.sublist(0, 4) : displayBikes;

                  return Column(
                    children: List.generate(featured.length, (index) {
                      final bike = featured[index];
                      return Padding(
                        padding: EdgeInsets.only(
                          bottom: index < featured.length - 1 ? 16 : 0,
                        ),
                        child: GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => BikeDetailView(
                                  id: bike.id,
                                  name: bike.name,
                                  model: bike.model,
                                  pricePerHour: bike.pricePerHour,
                                  imageUrl: bike.imageUrl,
                                  location: bike.location,
                                ),
                              ),
                            );
                          },
                          child: _FeaturedBikeCard(bike: bike),
                        ),
                      );
                    }),
                  );
                },
              ),

              const SizedBox(height: 24),

              // Promotional Banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF00C2CB), Color(0xFF0066FF)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Ride More, Save More',
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'Get 20% off on your first weekly rental',
                            style: GoogleFonts.poppins(
                              color: Colors.white.withValues(alpha: 0.9),
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Icon(Icons.local_offer_rounded, size: 48, color: Colors.white),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              if (widget.onExploreBikes != null)
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: widget.onExploreBikes,
                    icon: const Icon(Icons.grid_view_rounded, size: 18, color: Color(0xFF00C2CB)),
                    label: const Text(
                      'Explore All Bikes',
                      style: TextStyle(
                        color: Color(0xFF00C2CB),
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Color(0xFF00C2CB), width: 1.5),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                  ),
                ),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback? onTap;

  const _QuickActionCard({required this.icon, required this.label, this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 12),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.04),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withValues(alpha: 0.06)),
        ),
        child: Column(
          children: [
            Icon(icon, color: const Color(0xFF00C2CB), size: 24),
            const SizedBox(height: 8),
            Text(
              label,
              textAlign: TextAlign.center,
              style: GoogleFonts.poppins(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CategoryScroll extends StatelessWidget {
  final VoidCallback onCategoryTap;

  const _CategoryScroll({required this.onCategoryTap});

  static const List<({String label, IconData icon})> _categories = [
    (label: 'Sport', icon: Icons.speed_rounded),
    (label: 'Cruiser', icon: Icons.two_wheeler_rounded),
    (label: 'Commuter', icon: Icons.directions_bike_rounded),
    (label: 'Adventure', icon: Icons.terrain_rounded),
    (label: 'Naked', icon: Icons.motorcycle_rounded),
  ];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 52,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _categories.length,
        itemBuilder: (context, index) {
          final cat = _categories[index];
          return Padding(
            padding: EdgeInsets.only(right: index < _categories.length - 1 ? 10 : 0),
            child: ActionChip(
              onPressed: onCategoryTap,
              avatar: Icon(cat.icon, size: 18, color: const Color(0xFF00C2CB)),
              label: Text(
                cat.label,
                style: GoogleFonts.poppins(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
              backgroundColor: const Color(0xFF1A1A1A),
              side: const BorderSide(color: Colors.white10),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            ),
          );
        },
      ),
    );
  }
}

class _FeaturedBikeCard extends StatelessWidget {
  final BikeModel bike;

  const _FeaturedBikeCard({required this.bike});

  @override
  Widget build(BuildContext context) {
    final statusColor = bike.isAvailable ? const Color(0xFF00C2CB) : Colors.redAccent;
    final statusLabel = bike.isAvailable ? 'Available' : 'Booked';

    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.04),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.06)),
      ),
      child: Row(
        children: [
          // Bike Image
          ClipRRect(
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(20),
              bottomLeft: Radius.circular(20),
            ),
            child: BikeImage(
              imageUrl: bike.imageUrl,
              width: 120,
              height: 120,
              fit: BoxFit.cover,
            ),
          ),

          // Bike Details
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    bike.name,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    bike.model,
                    style: TextStyle(
                      color: Colors.grey.shade400,
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      const Icon(
                        Icons.location_on_outlined,
                        size: 14,
                        color: Colors.white38,
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          bike.location,
                          style: TextStyle(
                            color: Colors.grey.shade400,
                            fontSize: 11,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Rs. ${bike.pricePerHour.toStringAsFixed(0)}/hr',
                        style: const TextStyle(
                          color: Color(0xFF00C2CB),
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: statusColor.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 6,
                              height: 6,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: statusColor,
                              ),
                            ),
                            const SizedBox(width: 6),
                            Text(
                              statusLabel,
                              style: TextStyle(
                                color: statusColor,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
