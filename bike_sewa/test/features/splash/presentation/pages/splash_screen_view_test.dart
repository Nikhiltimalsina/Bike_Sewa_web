import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:bike_sewa/core/api/api_client.dart';
import 'package:bike_sewa/core/constants/color_constants.dart';
import 'package:bike_sewa/features/splash/presentation/pages/splash_screen_view.dart';

void main() {
  Widget createTestWidget() {
    // Set up mock SharedPreferences
    SharedPreferences.setMockInitialValues({});
    final prefs = SharedPreferences.getInstance();

    return ProviderScope(
      overrides: [
        sharedPreferencesProvider.overrideWithValue(prefs as SharedPreferences),
      ],
      child: const MaterialApp(home: SplashScreenView()),
    );
  }

  group('SplashScreenView - UI Elements', () {
    testWidgets('should display scaffold', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('should display motorcycle icon', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.byIcon(Icons.motorcycle), findsOneWidget);
    });

    testWidgets('should display app name text', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.text('Bike Sewa'), findsOneWidget);
    });

    testWidgets('should display tagline text', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.text('Ride. Anytime. Anywhere.'), findsOneWidget);
    });
  });

  group('SplashScreenView - Layout', () {
    testWidgets('should have dark background color', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pump(const Duration(milliseconds: 100));

      final scaffold = tester.widget<Scaffold>(find.byType(Scaffold));
      expect(scaffold.backgroundColor, AppColors.darkBg);
    });

    testWidgets('should center content', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.byType(Center), findsOneWidget);
    });
  });
}
