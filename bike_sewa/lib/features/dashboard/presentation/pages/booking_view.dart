import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../../app/routes/app_routes.dart';
import '../../../../core/constants/color_constants.dart';
import '../../../../features/dashboard/domain/entities/bike_entity.dart';
import '../../../../features/payment/presentation/pages/payment_screen.dart';
import '../widgets/bike_image_widget.dart';

class BookingView extends ConsumerStatefulWidget {
  final String id;
  final String name;
  final String model;
  final double pricePerHour;
  final String? imageUrl;

  const BookingView({
    super.key,
    required this.id,
    required this.name,
    required this.model,
    required this.pricePerHour,
    this.imageUrl,
  });

  @override
  ConsumerState<BookingView> createState() => _BookingViewState();
}

class _BookingViewState extends ConsumerState<BookingView> {
  DateTimeRange? _selectedRange;
  // ignore: prefer_final_fields
  bool _isSubmitting = false;
  String? _errorMessage;

  Future<void> _pickDateRange() async {
    final now = DateTime.now();
    final range = await showDateRangePicker(
      context: context,
      firstDate: now,
      lastDate: now.add(const Duration(days: 365)),
      initialDateRange: _selectedRange,
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.dark(
              primary: AppColors.cyan,
              surface: AppColors.cardBg,
              onSurface: AppColors.white,
            ),
          ),
          child: child!,
        );
      },
    );
    if (range != null && mounted) {
      setState(() => _selectedRange = range);
      setState(() => _errorMessage = null);
    }
  }

  Future<void> _confirmBooking() async {
    if (_selectedRange == null) {
      setState(() => _errorMessage = 'Please select booking dates');
      return;
    }

    final start = _selectedRange!.start;
    final end = _selectedRange!.end;

    if (end.isBefore(start) || end.isAtSameMomentAs(start)) {
      setState(() => _errorMessage = 'End date must be after start date');
      return;
    }

    final estimatedTotal = _estimatePrice(
      DateTimeRange(start: start, end: end),
    );

    // Navigate to payment screen
    if (!mounted) return;
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => PaymentScreen(
          bike: BikeEntity(
            id: widget.id,
            name: widget.name,
            model: widget.model,
            location: '',
            latitude: 0,
            longitude: 0,
            isAvailable: true,
            pricePerHour: widget.pricePerHour,
            imageUrl: widget.imageUrl,
          ),
          amount: estimatedTotal,
          startDate: start,
          endDate: end,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final f = NumberFormat.currency(symbol: 'Rs. ', decimalDigits: 0);
    final estimatedTotal = _selectedRange != null
        ? _estimatePrice(_selectedRange!)
        : null;

    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: AppBar(
        backgroundColor: AppColors.cardBg,
        title: Text(
          'Book Ride',
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.w700,
            fontSize: 18,
          ),
        ),
        leading: IconButton(
          onPressed: () => AppRoutes.pop(context),
          icon: const Icon(Icons.arrow_back_rounded),
        ),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 100),
          children: [
            _BikePreview(
              name: widget.name,
              model: widget.model,
              pricePerHour: widget.pricePerHour,
              imageUrl: widget.imageUrl,
            ),
            const SizedBox(height: 24),
            _buildDatePicker(f, estimatedTotal),
            const SizedBox(height: 20),
            _buildSummary(f, estimatedTotal),
            if (_errorMessage != null) ...[
              const SizedBox(height: 12),
              Text(
                _errorMessage!,
                style: GoogleFonts.poppins(
                  color: AppColors.error,
                  fontSize: 12,
                ),
              ),
            ],
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomBar(estimatedTotal, f),
    );
  }

  Widget _buildDatePicker(NumberFormat f, double? estimatedTotal) {
    final text = _selectedRange == null
        ? 'Tap to select start and end dates'
        : '${DateFormat('dd MMM yyyy').format(_selectedRange!.start)} - ${DateFormat('dd MMM yyyy').format(_selectedRange!.end)}';

    return GestureDetector(
      onTap: _pickDateRange,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        decoration: BoxDecoration(
          color: AppColors.cardBg,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: _selectedRange != null
                ? AppColors.cyan
                : AppColors.white10,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.cyan.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(
                Icons.calendar_month_outlined,
                color: AppColors.cyan,
                size: 20,
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _selectedRange == null ? 'Select Dates' : 'Booking Dates',
                    style: GoogleFonts.poppins(
                      color: AppColors.cyan,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    text,
                    style: GoogleFonts.poppins(
                      color: _selectedRange != null
                          ? AppColors.white
                          : AppColors.white54,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.chevron_right_rounded,
              color: AppColors.white38,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummary(NumberFormat f, double? estimatedTotal) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Booking Summary',
            style: GoogleFonts.poppins(
              color: AppColors.white,
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 14),
          _summaryRow('Bike', '${widget.name} ${widget.model}'),
          _summaryRow('Rate', '${f.format(widget.pricePerHour)}/hr'),
          if (estimatedTotal != null)
            _summaryRow(
              'Est. Duration',
              '${_selectedRange!.end.difference(_selectedRange!.start).inHours} hrs',
            ),
          const Divider(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Estimated Total',
                style: GoogleFonts.poppins(
                  color: AppColors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
              Text(
                estimatedTotal != null
                    ? f.format(estimatedTotal)
                    : 'Select dates',
                style: GoogleFonts.poppins(
                  color: AppColors.cyan,
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _summaryRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: GoogleFonts.poppins(
              color: AppColors.white54,
              fontSize: 13,
            ),
          ),
          Text(
            value,
            style: GoogleFonts.poppins(
              color: AppColors.white,
              fontSize: 13,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomBar(double? estimatedTotal, NumberFormat f) {
    final canConfirm = _selectedRange != null && !_isSubmitting;

    return Container(
      padding: EdgeInsets.fromLTRB(20, 16, 20, MediaQuery.of(context).padding.bottom + 12),
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: canConfirm ? _confirmBooking : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.cyan,
              foregroundColor: Colors.black,
              disabledBackgroundColor: AppColors.cyan.withValues(alpha: 0.3),
              disabledForegroundColor: Colors.black.withValues(alpha: 0.5),
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: _isSubmitting
                ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.black,
                    ),
                  )
                : Text(
                    estimatedTotal != null
                        ? 'Confirm Booking \u2022 ${f.format(estimatedTotal)}'
                        : 'Confirm Booking',
                    style: GoogleFonts.poppins(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
          ),
        ),
      ),
    );
  }

  double _estimatePrice(DateTimeRange range) {
    final hours = range.end.difference(range.start).inHours.toDouble();
    final days = hours / 24;
    final dailyRate = widget.pricePerHour * 24;
    return max(hours * widget.pricePerHour, days * dailyRate);
  }
}

class _BikePreview extends StatelessWidget {
  final String name;
  final String model;
  final double pricePerHour;
  final String? imageUrl;

  const _BikePreview({
    required this.name,
    required this.model,
    required this.pricePerHour,
    this.imageUrl,
  });

  @override
  Widget build(BuildContext context) {
    final f = NumberFormat.currency(symbol: 'Rs. ', decimalDigits: 0);

    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            child: AspectRatio(
              aspectRatio: 16 / 9,
              child: imageUrl != null && imageUrl!.isNotEmpty
                  ? Image.network(
                      imageUrl!,
                      fit: BoxFit.cover,
                      width: double.infinity,
                      errorBuilder: (context, error, stackTrace) =>
                          _placeholder(context),
                    )
                  : _placeholder(context),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '$name $model',
                        style: GoogleFonts.poppins(
                          color: AppColors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Per hour rate',
                        style: GoogleFonts.poppins(
                          color: AppColors.white54,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.cyan.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '${f.format(pricePerHour)}/hr',
                    style: GoogleFonts.poppins(
                      color: AppColors.cyan,
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _placeholder(BuildContext context) {
    return Container(
      color: AppColors.darkBg,
      child: const Center(
        child: Icon(
          Icons.two_wheeler,
          color: AppColors.white24,
          size: 48,
        ),
      ),
    );
  }
}

enum PaymentMethod { card, upi, wallet }

class PaymentResult {
  final bool success;
  final String? message;

  const PaymentResult({required this.success, this.message});
}
