import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/features/dashboard/domain/entities/bike_entity.dart';
import 'package:bike_sewa/features/dashboard/domain/repositories/dashboard_repository.dart';
import 'package:bike_sewa/features/dashboard/domain/usecases/dashboard_usecases.dart';
import 'package:mocktail/mocktail.dart';

class MockDashboardRepository extends Mock implements DashboardRepository {}

void main() {
  late SearchBikesUseCase usecase;
  late MockDashboardRepository mockRepository;

  setUp(() {
    mockRepository = MockDashboardRepository();
    usecase = SearchBikesUseCase(mockRepository);
  });

  setUpAll(() {
    registerFallbackValue('');
  });

  final tSearchedBikes = [
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
  ];

  group('SearchBikesUseCase', () {
    test('should return list of bikes matching query', () async {
      // Arrange
      const query = 'Honda';
      when(
        () => mockRepository.searchBikes(query),
      ).thenAnswer((_) async => Right(tSearchedBikes));

      // Act
      final result = await usecase(query);

      // Assert
      expect(result, Right(tSearchedBikes));
      verify(() => mockRepository.searchBikes(query)).called(1);
    });

    test('should return empty list when no matches found', () async {
      // Arrange
      const query = 'nonexistent';
      when(
        () => mockRepository.searchBikes(query),
      ).thenAnswer((_) async => const Right(<BikeEntity>[]));

      // Act
      final result = await usecase(query);

      // Assert
      expect(result, const Right(<BikeEntity>[]));
      verify(() => mockRepository.searchBikes(query)).called(1);
    });

    test('should return failure when search fails', () async {
      // Arrange
      const failure = ServerFailure(message: 'Search failed');
      when(
        () => mockRepository.searchBikes(any()),
      ).thenAnswer((_) async => const Left(failure));

      // Act
      final result = await usecase('query');

      // Assert
      expect(result, const Left(failure));
      verify(() => mockRepository.searchBikes(any())).called(1);
    });

    test('should pass correct query to repository', () async {
      // Arrange
      const searchQuery = 'motorcycle';
      when(
        () => mockRepository.searchBikes(any()),
      ).thenAnswer((_) async => Right(tSearchedBikes));

      // Act
      await usecase(searchQuery);

      // Assert
      verify(() => mockRepository.searchBikes(searchQuery)).called(1);
    });

    test('should succeed with valid query and fail with empty query', () async {
      // Arrange
      const validQuery = 'Honda';
      const emptyQuery = '';
      const failure = ApiFailure(message: 'Invalid query');

      when(() => mockRepository.searchBikes(any())).thenAnswer((invocation) async {
        final query = invocation.positionalArguments[0] as String;
        if (query.isNotEmpty) {
          return Right(tSearchedBikes);
        }
        return const Left(failure);
      });

      // Act & Assert - Valid query should succeed
      final successResult = await usecase(validQuery);
      expect(successResult, Right(tSearchedBikes));

      // Act & Assert - Empty query should fail
      final failResult = await usecase(emptyQuery);
      expect(failResult, const Left(failure));
    });
  });
}