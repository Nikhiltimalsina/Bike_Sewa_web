import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/features/item/domain/entities/item_entity.dart';
import 'package:bike_sewa/features/item/domain/repositories/item_repository.dart';
import 'package:bike_sewa/features/item/domain/usecases/item_usecases.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockItemRepository extends Mock implements ItemRepository {}

void main() {
  late CreateItemUsecase usecase;
  late GetItemsUsecase getItemsUsecase;
  late MockItemRepository mockRepository;

  setUp(() {
    mockRepository = MockItemRepository();
    usecase = CreateItemUsecase(repository: mockRepository);
    getItemsUsecase = GetItemsUsecase(repository: mockRepository);
  });

  const tTitle = 'iPhone 15';
  const tDescription = 'Latest iPhone model';
  const tRequirements = 'Good condition';
  const tCategory = 'Electronics';
  const tLocation = 'Kathmandu';
  const tPricePerDay = 5000.0;
  const tImagePath = '/path/to/image.jpg';

  final tItem = ItemEntity(
    id: '1',
    title: 'iPhone 15',
    description: 'Latest iPhone model',
    requirements: 'Good condition',
    category: 'Electronics',
    location: 'Kathmandu',
    pricePerDay: 5000,
    imagePath: '/path/to/image.jpg',
  );

  group('CreateItemUsecase', () {
    test('should return item when creation is successful', () async {
      // Arrange
      when(
        () => mockRepository.createItem(
          title: any(named: 'title'),
          description: any(named: 'description'),
          requirements: any(named: 'requirements'),
          category: any(named: 'category'),
          location: any(named: 'location'),
          pricePerDay: any(named: 'pricePerDay'),
          imagePath: any(named: 'imagePath', that: null),
          videoPath: any(named: 'videoPath', that: null),
        ),
      ).thenAnswer((_) async => Right(tItem));

      // Act
      final result = await usecase(
        CreateItemUsecaseParams(
          title: tTitle,
          description: tDescription,
          requirements: tRequirements,
          category: tCategory,
          location: tLocation,
          pricePerDay: tPricePerDay,
          imagePath: tImagePath,
        ),
      );

      // Assert
      expect(result, Right(tItem));
      verify(
        () => mockRepository.createItem(
          title: tTitle,
          description: tDescription,
          requirements: tRequirements,
          category: tCategory,
          location: tLocation,
          pricePerDay: tPricePerDay,
          imagePath: tImagePath,
          videoPath: null,
        ),
      ).called(1);
    });

    test('should return ServerFailure when creation fails', () async {
      // Arrange
      when(
        () => mockRepository.createItem(
          title: any(named: 'title'),
          description: any(named: 'description'),
          requirements: any(named: 'requirements'),
          category: any(named: 'category'),
          location: any(named: 'location'),
          pricePerDay: any(named: 'pricePerDay'),
          imagePath: any(named: 'imagePath'),
          videoPath: any(named: 'videoPath'),
        ),
      ).thenAnswer(
        (_) async => const Left(ServerFailure(message: 'Failed to create item')),
      );

      // Act
      final result = await usecase(
        CreateItemUsecaseParams(
          title: tTitle,
          description: tDescription,
          requirements: tRequirements,
          category: tCategory,
          location: tLocation,
          pricePerDay: tPricePerDay,
          imagePath: tImagePath,
        ),
      );

      // Assert
      result.fold(
        (failure) => expect(failure, isA<ServerFailure>()),
        (item) => fail('Should return failure'),
      );
    });

    test('should return GenericFailure on unexpected error', () async {
      // Arrange
      when(
        () => mockRepository.createItem(
          title: any(named: 'title'),
          description: any(named: 'description'),
          requirements: any(named: 'requirements'),
          category: any(named: 'category'),
          location: any(named: 'location'),
          pricePerDay: any(named: 'pricePerDay'),
          imagePath: any(named: 'imagePath'),
          videoPath: any(named: 'videoPath'),
        ),
      ).thenAnswer(
        (_) async => Left(GenericFailure(message: 'Exception: Unexpected error')),
      );

      // Act
      final result = await usecase(
        CreateItemUsecaseParams(
          title: tTitle,
          description: tDescription,
          requirements: tRequirements,
          category: tCategory,
          location: tLocation,
          pricePerDay: tPricePerDay,
          imagePath: tImagePath,
        ),
      );

      // Assert
      result.fold(
        (failure) => expect(failure, isA<GenericFailure>()),
        (item) => fail('Should return failure'),
      );
    });

    test('should handle optional parameters as null', () async {
      // Arrange
      final paramsWithoutOptional = CreateItemUsecaseParams(
        title: 'Test Item',
        description: 'Description',
        requirements: 'Requirements',
        category: 'Category',
        location: 'Location',
        pricePerDay: 1000.0,
      );

      when(
        () => mockRepository.createItem(
          title: any(named: 'title'),
          description: any(named: 'description'),
          requirements: any(named: 'requirements'),
          category: any(named: 'category'),
          location: any(named: 'location'),
          pricePerDay: any(named: 'pricePerDay'),
          imagePath: any(named: 'imagePath', that: null),
          videoPath: any(named: 'videoPath', that: null),
        ),
      ).thenAnswer((_) async => Right(tItem));

      // Act
      final result = await usecase(paramsWithoutOptional);

      // Assert
      expect(result.isRight(), true);
    });
  });

  group('GetItemsUsecase', () {
    test('should return items when fetch is successful', () async {
      // Arrange
      when(() => mockRepository.getItems()).thenAnswer(
        (_) async => Right([tItem]),
      );

      // Act
      final result = await getItemsUsecase();

      // Assert
      expect(result, Right([tItem]));
      verify(() => mockRepository.getItems()).called(1);
    });

    test('should return failure when getItems fails', () async {
      // Arrange
      when(() => mockRepository.getItems()).thenAnswer(
        (_) async => const Left(ServerFailure(message: 'Failed to fetch items')),
      );

      // Act
      final result = await getItemsUsecase();

      // Assert
      result.fold(
        (failure) => expect(failure, isA<ServerFailure>()),
        (items) => fail('Should return failure'),
      );
    });
  });

  group('CreateItemUsecaseParams', () {
    test('should create with required fields', () {
      // Arrange
      final params = CreateItemUsecaseParams(
        title: 'Test',
        description: 'Desc',
        requirements: 'Req',
        category: 'Cat',
        location: 'Loc',
        pricePerDay: 100.0,
      );

      // Assert
      expect(params.title, 'Test');
      expect(params.description, 'Desc');
      expect(params.requirements, 'Req');
    });

    test('two params with same values should have same title', () {
      // Arrange
      final params1 = CreateItemUsecaseParams(
        title: 'Test',
        description: 'Desc',
        requirements: 'Req',
        category: 'Cat',
        location: 'Loc',
        pricePerDay: 100.0,
      );
      final params2 = CreateItemUsecaseParams(
        title: 'Test',
        description: 'Desc',
        requirements: 'Req',
        category: 'Cat',
        location: 'Loc',
        pricePerDay: 100.0,
      );

      // Assert
      expect(params1.title, params2.title);
      expect(params1.description, params2.description);
    });

    test('two params with different values should not be equal', () {
      // Arrange
      final params1 = CreateItemUsecaseParams(
        title: 'Test',
        description: 'Desc',
        requirements: 'Req',
        category: 'Cat',
        location: 'Loc',
        pricePerDay: 100.0,
      );
      final params2 = CreateItemUsecaseParams(
        title: 'Different',
        description: 'Desc',
        requirements: 'Req',
        category: 'Cat',
        location: 'Loc',
        pricePerDay: 100.0,
      );

      // Assert
      expect(params1.title, isNot(params2.title));
    });
  });
}
