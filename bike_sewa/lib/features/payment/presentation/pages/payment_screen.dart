import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../app/routes/app_routes.dart';
import '../../../../core/constants/color_constants.dart';
import '../../../../features/dashboard/domain/entities/bike_entity.dart';
import '../../../../features/dashboard/presentation/pages/dashboard_view.dart';
import '../../../../features/payment/presentation/providers/recent_payments_provider.dart';
import '../../../../features/booking/domain/usecases/booking_usecases.dart';
import '../../../../features/booking/presentation/providers/booking_provider.dart';
import '../providers/payment_provider.dart';
import '../../domain/usecases/payment_usecases.dart';

class PaymentScreen extends ConsumerStatefulWidget {
  final BikeEntity bike;
  final double amount;
  final DateTime startDate;
  final DateTime endDate;

  const PaymentScreen({
    super.key,
    required this.bike,
    required this.amount,
    required this.startDate,
    required this.endDate,
  });

  @override
  ConsumerState<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends ConsumerState<PaymentScreen> {
  int _selectedMethod = 0;
  bool _isProcessing = false;

  static const List<(String label, IconData icon)> _methods = [
    ('Card', Icons.credit_card),
    ('UPI', Icons.phone_android),
    ('Wallet', Icons.account_balance_wallet),
  ];

  Future<void> _processPayment() async {
    setState(() => _isProcessing = true);

    final methodNames = ['card', 'upi', 'wallet'];
    final method = methodNames[_selectedMethod];

    final bookingResult = await ref
        .read(createBookingUseCaseProvider)
        .call(CreateBookingParams(
          bikeId: widget.bike.id,
          startDate: widget.startDate,
          endDate: widget.endDate,
        ));

    if (!mounted) return;

    String? bookingId;

    final bookingSuccess = bookingResult.fold(
      (failure) {
        setState(() => _isProcessing = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(failure.message),
            backgroundColor: AppColors.error,
          ),
        );
        return false;
      },
      (booking) {
        bookingId = booking.id;
        return true;
      },
    );

    if (!bookingSuccess || bookingId == null) return;

    final paymentResult = await ref
        .read(processPaymentUseCaseProvider)
        .call(ProcessPaymentParams(
          bookingId: bookingId!,
          amount: widget.amount,
          method: method,
        ));

    if (!mounted) return;

    paymentResult.fold(
      (failure) {
        setState(() => _isProcessing = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(failure.message),
            backgroundColor: AppColors.error,
          ),
        );
      },
      (payment) async {
        ref.read(recentPaymentsProvider.notifier).addTransaction(
          PaymentTransaction(
            id: DateTime.now().millisecondsSinceEpoch.toString(),
            bikeName: '${widget.bike.name} ${widget.bike.model}',
            amount: widget.amount,
            paymentMethod: method,
            date: DateTime.now(),
            status: 'Completed',
            transactionRef:
                'TXN-${DateTime.now().millisecondsSinceEpoch}',
          ),
        );

        setState(() => _isProcessing = false);
        if (!mounted) return;

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Payment of Rs. ${widget.amount.toStringAsFixed(0)} successful!',
            ),
            backgroundColor: AppColors.success,
          ),
        );
        AppRoutes.pushAndRemoveUntil(
          context,
          DashboardView(initialTab: 3),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: AppBar(
        backgroundColor: AppColors.cardBg,
        title: Text(
          'Payment',
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.w700,
            fontSize: 18,
          ),
        ),
        leading: IconButton(
          onPressed: () => AppRoutes.pop(context),
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.white),
        ),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 100),
          children: [
            BookingSummaryCard(
              bikeName: '${widget.bike.name} ${widget.bike.model}',
              pickupLocation: widget.bike.location,
              amount: widget.amount,
            ),
            const SizedBox(height: 24),
            Text(
              'Select Payment Method',
              style: GoogleFonts.poppins(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),
            ...List.generate(_methods.length, (index) {
              final (label, icon) = _methods[index];
              final isSelected = _selectedMethod == index;
              return GestureDetector(
                onTap: () => setState(() => _selectedMethod = index),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.cyan.withValues(alpha: 0.15)
                        : AppColors.cardBg,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: isSelected
                          ? AppColors.cyan
                          : Colors.transparent,
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(icon, color: AppColors.cyan, size: 24),
                      const SizedBox(width: 14),
                      Text(
                        label,
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const Spacer(),
                      if (isSelected)
                        Container(
                          width: 20,
                          height: 20,
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppColors.cyan,
                          ),
                          child: const Icon(
                            Icons.check,
                            color: Colors.black,
                            size: 14,
                          ),
                        ),
                    ],
                  ),
                ),
              );
            }),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 54,
              child: ElevatedButton(
                onPressed: _isProcessing ? null : _processPayment,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.cyan,
                  foregroundColor: Colors.black,
                  disabledBackgroundColor:
                      AppColors.cyan.withValues(alpha: 0.3),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
                child: _isProcessing
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.black,
                        ),
                      )
                    : Text(
                        'Pay Rs. ${widget.amount.toStringAsFixed(0)}',
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class BookingSummaryCard extends StatelessWidget {
  final String bikeName;
  final String pickupLocation;
  final double amount;

  const BookingSummaryCard({
    super.key,
    required this.bikeName,
    required this.pickupLocation,
    required this.amount,
  });

  @override
  Widget build(BuildContext context) {
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
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 12),
          SummaryRow(label: 'Bike', value: bikeName),
          SummaryRow(label: 'Pickup', value: pickupLocation),
          SummaryRow(label: 'Amount', value: 'Rs. ${amount.toStringAsFixed(0)}'),
        ],
      ),
    );
  }
}

class SummaryRow extends StatelessWidget {
  final String label;
  final String value;

  const SummaryRow({super.key, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: GoogleFonts.poppins(
              color: Colors.white54,
              fontSize: 13,
            ),
          ),
          Text(
            value,
            style: GoogleFonts.poppins(
              color: Colors.white,
              fontSize: 13,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

