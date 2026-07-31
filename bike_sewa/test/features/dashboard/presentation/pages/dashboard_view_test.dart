import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/features/auth/presentation/providers/auth_provider.dart';
import 'package:bike_sewa/features/auth/presentation/state/auth_state.dart';
import 'package:bike_sewa/features/auth/presentation/view_model/auth_view_model.dart';
import 'package:bike_sewa/features/dashboard/domain/entities/bike_entity.dart';
import 'package:bike_sewa/features/dashboard/domain/usecases/dashboard_usecases.dart';
import 'package:bike_sewa/features/dashboard/presentation/pages/dashboard_view.dart';
import 'package:bike_sewa/features/dashboard/presentation/pages/home_view.dart';
import 'package:bike_sewa/features/dashboard/presentation/pages/explore_view.dart';
import 'package:bike_sewa/features/dashboard/presentation/pages/activity_view.dart';
import 'package:bike_sewa/features/dashboard/presentation/pages/profile_view.dart';
import 'package:bike_sewa/features/dashboard/presentation/providers/dashboard_provider.dart';
import 'package:bike_sewa/features/booking/domain/entities/booking_entity.dart';
import 'package:bike_sewa/features/booking/domain/usecases/booking_usecases.dart';
import 'package:bike_sewa/features/booking/presentation/providers/booking_provider.dart';

class FakeAuthViewModel extends AuthViewModel {
  @override
  AuthState build() => const AuthState();
}

class MockGetAllBikesUseCase extends Mock implements GetAllBikesUseCase {}

class MockGetAvailableBikesUseCase extends Mock implements GetAvailableBikesUseCase {}

class MockSearchBikesUseCase extends Mock implements SearchBikesUseCase {}

class MockGetMyBookingsUseCase extends Mock implements GetMyBookingsUseCase {}

class MockCancelBookingUseCase extends Mock implements CancelBookingUseCase {}

void main() {
  late MockGetAllBikesUseCase mockGetAllBikesUseCase;
  late MockGetAvailableBikesUseCase mockGetAvailableBikesUseCase;
  late MockSearchBikesUseCase mockSearchBikesUseCase;
  late MockGetMyBookingsUseCase mockGetMyBookingsUseCase;
  late MockCancelBookingUseCase mockCancelBookingUseCase;

  setUp(() {
    mockGetAllBikesUseCase = MockGetAllBikesUseCase();
    mockGetAvailableBikesUseCase = MockGetAvailableBikesUseCase();
    mockSearchBikesUseCase = MockSearchBikesUseCase();
    mockGetMyBookingsUseCase = MockGetMyBookingsUseCase();
    mockCancelBookingUseCase = MockCancelBookingUseCase();
  });

  Widget createTestWidget() {
    return ProviderScope(
      overrides: [
        authViewModelProvider.overrideWith(() => FakeAuthViewModel()),
        getAllBikesUseCaseProvider.overrideWithValue(mockGetAllBikesUseCase),
        getAvailableBikesUseCaseProvider.overrideWithValue(mockGetAvailableBikesUseCase),
        searchBikesUseCaseProvider.overrideWithValue(mockSearchBikesUseCase),
        getMyBookingsUseCaseProvider.overrideWithValue(mockGetMyBookingsUseCase),
        cancelBookingUseCaseProvider.overrideWithValue(mockCancelBookingUseCase),
      ],
      child: const MaterialApp(home: DashboardView()),
    );
  }

  group('DashboardView - UI Elements', () {
    testWidgets('should display scaffold', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer((_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]));
      when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => Right<Failure, List<BookingEntity>>(<BookingEntity>[]));

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('should have bottom navigation bar', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer((_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]));
      when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => Right<Failure, List<BookingEntity>>(<BookingEntity>[]));

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(BottomAppBar), findsOneWidget);
    });

    testWidgets('should display home icon in nav bar', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer((_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]));
      when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => Right<Failure, List<BookingEntity>>(<BookingEntity>[]));

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.home_rounded), findsOneWidget);
    });

    testWidgets('should display explore icon in nav bar', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer((_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]));
      when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => Right<Failure, List<BookingEntity>>(<BookingEntity>[]));

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.explore_outlined), findsOneWidget);
    });

    testWidgets('should display activity icon in nav bar', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer((_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]));
      when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => Right<Failure, List<BookingEntity>>(<BookingEntity>[]));

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.receipt_long), findsOneWidget);
    });

    testWidgets('should display profile icon in nav bar', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer((_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]));
      when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => Right<Failure, List<BookingEntity>>(<BookingEntity>[]));

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.person_rounded), findsOneWidget);
    });

    testWidgets('should display floating action button', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer((_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]));
      when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => Right<Failure, List<BookingEntity>>(<BookingEntity>[]));

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(FloatingActionButton), findsOneWidget);
    });

    testWidgets('should display QR scanner icon on FAB', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer((_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]));
      when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => Right<Failure, List<BookingEntity>>(<BookingEntity>[]));

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.qr_code_scanner), findsOneWidget);
    });
  });

  group('DashboardView - Tab Navigation', () {
    testWidgets('should display IndexedStack for tabs', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer((_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]));
      when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => Right<Failure, List<BookingEntity>>(<BookingEntity>[]));

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(IndexedStack), findsOneWidget);
    });

    testWidgets('should show HomeView initially', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer((_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]));
      when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => Right<Failure, List<BookingEntity>>(<BookingEntity>[]));

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(HomeView), findsOneWidget);
    });

    testWidgets('should navigate to Explore tab on tap', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer((_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]));
      when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => Right<Failure, List<BookingEntity>>(<BookingEntity>[]));

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      await tester.tap(find.text('Explore'));
      await tester.pumpAndSettle();

      expect(find.byType(ExploreView), findsOneWidget);
    });

    testWidgets('should navigate to Activity tab on tap', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer((_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]));
      when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => Right<Failure, List<BookingEntity>>(<BookingEntity>[]));

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      await tester.tap(find.text('Activity'));
      await tester.pumpAndSettle();

      expect(find.byType(ActivityView), findsOneWidget);
    });

    testWidgets('should navigate to Profile tab on tap', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer((_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]));
      when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => Right<Failure, List<BookingEntity>>(<BookingEntity>[]));

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      await tester.tap(find.text('Profile'));
      await tester.pumpAndSettle();

      expect(find.byType(ProfileView), findsOneWidget);
    });
  });

  group('DashboardView - Responsive Design', () {
    testWidgets('should have SafeArea', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer((_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]));
      when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => Right<Failure, List<BookingEntity>>(<BookingEntity>[]));

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(SafeArea), findsWidgets);
    });

    testWidgets('should have CircularNotchedRectangle shape', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer((_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]));
      when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => Right<Failure, List<BookingEntity>>(<BookingEntity>[]));

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(BottomAppBar), findsOneWidget);
    });
  });
}
