import 'package:dartz/dartz.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/features/dashboard/domain/entities/bike_entity.dart';
import 'package:bike_sewa/features/dashboard/domain/usecases/dashboard_usecases.dart';
import 'package:bike_sewa/features/dashboard/presentation/providers/dashboard_provider.dart';
import 'package:mocktail/mocktail.dart';

class MockGetAllBikesUseCase extends Mock implements GetAllBikesUseCase {}

class MockGetAvailableBikesUseCase extends Mock
    implements GetAvailableBikesUseCase {}

class MockSearchBikesUseCase extends Mock implements SearchBikesUseCase {}

void main() {
  late MockGetAllBikesUseCase mockGetAllBikesUseCase;
  late MockGetAvailableBikesUseCase mockGetAvailableBikesUseCase;
  late MockSearchBikesUseCase mockSearchBikesUseCase;
  late ProviderContainer container;

  setUpAll(() {
    registerFallbackValue('');
  });

  setUp(() {
    mockGetAllBikesUseCase = MockGetAllBikesUseCase();
    mockGetAvailableBikesUseCase = MockGetAvailableBikesUseCase();
    mockSearchBikesUseCase = MockSearchBikesUseCase();

    container = ProviderContainer(
      overrides: [
        getAllBikesUseCaseProvider.overrideWithValue(mockGetAllBikesUseCase),
        getAvailableBikesUseCaseProvider.overrideWithValue(
          mockGetAvailableBikesUseCase,
        ),
        searchBikesUseCaseProvider.overrideWithValue(mockSearchBikesUseCase),
      ],
    );
  });

  tearDown(() {
    container.dispose();
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

  group('BikesListNotifier', () {
    group('initial state', () {
      test('should have initial state when created', () {
        // Act
        final state = container.read(bikesListProvider);

        // Assert
        expect(state, isA<BikesListInitial>());
      });
    });

    group('loadAllBikes', () {
      test('should emit loading then loaded state when successful', () async {
        // Arrange
        when(
          () => mockGetAllBikesUseCase(),
        ).thenAnswer((_) async => Right(tBikes));

        final notifier = container.read(bikesListProvider.notifier);

        // Act
        await notifier.loadAllBikes();

        // Assert
        final state = container.read(bikesListProvider);
        expect(state, BikesListLoaded(tBikes));
        verify(() => mockGetAllBikesUseCase()).called(1);
      });

      test('should emit loading then failure state when failed', () async {
        // Arrange
        const failure = ServerFailure(message: 'Failed to load bikes');
        when(
          () => mockGetAllBikesUseCase(),
        ).thenAnswer((_) async => const Left(failure));

        final notifier = container.read(bikesListProvider.notifier);

        // Act
        await notifier.loadAllBikes();

        // Assert
        final state = container.read(bikesListProvider);
        expect(state, const BikesListFailure('Failed to load bikes'));
        verify(() => mockGetAllBikesUseCase()).called(1);
      });

      test('should emit loaded state with empty list when no bikes', () async {
        // Arrange
        when(
          () => mockGetAllBikesUseCase(),
        ).thenAnswer((_) async => const Right(<BikeEntity>[]));

        final notifier = container.read(bikesListProvider.notifier);

        // Act
        await notifier.loadAllBikes();

        // Assert
        final state = container.read(bikesListProvider);
        expect(state, const BikesListLoaded(<BikeEntity>[]));
      });
    });

    group('loadAvailableBikes', () {
      test('should emit loaded state with available bikes', () async {
        // Arrange
        final availableBikes = [tBikes[0]];
        when(
          () => mockGetAvailableBikesUseCase(),
        ).thenAnswer((_) async => Right(availableBikes));

        final notifier = container.read(bikesListProvider.notifier);

        // Act
        await notifier.loadAvailableBikes();

        // Assert
        final state = container.read(bikesListProvider);
        expect(state, BikesListLoaded(availableBikes));
        verify(() => mockGetAvailableBikesUseCase()).called(1);
      });

      test('should emit failure state when loadAvailableBikes fails', () async {
        // Arrange
        const failure = ApiFailure(message: 'No available bikes');
        when(
          () => mockGetAvailableBikesUseCase(),
        ).thenAnswer((_) async => const Left(failure));

        final notifier = container.read(bikesListProvider.notifier);

        // Act
        await notifier.loadAvailableBikes();

        // Assert
        final state = container.read(bikesListProvider);
        expect(state, const BikesListFailure('No available bikes'));
      });
    });

    group('searchBikes', () {
      test('should emit loaded state with searched bikes', () async {
        // Arrange
        final searchedBikes = [tBikes[0]];
        when(
          () => mockSearchBikesUseCase(any()),
        ).thenAnswer((_) async => Right(searchedBikes));

        final notifier = container.read(bikesListProvider.notifier);

        // Act
        await notifier.searchBikes('Honda');

        // Assert
        final state = container.read(bikesListProvider);
        expect(state, BikesListLoaded(searchedBikes));
        verify(() => mockSearchBikesUseCase('Honda')).called(1);
      });

      test('should emit failure state when search fails', () async {
        // Arrange
        const failure = ServerFailure(message: 'Search failed');
        when(
          () => mockSearchBikesUseCase(any()),
        ).thenAnswer((_) async => const Left(failure));

        final notifier = container.read(bikesListProvider.notifier);

        // Act
        await notifier.searchBikes('query');

        // Assert
        final state = container.read(bikesListProvider);
        expect(state, const BikesListFailure('Search failed'));
      });

      test('should pass correct query to use case', () async {
        // Arrange
        String? capturedQuery;
        when(() => mockSearchBikesUseCase(any())).thenAnswer((invocation) {
          capturedQuery = invocation.positionalArguments[0] as String;
          return Future.value(const Right(<BikeEntity>[]));
        });

        final notifier = container.read(bikesListProvider.notifier);

        // Act
        await notifier.searchBikes('Yamaha');

        // Assert
        expect(capturedQuery, 'Yamaha');
      });
    });
  });

  group('BikesListState', () {
    test('should have correct initial values', () {
      // Arrange
      final state = BikesListInitial();

      // Assert
      expect(state, isA<BikesListInitial>());
    });

    test('loaded state should contain bikes', () {
      // Arrange
      final state = BikesListLoaded(tBikes);

      // Assert
      expect(state, isA<BikesListLoaded>());
      expect(state.bikes, tBikes);
    });

    test('failure state should contain message', () {
      // Arrange
      final state = BikesListFailure('Error message');

      // Assert
      expect(state, isA<BikesListFailure>());
      expect(state.message, 'Error message');
    });
  });
}