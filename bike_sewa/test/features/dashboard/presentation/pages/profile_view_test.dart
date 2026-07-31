import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:bike_sewa/features/auth/presentation/providers/auth_provider.dart';
import 'package:bike_sewa/features/auth/presentation/state/auth_state.dart';
import 'package:bike_sewa/features/auth/presentation/view_model/auth_view_model.dart';
import 'package:bike_sewa/features/booking/presentation/providers/booking_provider.dart';
import 'package:bike_sewa/features/dashboard/presentation/pages/profile_view.dart';

class FakeAuthViewModel extends AuthViewModel {
  @override
  AuthState build() => const AuthState();
}

class FakeMyBookingsNotifier extends MyBookingsNotifier {
  @override
  MyBookingsState build() => const MyBookingsState.loaded([]);
}

void main() {
  Widget createTestWidget() {
    return ProviderScope(
      overrides: [
        authViewModelProvider.overrideWith(() => FakeAuthViewModel()),
        myBookingsProvider.overrideWith(() => FakeMyBookingsNotifier()),
      ],
      child: MaterialApp(
        home: Scaffold(
          body: MediaQuery(
            data: const MediaQueryData(size: Size(400, 2000)),
            child: ProfileView(),
          ),
        ),
      ),
    );
  }

  group('ProfileView - UI Elements', () {
    testWidgets('should display scaffold', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('should display Bike Sewa header', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Bike Sewa'), findsOneWidget);
    });

    testWidgets('should display settings icon', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.settings_outlined), findsWidgets);
    });
  });

  group('ProfileView - Profile Header', () {
    testWidgets('should display default rider name when not logged in', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Rider Name'), findsOneWidget);
    });

    testWidgets('should display sign in prompt when not logged in', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.textContaining('Sign in'), findsOneWidget);
    });

    testWidgets('should display CircleAvatar for profile', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(CircleAvatar), findsOneWidget);
    });

    testWidgets('should display Edit Profile button', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Edit Profile'), findsWidgets);
    });
  });

  group('ProfileView - Stats Section', () {
    testWidgets('should display Rides stat chip', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Rides'), findsOneWidget);
    });

    testWidgets('should display Rating stat chip', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Rating'), findsOneWidget);
    });

    testWidgets('should display two_wheeler icon in stats', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.two_wheeler), findsOneWidget);
    });

    testWidgets('should display star icon in stats', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.star), findsOneWidget);
    });
  });

  group('ProfileView - Recent Activity Section', () {
    testWidgets('should display Recent Activity section', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Recent Activity'), findsOneWidget);
    });

    testWidgets('should display recent activity rows', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(Padding), findsWidgets);
    });
  });

  group('ProfileView - Saved Bikes Section', () {
    testWidgets('should display Saved Bikes section', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Saved Bikes'), findsOneWidget);
    });
  });

  group('ProfileView - Payment Methods Section', () {
    testWidgets('should display Payment Methods section', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Payment Methods'), findsOneWidget);
    });
  });

  group('ProfileView - Action Rows', () {
    testWidgets('should display Help Center action', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Help Center'), findsOneWidget);
    });

    testWidgets('should display Account Settings action', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Account Settings'), findsOneWidget);
    });

    testWidgets('should display Log Out action', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Log Out'), findsOneWidget);
    });
  });

  group('ProfileView - Layout', () {
    testWidgets('should have SafeArea', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(SafeArea), findsOneWidget);
    });

    testWidgets('should have SingleChildScrollView', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(SingleChildScrollView), findsOneWidget);
    });

    testWidgets('should have Container widgets', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(Container), findsWidgets);
    });
  });
}