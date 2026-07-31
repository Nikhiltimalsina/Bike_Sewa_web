import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/bike_entity.dart';
import '../../domain/repositories/dashboard_repository.dart';
import '../datasources/dashboard_remote_datasource.dart';

/// Dashboard Repository Implementation

class DashboardRepositoryImpl implements DashboardRepository {
  final DashboardRemoteDataSource remoteDataSource;

  DashboardRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, List<BikeEntity>>> getAllBikes() async {
    try {
      final bikeModels = await remoteDataSource.getAllBikes();
      final bikes = bikeModels.map((model) => model.toEntity()).toList();
      return Right(bikes);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.message ?? 'Network error'));
    } catch (e) {
      return Left(GenericFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<BikeEntity>>> getAvailableBikes() async {
    try {
      final bikeModels = await remoteDataSource.getAvailableBikes();
      final bikes = bikeModels.map((model) => model.toEntity()).toList();
      return Right(bikes);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(GenericFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, BikeEntity>> getBikeById(String id) async {
    try {
      final bikeModel = await remoteDataSource.getBikeById(id);
      return Right(bikeModel.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(GenericFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<BikeEntity>>> searchBikes(String query) async {
    try {
      final bikeModels = await remoteDataSource.searchBikes(query);
      final bikes = bikeModels.map((model) => model.toEntity()).toList();
      return Right(bikes);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(GenericFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<BikeEntity>>> getBikesByLocation(
    String location,
  ) async {
    try {
      final bikeModels = await remoteDataSource.getBikesByLocation(location);
      final bikes = bikeModels.map((model) => model.toEntity()).toList();
      return Right(bikes);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(GenericFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> rentBike(String bikeId) async {
    try {
      await remoteDataSource.rentBike(bikeId);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(GenericFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> returnBike(String bikeId) async {
    try {
      await remoteDataSource.returnBike(bikeId);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(GenericFailure(message: e.toString()));
    }
  }
}
