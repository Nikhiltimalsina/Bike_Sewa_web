import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:bike_sewa/core/constants/color_constants.dart';

class SupportView extends ConsumerWidget {
  const SupportView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          onPressed: () => Navigator.pop(context),
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.white),
        ),
        title: Text(
          'Help & Support',
          style: GoogleFonts.poppins(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 100),
          children: [
            _buildHeader(),
            const SizedBox(height: 24),
            _buildFaqItem(
              icon: Icons.how_to_reg_rounded,
              question: 'How do I register?',
              answer:
                  'Tap Sign Up on the login screen, fill in your details, and create an account. You can then log in and start renting bikes.',
            ),
            const SizedBox(height: 12),
            _buildFaqItem(
              icon: Icons.book_rounded,
              question: 'How do I book a bike?',
              answer:
                  'Find a bike from the Home or Explore tab, tap Book Now, select your dates, confirm the booking, and proceed to payment (online or cash on pickup).',
            ),
            const SizedBox(height: 12),
            _buildFaqItem(
              icon: Icons.payment_rounded,
              question: 'What payment methods are accepted?',
              answer: 'We accept cash on pickup. Online payment methods are coming soon.',
            ),
            const SizedBox(height: 12),
            _buildFaqItem(
              icon: Icons.cancel_rounded,
              question: 'Can I cancel my booking?',
              answer:
                  'Yes, you can cancel confirmed bookings from the Activity tab. Ongoing bookings may have different cancellation terms depending on the rental policy.',
            ),
            const SizedBox(height: 12),
            _buildFaqItem(
              icon: Icons.contact_mail_rounded,
              question: 'How do I contact support?',
              answer:
                  'You can reach our support team at support@bikesewa.com or visit our help center at bikesewa.com/help.',
            ),
            const SizedBox(height: 12),
            _buildFaqItem(
              icon: Icons.security_rounded,
              question: 'Is my data safe?',
              answer:
                  'Yes. Your personal data is encrypted and stored securely. We never share your information with third parties without your consent.',
            ),
            const SizedBox(height: 32),
            _buildContactSection(),
            const SizedBox(height: 16),
            _buildAboutSection(),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Center(
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: AppColors.cardBg,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.headset_mic_rounded, color: AppColors.cyan, size: 36),
          ),
          const SizedBox(height: 16),
          Text(
            'Bike Sewa Support',
            style: GoogleFonts.poppins(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'We are here to help you',
            style: GoogleFonts.poppins(color: Colors.white54, fontSize: 13),
          ),
        ],
      ),
    );
  }

  Widget _buildFaqItem({
    required IconData icon,
    required String question,
    required String answer,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white.withValues(alpha: 0.06)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: AppColors.cyan, size: 18),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  question,
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            answer,
            style: GoogleFonts.poppins(
              color: Colors.white54,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactSection() {
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
            'Contact Us',
            style: GoogleFonts.poppins(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          _contactRow(Icons.email_rounded, 'support@bikesewa.com'),
          const SizedBox(height: 6),
          _contactRow(Icons.phone_rounded, '+977-1-XXXXXXX'),
          const SizedBox(height: 6),
          _contactRow(Icons.web_rounded, 'bikesewa.com/help'),
        ],
      ),
    );
  }

  Widget _contactRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, color: AppColors.cyan, size: 16),
        const SizedBox(width: 10),
        Text(
          text,
          style: GoogleFonts.poppins(color: Colors.white54, fontSize: 12),
        ),
      ],
    );
  }

  Widget _buildAboutSection() {
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
            'About Bike Sewa',
            style: GoogleFonts.poppins(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Bike Sewa is a bike rental platform in Kathmandu. Rent bikes, scooters, and motorcycles on-demand or by the day. Affordable, reliable, and easy.',
            style: GoogleFonts.poppins(color: Colors.white54, fontSize: 12),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Text(
                'Version 1.0.0',
                style: GoogleFonts.poppins(color: Colors.white38, fontSize: 11),
              ),
            ],
          ),
        ],
      ),
    );
  }
}