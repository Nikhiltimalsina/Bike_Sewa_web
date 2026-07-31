import 'package:dartz/dartz.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/core/utils/base_usecase.dart';
import 'package:bike_sewa/features/item/domain/entities/item_entity.dart';
import 'package:bike_sewa/features/item/domain/repositories/item_repository.dart';

class CreateItemUsecaseParams {
  final String title;
  final String description;
  final String requirements;
  final String category;
  final String location;
  final double pricePerDay;
  final String? imagePath;
  final String? videoPath;

  CreateItemUsecaseParams({
    required this.title,
    required this.description,
    required this.requirements,
    required this.category,
    required this.location,
    required this.pricePerDay,
    this.imagePath,
    this.videoPath,
  });
}

class CreateItemUsecase extends UseCase<ItemEntity, CreateItemUsecaseParams> {
  final ItemRepository repository;

  CreateItemUsecase({required this.repository});

  @override
  Future<Either<Failure, ItemEntity>> call(CreateItemUsecaseParams params) async {
    return repository.createItem(
      title: params.title,
      description: params.description,
      requirements: params.requirements,
      category: params.category,
      location: params.location,
      pricePerDay: params.pricePerDay,
      imagePath: params.imagePath,
      videoPath: params.videoPath,
    );
  }
}

class GetItemsUsecase extends UseCaseNoParams<List<ItemEntity>> {
  final ItemRepository repository;

  GetItemsUsecase({required this.repository});

  @override
  Future<Either<Failure, List<ItemEntity>>> call() async {
    return repository.getItems();
  }
}
