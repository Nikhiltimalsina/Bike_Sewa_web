import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/features/dashboard/domain/repositories/dashboard_repository.dart';
import 'package:bike_sewa/features/dashboard/domain/usecases/dashboard_usecases.dart';
import 'package:mocktail/mocktail.dart';

class MockDashboardRepository extends Mock implements DashboardRepository {}

void main() {
  late RentBikeUseCase usecase;
  late MockDashboardRepository mockRepository;

  setUp(() {
    mockRepository = MockDashboardRepository();
    usecase = RentBikeUseCase(mockRepository);
  });

  setUpAll(() {
    registerFallbackValue('');
  });

  const tBikeId = 'bike123';

  group('RentBikeUseCase', () {
    test('should return true when bike rent is successful', () async {
      // Arrange
      when(
        () => mockRepository.rentBike(tBikeId),
      ).thenAnswer((_) async => const Right(null));

      // Act
      final result = await usecase(tBikeId);

      // Assert
      expect(result, const Right(null));
      verify(() => mockRepository.rentBike(tBikeId)).called(1);
    });

    test('should return failure when rent fails', () async {
      // Arrange
      const failure = ApiFailure(message: 'Bike not available for rent');
      when(
        () => mockRepository.rentBike(any()),
      ).thenAnswer((_) async => const Left(failure));

      // Act
      final result = await usecase(tBikeId);

      // Assert
      expect(result, const Left(failure));
      verify(() => mockRepository.rentBike(tBikeId)).called(1);
    });

    test('should return ServerFailure on error', () async {
      // Arrange
      const failure = ServerFailure();
      when(
        () => mockRepository.rentBike(any()),
      ).thenAnswer((_) async => const Left(failure));

      // Act
      final result = await usecase(tBikeId);

      // Assert
      expect(result, const Left(failure));
      verify(() => mockRepository.rentBike(tBikeId)).called(1);
    });

    test('should pass correct bikeId to repository', () async {
      // Arrange
      const bikeId = 'test-bike-id';
      when(
        () => mockRepository.rentBike(any()),
      ).thenAnswer((_) async => const Right(null));

      // Act
      await usecase(bikeId);

      // Assert
      verify(() => mockRepository.rentBike(bikeId)).called(1);
    });

    test('should succeed with valid id and fail with invalid id', () async {
      // Arrange
      const validId = 'valid-bike-id';
      const invalidId = '';
      const failure = ApiFailure(message: 'Invalid bike ID');

      when(() => mockRepository.rentBike(any())).thenAnswer((invocation) async {
        final bikeId = invocation.positionalArguments[0] as String;
        if (bikeId.isNotEmpty) {
          return const Right(null);
        }
        return const Left(failure);
      });

      // Act & Assert - Valid id should succeed
      final successResult = await usecase(validId);
      expect(successResult, const Right(null));

      // Act & Assert - Invalid id should fail
      final failResult = await usecase(invalidId);
      expect(failResult, const Left(failure));
    });
  });
}