import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/features/dashboard/domain/entities/bike_entity.dart';
import 'package:bike_sewa/features/dashboard/domain/repositories/dashboard_repository.dart';
import 'package:bike_sewa/features/dashboard/domain/usecases/dashboard_usecases.dart';
import 'package:mocktail/mocktail.dart';

class MockDashboardRepository extends Mock implements DashboardRepository {}

void main() {
  late GetAllBikesUseCase usecase;
  late MockDashboardRepository mockRepository;

  setUp(() {
    mockRepository = MockDashboardRepository();
    usecase = GetAllBikesUseCase(mockRepository);
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
      imageUrl: 'https://example.com/honda.jpg',
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

  group('GetAllBikesUseCase', () {
    test('should return list of bikes when successful', () async {
      // Arrange
      when(
        () => mockRepository.getAllBikes(),
      ).thenAnswer((_) async => Right(tBikes));

      // Act
      final result = await usecase();

      // Assert
      expect(result, Right(tBikes));
      verify(() => mockRepository.getAllBikes()).called(1);
      verifyNoMoreInteractions(mockRepository);
    });

    test('should return failure when repository fails', () async {
      // Arrange
      const failure = ServerFailure(message: 'Failed to fetch bikes');
      when(
        () => mockRepository.getAllBikes(),
      ).thenAnswer((_) async => const Left(failure));

      // Act
      final result = await usecase();

      // Assert
      expect(result, const Left(failure));
      verify(() => mockRepository.getAllBikes()).called(1);
    });

    test('should return empty list when no bikes available', () async {
      // Arrange
      when(
        () => mockRepository.getAllBikes(),
      ).thenAnswer((_) async => const Right(<BikeEntity>[]));

      // Act
      final result = await usecase();

      // Assert
      expect(result, const Right(<BikeEntity>[]));
      verify(() => mockRepository.getAllBikes()).called(1);
    });

    test('should return ServerFailure on error', () async {
      // Arrange
      const failure = ServerFailure();
      when(
        () => mockRepository.getAllBikes(),
      ).thenAnswer((_) async => const Left(failure));

      // Act
      final result = await usecase();

      // Assert
      expect(result, const Left(failure));
      verify(() => mockRepository.getAllBikes()).called(1);
    });
  });
}