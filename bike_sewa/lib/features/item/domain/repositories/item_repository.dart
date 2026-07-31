import 'package:dartz/dartz.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/features/item/domain/entities/item_entity.dart';

abstract class ItemRepository {
  Future<Either<Failure, ItemEntity>> createItem({
    required String title,
    required String description,
    required String requirements,
    required String category,
    required String location,
    required double pricePerDay,
    required String? imagePath,
    required String? videoPath,
  });

  Future<Either<Failure, List<ItemEntity>>> getItems();
}
