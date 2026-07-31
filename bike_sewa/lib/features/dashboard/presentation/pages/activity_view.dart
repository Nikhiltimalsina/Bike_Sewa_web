import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/constants/color_constants.dart';
import '../../../../core/providers/gyroscope_provider.dart';
import '../../../booking/domain/entities/booking_entity.dart';
import '../../../booking/presentation/providers/booking_provider.dart';

/// Activity tab — the rider's past and upcoming bookings.
class ActivityView extends ConsumerStatefulWidget {
  const ActivityView({super.key});

  @override
  ConsumerState<ActivityView> createState() => _ActivityViewState();
}

class _ActivityViewState extends ConsumerState<ActivityView> {
  final ScrollController _scrollController = ScrollController();
  StreamSubscription<void>? _shakeSubscription;

  @override
  void initState() {
    super.initState();
    Future.microtask(
      () => ref.read(myBookingsProvider.notifier).loadBookings(),
    );

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

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(myBookingsProvider);

    return SafeArea(
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Activity',
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                IconButton(
                  onPressed: () =>
                      ref.read(myBookingsProvider.notifier).loadBookings(),
                  icon: const Icon(Icons.refresh, color: Colors.white54),
                ),
              ],
            ),
          ),
          Expanded(
            child: RefreshIndicator(
              color: AppColors.cyan,
              backgroundColor: AppColors.cardBg,
              onRefresh: () =>
                  ref.read(myBookingsProvider.notifier).loadBookings(),
              child: _buildBody(state),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBody(MyBookingsState state) {
    return switch (state) {
      MyBookingsInitial() || MyBookingsLoading() => const Center(
        child: CircularProgressIndicator(color: AppColors.cyan),
      ),
      MyBookingsFailure(:final message) => ListView(
        children: [
          const SizedBox(height: 80),
          Icon(Icons.error_outline, color: AppColors.error, size: 36),
          const SizedBox(height: 8),
          Text(
            message,
            textAlign: TextAlign.center,
            style: GoogleFonts.poppins(color: Colors.white54, fontSize: 12),
          ),
        ],
      ),
      MyBookingsLoaded(:final bookings) when bookings.isEmpty => ListView(
        children: [
          const SizedBox(height: 80),
          const Icon(
            Icons.receipt_long_outlined,
            color: Colors.white24,
            size: 40,
          ),
          const SizedBox(height: 10),
          Text(
            'No rides yet — book a bike to see it here',
            textAlign: TextAlign.center,
            style: GoogleFonts.poppins(color: Colors.white54, fontSize: 13),
          ),
        ],
      ),
      MyBookingsLoaded(:final bookings) => ListView.builder(
        controller: _scrollController,
        padding: const EdgeInsets.fromLTRB(20, 4, 20, 100),
        itemCount: bookings.length,
        itemBuilder: (context, i) => _BookingCard(
          booking: bookings[i],
          onCancel: bookings[i].status == BookingStatus.confirmed
              ? () => _confirmCancel(context, bookings[i].id)
              : null,
        ),
      ),
    };
  }

  Future<void> _confirmCancel(BuildContext context, String bookingId) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.cardBg,
        title: Text(
          'Cancel Booking',
          style: GoogleFonts.poppins(
            color: AppColors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
        content: Text(
          'Are you sure you want to cancel this booking? This action cannot be undone.',
          style: GoogleFonts.poppins(
            color: Colors.white70,
            fontSize: 13,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: Text(
              'Keep Booking',
              style: GoogleFonts.poppins(
                color: AppColors.white54,
                fontSize: 13,
              ),
            ),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: Text(
              'Cancel Booking',
              style: GoogleFonts.poppins(
                color: AppColors.error,
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );

    if (confirmed == true && context.mounted) {
      await ref
          .read(myBookingsProvider.notifier)
          .cancelBooking(bookingId);
    }
  }
}

class _BookingCard extends StatelessWidget {
  final BookingEntity booking;
  final VoidCallback? onCancel;
  const _BookingCard({required this.booking, this.onCancel});

  ({Color color, String label}) get _statusMeta => switch (booking.status) {
    BookingStatus.confirmed => (color: AppColors.info, label: 'Confirmed'),
    BookingStatus.ongoing => (color: AppColors.success, label: 'Ongoing'),
    BookingStatus.completed => (color: Colors.white38, label: 'Completed'),
    BookingStatus.cancelled => (color: AppColors.error, label: 'Cancelled'),
  };

  @override
  Widget build(BuildContext context) {
    final meta = _statusMeta;
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border(left: BorderSide(color: meta.color, width: 3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  booking.bikeName,
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: meta.color.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  meta.label,
                  style: GoogleFonts.poppins(
                    color: meta.color,
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              const Icon(Icons.location_on_outlined, color: Colors.white38, size: 13),
              const SizedBox(width: 4),
              Text(
                booking.pickupLocation,
                style: GoogleFonts.poppins(color: Colors.white54, fontSize: 11),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              const Icon(Icons.calendar_today_outlined, color: Colors.white38, size: 12),
              const SizedBox(width: 4),
              Text(
                '${_fmt(booking.startDate)} – ${_fmt(booking.endDate)}',
                style: GoogleFonts.poppins(color: Colors.white54, fontSize: 11),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Rs. ${booking.totalPrice.toStringAsFixed(0)}',
                style: GoogleFonts.poppins(
                  color: AppColors.cyan,
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                ),
              ),
              if (onCancel != null)
                TextButton(
                  onPressed: onCancel,
                  style: TextButton.styleFrom(foregroundColor: AppColors.error),
                  child: Text(
                    'Cancel',
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }

  String _fmt(DateTime d) => '${d.day}/${d.month}/${d.year}';
}
