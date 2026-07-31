import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:bike_sewa/features/auth/presentation/pages/login_view.dart';
import 'package:bike_sewa/features/auth/presentation/pages/register_view.dart';
import 'package:bike_sewa/features/auth/presentation/pages/forgot_password_view.dart';
import 'package:bike_sewa/features/dashboard/presentation/pages/dashboard_view.dart';
import 'package:bike_sewa/features/onboarding/presentation/pages/onboarding_view.dart';
import 'package:bike_sewa/features/splash/presentation/pages/splash_screen_view.dart';
import 'package:bike_sewa/core/pages/server_settings_view.dart';
import 'package:bike_sewa/core/theme/theme_provider.dart';

const kPrimary = Color(0xFF1B3A6B);
const kAccent = Color(0xFFFF6B35);

class BikeRentalApp extends StatelessWidget {
  const BikeRentalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer(
      builder: (context, ref, _) {
        final themeState = ref.watch(themeProvider);
        return MaterialApp(
          title: 'Bike Sewa',
          debugShowCheckedModeBanner: false,
          theme: lightTheme,
          darkTheme: darkTheme,
          themeMode: themeState.isDark ? ThemeMode.dark : ThemeMode.light,
          home: const SplashScreenView(),
          routes: {
            '/onboarding': (_) => const OnboardingView(),
            '/login': (_) => const LoginView(),
            '/register': (_) => const RegisterView(),
            '/forgot-password': (_) => const ForgotPasswordView(),
            '/dashboard': (_) => const DashboardView(),
            '/settings': (_) => const ServerSettingsView(),
          },
        );
      },
    );
  }
}