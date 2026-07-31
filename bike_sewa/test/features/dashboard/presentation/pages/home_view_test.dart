import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/features/dashboard/domain/entities/bike_entity.dart';
import 'package:bike_sewa/features/dashboard/domain/usecases/dashboard_usecases.dart';
import 'package:bike_sewa/features/dashboard/presentation/pages/home_view.dart';
import 'package:bike_sewa/features/dashboard/presentation/providers/dashboard_provider.dart';
import 'package:bike_sewa/features/item/domain/entities/item_entity.dart';
import 'package:bike_sewa/features/item/presentation/providers/item_provider.dart';

class MockGetAllBikesUseCase extends Mock implements GetAllBikesUseCase {}

class MockGetAvailableBikesUseCase extends Mock implements GetAvailableBikesUseCase {}

class MockSearchBikesUseCase extends Mock implements SearchBikesUseCase {}

class FakeItemListNotifier extends ItemListNotifier {
  FakeItemListNotifier() : super();

  @override
  List<ItemEntity> build() => [];
}

void main() {
  late MockGetAllBikesUseCase mockGetAllBikesUseCase;
  late MockGetAvailableBikesUseCase mockGetAvailableBikesUseCase;
  late MockSearchBikesUseCase mockSearchBikesUseCase;

  final sampleBikes = [
    BikeEntity(
      id: 'b1',
      name: 'Royal Enfield',
      model: 'Classic 350',
      location: 'Thamel, Kathmandu',
      latitude: 27.7172,
      longitude: 85.324,
      isAvailable: true,
      pricePerHour: 180,
      imageUrl: null,
    ),
  ];

  setUp(() {
    mockGetAllBikesUseCase = MockGetAllBikesUseCase();
    mockGetAvailableBikesUseCase = MockGetAvailableBikesUseCase();
    mockSearchBikesUseCase = MockSearchBikesUseCase();

    when(() => mockGetAllBikesUseCase()).thenAnswer(
      (_) async => Right<Failure, List<BikeEntity>>(sampleBikes),
    );
    when(() => mockGetAvailableBikesUseCase()).thenAnswer(
      (_) async => Right<Failure, List<BikeEntity>>(sampleBikes),
    );
    when(() => mockSearchBikesUseCase(any())).thenAnswer(
      (_) async => Right<Failure, List<BikeEntity>>(sampleBikes),
    );
  });

  Widget createTestWidget() {
    return ProviderScope(
      overrides: [
        getAllBikesUseCaseProvider.overrideWithValue(mockGetAllBikesUseCase),
        getAvailableBikesUseCaseProvider.overrideWithValue(mockGetAvailableBikesUseCase),
        searchBikesUseCaseProvider.overrideWithValue(mockSearchBikesUseCase),
        itemListProvider.overrideWith(() => FakeItemListNotifier()),
      ],
      child: MaterialApp(home: const Scaffold(body: HomeView())),
    );
  }

  group('HomeView - UI Elements', () {
    testWidgets('should display Bike Sewa header', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Bike Sewa'), findsOneWidget);
    });

    testWidgets('should display Find Your Ride text', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Find Your Ride'), findsOneWidget);
    });

    testWidgets('should display Rent a bike subtitle', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Rent a bike or scooter near you'), findsOneWidget);
    });

    testWidgets('should display search icon', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.search), findsOneWidget);
    });

    testWidgets('have dark background', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(Scaffold), findsOneWidget);
    });
  });

  group('HomeView - Search Section', () {
    testWidgets('should have RefreshIndicator', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(RefreshIndicator), findsOneWidget);
    });

    testWidgets('should display filter chips', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(Chip), findsWidgets);
    });

    testWidgets('should display All filter chip', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('All'), findsOneWidget);
    });

    testWidgets('should display Scooter filter chip', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Scooter'), findsOneWidget);
    });

    testWidgets('should display Motorcycle filter chip', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Motorcycle'), findsOneWidget);
    });

    testWidgets('should display Electric filter chip', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Electric'), findsOneWidget);
    });
  });

  group('HomeView - Sections', () {
    testWidgets('should display Featured Rides section', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Featured Rides'), findsOneWidget);
    });

    testWidgets('should display Near You section', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Near You'), findsOneWidget);
    });

    testWidgets('should display No items uploaded message', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('No items uploaded yet'), findsOneWidget);
    });
  });

  group('HomeView - Loading State', () {
    testWidgets('should show progress indicator when loading', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pump();

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });
  });

  group('HomeView - Empty State', () {
    testWidgets('should show empty state when no bikes match', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('No bikes match your search yet'), findsOneWidget);
    });
  });

  group('HomeView - Map Section', () {
    testWidgets('should display location pin icon for map', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.location_pin), findsOneWidget);
    });

    testWidgets('should display map text', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('View bikes on the map'), findsOneWidget);
    });

    testWidgets('should have gradient container for map', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(Container), findsWidgets);
    });
  });

  group('HomeView - Layout', () {
    testWidgets('should have SafeArea', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(SafeArea), findsOneWidget);
    });

    testWidgets('should have CustomScrollView', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(CustomScrollView), findsOneWidget);
    });

    testWidgets('should have SliverToBoxAdapter widgets', (tester) async {
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(SliverToBoxAdapter), findsWidgets);
    });
  });
}
