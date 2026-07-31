import 'dart:async';
import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/features/dashboard/domain/entities/bike_entity.dart';
import 'package:bike_sewa/features/dashboard/domain/usecases/dashboard_usecases.dart';
import 'package:bike_sewa/features/dashboard/presentation/pages/explore_view.dart';
import 'package:bike_sewa/features/dashboard/presentation/providers/dashboard_provider.dart';

class MockGetAllBikesUseCase extends Mock implements GetAllBikesUseCase {}

class MockGetAvailableBikesUseCase extends Mock implements GetAvailableBikesUseCase {}

class MockSearchBikesUseCase extends Mock implements SearchBikesUseCase {}

void main() {
  late MockGetAllBikesUseCase mockGetAllBikesUseCase;
  late MockGetAvailableBikesUseCase mockGetAvailableBikesUseCase;
  late MockSearchBikesUseCase mockSearchBikesUseCase;

  setUp(() {
    mockGetAllBikesUseCase = MockGetAllBikesUseCase();
    mockGetAvailableBikesUseCase = MockGetAvailableBikesUseCase();
    mockSearchBikesUseCase = MockSearchBikesUseCase();
  });

  final tBikes = [
    const BikeEntity(
      id: '1',
      name: 'Honda',
      model: 'Dio 110',
      location: 'Thamel',
      latitude: 28.0,
      longitude: 84.0,
      isAvailable: true,
      pricePerHour: 500,
    ),
    const BikeEntity(
      id: '2',
      name: 'Yamaha',
      model: 'FZ',
      location: 'Durbar Marg',
      latitude: 27.7,
      longitude: 85.3,
      isAvailable: false,
      pricePerHour: 600,
    ),
  ];

  Widget createTestWidget() {
    return ProviderScope(
      overrides: [
        getAllBikesUseCaseProvider.overrideWithValue(mockGetAllBikesUseCase),
        getAvailableBikesUseCaseProvider.overrideWithValue(
          mockGetAvailableBikesUseCase,
        ),
        searchBikesUseCaseProvider.overrideWithValue(mockSearchBikesUseCase),
      ],
      child: MaterialApp(home: Scaffold(body: ExploreView())),
    );
  }

  group('ExploreView - UI Elements', () {
    testWidgets('should display scaffold', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(Scaffold), findsOneWidget);
    });

    testWidgets('should display Explore header', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Explore'), findsOneWidget);
    });

    testWidgets('should display search icon', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.search), findsOneWidget);
    });

    testWidgets('should display tune icon for filter', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.tune), findsOneWidget);
    });
  });

  group('ExploreView - Search Functionality', () {
    testWidgets('should display search field', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(tBikes),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(TextField), findsOneWidget);
    });

    testWidgets('should allow text input in search field', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(tBikes),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      await tester.enterText(
        find.byType(TextField),
        'search query',
      );
      await tester.pump();

      expect(find.text('search query'), findsOneWidget);
    });

    testWidgets('should display search hint text', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(tBikes),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Search by model or location'), findsOneWidget);
    });
  });

  group('ExploreView - Loading State', () {
    testWidgets('should show progress indicator while loading', (tester) async {
      final completer = Completer<Either<Failure, List<BikeEntity>>>();
      when(() => mockGetAllBikesUseCase()).thenAnswer((_) => completer.future);

      await tester.pumpWidget(createTestWidget());
      await tester.pump();

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      verify(() => mockGetAllBikesUseCase()).called(1);

      completer.complete(Right<Failure, List<BikeEntity>>(<BikeEntity>[]));
      await tester.pumpAndSettle();
    });
  });

  group('ExploreView - Empty State', () {
    testWidgets('should show no bikes found message', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('No bikes found'), findsOneWidget);
      verify(() => mockGetAllBikesUseCase()).called(1);
    });

    testWidgets('should have RefreshIndicator', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(RefreshIndicator), findsOneWidget);
    });
  });

  group('ExploreView - Loaded State', () {
    testWidgets('should display bikes when loaded', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(tBikes),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Honda Dio 110'), findsOneWidget);
      expect(find.text('Rs. 500/hr'), findsOneWidget);
      verify(() => mockGetAllBikesUseCase()).called(1);
    });

    testWidgets('should call searchBikes when query submitted', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(tBikes),
      );
      when(() => mockSearchBikesUseCase(any())).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>([tBikes[0]]),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      await tester.enterText(find.byType(TextField), 'Honda');
      await tester.testTextInput.receiveAction(TextInputAction.done);
      await tester.pumpAndSettle();

      verify(() => mockSearchBikesUseCase('Honda')).called(1);
    });

    testWidgets('should call loadAvailableBikes when filter toggled on',
        (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(tBikes),
      );
      when(() => mockGetAvailableBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>([tBikes[0]]),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.tune));
      await tester.pumpAndSettle();

      verify(() => mockGetAvailableBikesUseCase()).called(1);
    });

    testWidgets('should call loadAllBikes when filter toggled off',
        (tester) async {
      when(() => mockGetAvailableBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>([tBikes[0]]),
      );
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(tBikes),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.tune));
      await tester.pumpAndSettle();
      await tester.tap(find.byIcon(Icons.tune));
      await tester.pumpAndSettle();

      verify(() => mockGetAllBikesUseCase()).called(2);
    });
  });

  group('ExploreView - Failure State', () {
    testWidgets('should display error message when load fails', (tester) async {
      const failure = ServerFailure(message: 'Failed to load bikes');
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => const Left<Failure, List<BikeEntity>>(failure),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Failed to load bikes'), findsOneWidget);
      verify(() => mockGetAllBikesUseCase()).called(1);
    });
  });

  group('ExploreView - Layout', () {
    testWidgets('should have SafeArea', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(SafeArea), findsOneWidget);
    });

    testWidgets('should have Column layout', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(Column), findsWidgets);
    });

    testWidgets('should have Expanded widget', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(Expanded), findsWidgets);
    });

    testWidgets('should have Padding widgets', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(Padding), findsWidgets);
    });
  });

  group('ExploreView - Filter Toggle', () {
    testWidgets('should display FilterToggle widget', (tester) async {
      when(() => mockGetAllBikesUseCase()).thenAnswer(
        (_) async => Right<Failure, List<BikeEntity>>(<BikeEntity>[]),
      );

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(GestureDetector), findsWidgets);
    });
  });
}
