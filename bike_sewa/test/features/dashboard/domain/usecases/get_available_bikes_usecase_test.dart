import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/features/dashboard/domain/entities/bike_entity.dart';
import 'package:bike_sewa/features/dashboard/domain/repositories/dashboard_repository.dart';
import 'package:bike_sewa/features/dashboard/domain/usecases/dashboard_usecases.dart';
import 'package:mocktail/mocktail.dart';

class MockDashboardRepository extends Mock implements DashboardRepository {}

void main() {
  late GetAvailableBikesUseCase usecase;
  late MockDashboardRepository mockRepository;

  setUp(() {
    mockRepository = MockDashboardRepository();
    usecase = GetAvailableBikesUseCase(mockRepository);
  });

  final tAvailableBikes = [
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

  group('GetAvailableBikesUseCase', () {
    test('should return list of available bikes when successful', () async {
      // Arrange
      when(
        () => mockRepository.getAvailableBikes(),
      ).thenAnswer((_) async => Right(tAvailableBikes));

      // Act
      final result = await usecase();

      // Assert
      expect(result, Right(tAvailableBikes));
      verify(() => mockRepository.getAvailableBikes()).called(1);
      verifyNoMoreInteractions(mockRepository);
    });

    test('should return failure when repository fails', () async {
      // Arrange
      const failure = ServerFailure(message: 'Failed to fetch available bikes');
      when(
        () => mockRepository.getAvailableBikes(),
      ).thenAnswer((_) async => const Left(failure));

      // Act
      final result = await usecase();

      // Assert
      expect(result, const Left(failure));
      verify(() => mockRepository.getAvailableBikes()).called(1);
    });

    test('should return empty list when no available bikes', () async {
      // Arrange
      when(
        () => mockRepository.getAvailableBikes(),
      ).thenAnswer((_) async => const Right(<BikeEntity>[]));

      // Act
      final result = await usecase();

      // Assert
      expect(result, const Right(<BikeEntity>[]));
      verify(() => mockRepository.getAvailableBikes()).called(1);
    });

    test('should return ApiFailure on error', () async {
      // Arrange
      const failure = ApiFailure(message: 'API error');
      when(
        () => mockRepository.getAvailableBikes(),
      ).thenAnswer((_) async => const Left(failure));

      // Act
      final result = await usecase();

      // Assert
      expect(result, const Left(failure));
      verify(() => mockRepository.getAvailableBikes()).called(1);
    });
  });
}