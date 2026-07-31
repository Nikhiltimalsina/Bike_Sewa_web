import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'home_view.dart';
import 'explore_view.dart';
import 'scan_view.dart';
import 'activity_view.dart';
import 'profile_view.dart';
import '../../../../core/widgets/ai_assistant_chatbot.dart';

const _bg = Color(0xFF0D0D0D);
const _card = Color(0xFF1A1A1A);
const _cyan = Color(0xFF00C2CB);

class DashboardView extends StatefulWidget {
  const DashboardView({super.key, this.initialTab});

  final int? initialTab;

  @override
  State<DashboardView> createState() => _DashboardViewState();
}

class _DashboardViewState extends State<DashboardView> {
  int currentIndex = 0;

  final Map<int, Widget> _cachedPages = {};

  void _ensurePage(int index) {
    _cachedPages.putIfAbsent(index, () {
      switch (index) {
        case 0:
          return HomeView(
            onExploreBikes: () => onTabTapped(1),
            onScanQr: () => onTabTapped(2),
            onMyBookings: () => onTabTapped(3),
          );
        case 1:
          return const ExploreView();
        case 2:
          return const ScanView();
        case 3:
          return const ActivityView();
        case 4:
          return const ProfileView();
        default:
          return const SizedBox.shrink();
      }
    });
  }

  @override
  void initState() {
    super.initState();
    currentIndex = widget.initialTab ?? 0;
    _ensurePage(currentIndex);
  }

  void onTabTapped(int index) {
    if (index == currentIndex && index != 2) return;
    setState(() => currentIndex = index);
    _ensurePage(index);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      body: _cachedPages[currentIndex] ?? const SizedBox.shrink(),
      floatingActionButton: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          FloatingActionButton(
            onPressed: () => onTabTapped(2),
            backgroundColor: _cyan,
            shape: const CircleBorder(),
            child: const Icon(Icons.qr_code_scanner, color: Colors.black, size: 28),
          ),
          const SizedBox(width: 16),
          FloatingActionButton.extended(
            onPressed: () {
              showDialog(
                context: context,
                builder: (_) => const AIAssistantChatbot(),
              );
            },
            backgroundColor: const Color(0xFF00C2CB),
            foregroundColor: Colors.black,
            icon: const Icon(Icons.auto_awesome_outlined),
            label: const Text('AI'),
          ),
        ],
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: BottomAppBar(
        color: _card,
        shape: const CircularNotchedRectangle(),
        notchMargin: 8,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildNavItem(Icons.home_rounded, 'Home', 0),
            _buildNavItem(Icons.explore_outlined, 'Explore', 1),
            const SizedBox(width: 48),
            _buildNavItem(Icons.receipt_long, 'Activity', 3),
            _buildNavItem(Icons.person_rounded, 'Profile', 4),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, int index) {
    final isActive = currentIndex == index;
    return GestureDetector(
      onTap: () => onTabTapped(index),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: isActive ? _cyan : Colors.grey, size: 22),
            const SizedBox(height: 3),
            Text(
              label,
              style: GoogleFonts.poppins(
                fontSize: 10,
                color: isActive ? _cyan : Colors.grey,
                fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
