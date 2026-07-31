import 'package:dartz/dartz.dart';
import 'package:bike_sewa/core/error/exceptions.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/features/item/data/datasources/item_remote_datasource.dart';
import 'package:bike_sewa/features/item/domain/entities/item_entity.dart';
import 'package:bike_sewa/features/item/domain/repositories/item_repository.dart';

class ItemRepositoryImpl implements ItemRepository {
  final ItemRemoteDatasource remoteDatasource;

  ItemRepositoryImpl({required this.remoteDatasource});

  @override
  Future<Either<Failure, ItemEntity>> createItem({
    required String title,
    required String description,
    required String requirements,
    required String category,
    required String location,
    required double pricePerDay,
    required String? imagePath,
    required String? videoPath,
  }) async {
    try {
      final item = await remoteDatasource.createItem(
        title: title,
        description: description,
        requirements: requirements,
        category: category,
        location: location,
        pricePerDay: pricePerDay,
        imagePath: imagePath,
        videoPath: videoPath,
      );
      return Right(item);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(GenericFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<ItemEntity>>> getItems() async {
    try {
      final items = await remoteDatasource.getItems();
      return Right(items);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(GenericFailure(message: e.toString()));
    }
  }
}
