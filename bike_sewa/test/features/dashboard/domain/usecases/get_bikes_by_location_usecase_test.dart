import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/features/dashboard/domain/entities/bike_entity.dart';
import 'package:bike_sewa/features/dashboard/domain/repositories/dashboard_repository.dart';
import 'package:bike_sewa/features/dashboard/domain/usecases/dashboard_usecases.dart';
import 'package:mocktail/mocktail.dart';

class MockDashboardRepository extends Mock implements DashboardRepository {}

void main() {
  late GetBikesByLocationUseCase usecase;
  late MockDashboardRepository mockRepository;

  setUp(() {
    mockRepository = MockDashboardRepository();
    usecase = GetBikesByLocationUseCase(mockRepository);
  });

  setUpAll(() {
    registerFallbackValue('');
  });

  final tBikesByLocation = [
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
      location: 'Thamel',
      latitude: 28.0,
      longitude: 84.0,
      isAvailable: false,
      pricePerHour: 600,
    ),
  ];

  group('GetBikesByLocationUseCase', () {
    test('should return list of bikes for location when successful', () async {
      // Arrange
      const location = 'Thamel';
      when(
        () => mockRepository.getBikesByLocation(location),
      ).thenAnswer((_) async => Right(tBikesByLocation));

      // Act
      final result = await usecase(location);

      // Assert
      expect(result, Right(tBikesByLocation));
      verify(() => mockRepository.getBikesByLocation(location)).called(1);
    });

    test('should return empty list when no bikes at location', () async {
      // Arrange
      const location = 'Remote Area';
      when(
        () => mockRepository.getBikesByLocation(location),
      ).thenAnswer((_) async => const Right(<BikeEntity>[]));

      // Act
      final result = await usecase(location);

      // Assert
      expect(result, const Right(<BikeEntity>[]));
      verify(() => mockRepository.getBikesByLocation(location)).called(1);
    });

    test('should return failure when repository fails', () async {
      // Arrange
      const failure = ServerFailure(message: 'Failed to fetch bikes by location');
      when(
        () => mockRepository.getBikesByLocation(any()),
      ).thenAnswer((_) async => const Left(failure));

      // Act
      final result = await usecase('Thamel');

      // Assert
      expect(result, const Left(failure));
      verify(() => mockRepository.getBikesByLocation(any())).called(1);
    });

    test('should pass correct location to repository', () async {
      // Arrange
      const testLocation = 'Durbar Marg';
      when(
        () => mockRepository.getBikesByLocation(any()),
      ).thenAnswer((_) async => Right(tBikesByLocation));

      // Act
      await usecase(testLocation);

      // Assert
      verify(() => mockRepository.getBikesByLocation(testLocation)).called(1);
    });

    test('should succeed with valid location and fail with empty', () async {
      // Arrange
      const validLocation = 'Thamel';
      const invalidLocation = '';
      const failure = ApiFailure(message: 'Location required');

      when(() => mockRepository.getBikesByLocation(any())).thenAnswer((invocation) async {
        final location = invocation.positionalArguments[0] as String;
        if (location.isNotEmpty) {
          return Right(tBikesByLocation);
        }
        return const Left(failure);
      });

      // Act & Assert - Valid location should succeed
      final successResult = await usecase(validLocation);
      expect(successResult, Right(tBikesByLocation));

      // Act & Assert - Invalid location should fail
      final failResult = await usecase(invalidLocation);
      expect(failResult, const Left(failure));
    });
  });
}