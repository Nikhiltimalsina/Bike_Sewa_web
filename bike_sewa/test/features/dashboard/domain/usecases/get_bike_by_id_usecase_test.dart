import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/features/dashboard/domain/entities/bike_entity.dart';
import 'package:bike_sewa/features/dashboard/domain/repositories/dashboard_repository.dart';
import 'package:bike_sewa/features/dashboard/domain/usecases/dashboard_usecases.dart';
import 'package:mocktail/mocktail.dart';

class MockDashboardRepository extends Mock implements DashboardRepository {}

void main() {
  late GetBikeByIdUseCase usecase;
  late MockDashboardRepository mockRepository;

  setUp(() {
    mockRepository = MockDashboardRepository();
    usecase = GetBikeByIdUseCase(mockRepository);
  });

  setUpAll(() {
    registerFallbackValue('');
  });

  const tBikeId = 'bike123';

  const tBike = BikeEntity(
    id: tBikeId,
    name: 'Honda',
    model: 'Dio 110',
    location: 'Thamel',
    latitude: 28.0,
    longitude: 84.0,
    isAvailable: true,
    pricePerHour: 500,
  );

  group('GetBikeByIdUseCase', () {
    test('should return bike when found', () async {
      // Arrange
      when(
        () => mockRepository.getBikeById(tBikeId),
      ).thenAnswer((_) async => const Right(tBike));

      // Act
      final result = await usecase(tBikeId);

      // Assert
      expect(result, const Right(tBike));
      verify(() => mockRepository.getBikeById(tBikeId)).called(1);
    });

    test('should return failure when bike not found', () async {
      // Arrange
      const failure = ApiFailure(message: 'Bike not found');
      when(
        () => mockRepository.getBikeById(any()),
      ).thenAnswer((_) async => const Left(failure));

      // Act
      final result = await usecase(tBikeId);

      // Assert
      expect(result, const Left(failure));
      verify(() => mockRepository.getBikeById(tBikeId)).called(1);
    });

    test('should pass correct id to repository', () async {
      // Arrange
      const bikeId = 'test-id';
      when(
        () => mockRepository.getBikeById(any()),
      ).thenAnswer((_) async => const Right(tBike));

      // Act
      await usecase(bikeId);

      // Assert
      verify(() => mockRepository.getBikeById(bikeId)).called(1);
    });

    test('should return failure for invalid id', () async {
      // Arrange
      const failure = ServerFailure(message: 'Invalid bike ID');
      when(
        () => mockRepository.getBikeById(any()),
      ).thenAnswer((_) async => const Left(failure));

      // Act
      final result = await usecase('');

      // Assert
      expect(result, const Left(failure));
      verify(() => mockRepository.getBikeById('')).called(1);
    });
  });
}