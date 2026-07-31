import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class PaymentMethodsView extends StatefulWidget {
  const PaymentMethodsView({super.key});

  @override
  State<PaymentMethodsView> createState() => _PaymentMethodsViewState();
}

class _PaymentMethodsViewState extends State<PaymentMethodsView> {
  final List<Map<String, dynamic>> _methods = [
    {'title': 'Credit / Debit Card', 'icon': Icons.credit_card, 'added': false, 'detail': 'Not added'},
    {'title': 'UPI', 'icon': Icons.phone_android, 'added': false, 'detail': 'Not added'},
    {'title': 'Wallet', 'icon': Icons.account_balance_wallet, 'added': false, 'detail': 'Not added'},
    {'title': 'Khalti', 'icon': Icons.payment, 'added': false, 'detail': 'Not added'},
    {'title': 'eSewa', 'icon': Icons.wallet_membership, 'added': false, 'detail': 'Not added'},
  ];

  void _toggleMethod(int index) {
    setState(() {
      _methods[index]['added'] = !(_methods[index]['added'] as bool);
      _methods[index]['detail'] = (_methods[index]['added'] as bool) ? 'Added' : 'Not added';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D0D0D),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0D0D0D),
        elevation: 0,
        leading: IconButton(
          onPressed: () => Navigator.pop(context),
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
        ),
        title: Text(
          'Payment Methods',
          style: GoogleFonts.poppins(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          children: [
            Text(
              'Payment Methods',
              style: GoogleFonts.poppins(
                color: Colors.white,
                fontSize: 22,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Manage your payment options',
              style: GoogleFonts.poppins(color: Colors.grey, fontSize: 13),
            ),
            const SizedBox(height: 24),
            ...List.generate(_methods.length, (index) {
              final method = _methods[index];
              return _PaymentCard(
                title: method['title'] as String,
                icon: method['icon'] as IconData,
                detail: method['detail'] as String,
                added: method['added'] as bool,
                onTap: () => _toggleMethod(index),
              );
            }),
          ],
        ),
      ),
    );
  }
}

class _PaymentCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final String detail;
  final bool added;
  final VoidCallback onTap;

  const _PaymentCard({
    required this.title,
    required this.icon,
    required this.detail,
    required this.added,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF1A1A1A),
          borderRadius: BorderRadius.circular(14),
        ),
        child: Row(
          children: [
            Icon(icon, color: const Color(0xFF00C2CB)),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.poppins(
                      color: Colors.white,
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    detail,
                    style: GoogleFonts.poppins(
                      color: added ? const Color(0xFF22C55E) : Colors.white54,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              added ? Icons.check_circle : Icons.add_circle_outline,
              color: added ? const Color(0xFF22C55E) : Colors.white38,
            ),
          ],
        ),
      ),
    );
  }
}
