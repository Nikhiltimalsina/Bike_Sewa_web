
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:bike_sewa/features/booking/presentation/providers/booking_provider.dart';
import 'package:bike_sewa/features/dashboard/presentation/pages/activity_view.dart';

class FakeMyBookingsNotifier extends MyBookingsNotifier {
  FakeMyBookingsNotifier() : super();

  @override
  Future<void> loadBookings() async {
    state = const MyBookingsState.loaded([]);
  }

  @override
  Future<void> cancelBooking(String bookingId) async {
    state = const MyBookingsState.loaded([]);
  }
}

class FakeMyBookingsNotifierLoading extends MyBookingsNotifier {
  FakeMyBookingsNotifierLoading() : super();

  @override
  Future<void> loadBookings() async {
    state = const MyBookingsState.loading();
  }

  @override
  Future<void> cancelBooking(String bookingId) async {
    state = const MyBookingsState.loaded([]);
  }
}

void main() {
  Widget createTestWidget() {
    return ProviderScope(
      overrides: [
        myBookingsProvider.overrideWith(() => FakeMyBookingsNotifier()),
      ],
      child: const MaterialApp(home: ActivityView()),
    );
  }

  group('ActivityView - UI Elements', () {
    testWidgets('should display Activity header', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Activity'), findsOneWidget);
    });

    testWidgets('should display refresh icon', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.refresh), findsOneWidget);
    });

    testWidgets('should have RefreshIndicator', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(RefreshIndicator), findsOneWidget);
    });

    testWidgets('should have ListView for bookings', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(ListView), findsWidgets);
    });
  });

  group('ActivityView - Loading State', () {
    testWidgets('should show progress indicator when loading', (tester) async {
      final fakeNotifier = FakeMyBookingsNotifierLoading();
      
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            myBookingsProvider.overrideWith(() => fakeNotifier),
          ],
          child: const MaterialApp(home: ActivityView()),
        ),
      );
      
      await tester.pump();
      
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      
      fakeNotifier.state = const MyBookingsState.loaded([]);
      await tester.pumpAndSettle();
    });
  });

  group('ActivityView - Empty State', () {
    testWidgets('should show no rides yet message', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.textContaining('No rides yet'), findsOneWidget);
    });

    testWidgets('should display receipt_long_outlined icon', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.receipt_long_outlined), findsOneWidget);
    });
  });

  group('ActivityView - Layout', () {
    testWidgets('should have SafeArea', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(SafeArea), findsOneWidget);
    });

    testWidgets('should have Column in header', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(Column), findsWidgets);
    });

    testWidgets('should have Expanded widget', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(Expanded), findsOneWidget);
    });

    testWidgets('should have ListView.builder for bookings', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(ListView), findsWidgets);
    });
  });

  group('ActivityView - Header Layout', () {
    testWidgets('should display header with correct structure', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Activity'), findsOneWidget);
    });
  });
}
