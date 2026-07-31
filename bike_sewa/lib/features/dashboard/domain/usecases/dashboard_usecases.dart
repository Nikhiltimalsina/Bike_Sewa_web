import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/utils/base_usecase.dart';
import '../entities/bike_entity.dart';
import '../repositories/dashboard_repository.dart';

/// Get All Bikes UseCase
class GetAllBikesUseCase extends UseCaseNoParams<List<BikeEntity>> {
  final DashboardRepository repository;

  GetAllBikesUseCase(this.repository);

  @override
  Future<Either<Failure, List<BikeEntity>>> call() async {
    return repository.getAllBikes();
  }
}

/// Get Available Bikes UseCase
class GetAvailableBikesUseCase extends UseCaseNoParams<List<BikeEntity>> {
  final DashboardRepository repository;

  GetAvailableBikesUseCase(this.repository);

  @override
  Future<Either<Failure, List<BikeEntity>>> call() async {
    return repository.getAvailableBikes();
  }
}

/// Get Bike By Id UseCase
class GetBikeByIdUseCase extends UseCaseWithString<BikeEntity> {
  final DashboardRepository repository;

  GetBikeByIdUseCase(this.repository);

  @override
  Future<Either<Failure, BikeEntity>> call(String id) async {
    return repository.getBikeById(id);
  }
}

/// Search Bikes UseCase
class SearchBikesUseCase extends UseCaseWithString<List<BikeEntity>> {
  final DashboardRepository repository;

  SearchBikesUseCase(this.repository);

  @override
  Future<Either<Failure, List<BikeEntity>>> call(String query) async {
    return repository.searchBikes(query);
  }
}

/// Get Bikes By Location UseCase
class GetBikesByLocationUseCase extends UseCaseWithString<List<BikeEntity>> {
  final DashboardRepository repository;

  GetBikesByLocationUseCase(this.repository);

  @override
  Future<Either<Failure, List<BikeEntity>>> call(String location) async {
    return repository.getBikesByLocation(location);
  }
}

/// Rent Bike UseCase
class RentBikeUseCase extends UseCaseWithString<void> {
  final DashboardRepository repository;

  RentBikeUseCase(this.repository);

  @override
  Future<Either<Failure, void>> call(String bikeId) async {
    return repository.rentBike(bikeId);
  }
}

/// Return Bike UseCase
class ReturnBikeUseCase extends UseCaseWithString<void> {
  final DashboardRepository repository;

  ReturnBikeUseCase(this.repository);

  @override
  Future<Either<Failure, void>> call(String bikeId) async {
    return repository.returnBike(bikeId);
  }
}
