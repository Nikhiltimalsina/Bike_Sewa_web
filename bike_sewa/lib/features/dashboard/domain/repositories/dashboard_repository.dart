import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/bike_entity.dart';

/// Abstract Dashboard Repository

abstract class DashboardRepository {
  Future<Either<Failure, List<BikeEntity>>> getAllBikes();

  Future<Either<Failure, List<BikeEntity>>> getAvailableBikes();

  Future<Either<Failure, BikeEntity>> getBikeById(String id);

  Future<Either<Failure, List<BikeEntity>>> searchBikes(String query);

  Future<Either<Failure, List<BikeEntity>>> getBikesByLocation(String location);

  Future<Either<Failure, void>> rentBike(String bikeId);

  Future<Either<Failure, void>> returnBike(String bikeId);
}
