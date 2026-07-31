import 'package:dio/dio.dart';
import '../../../../core/error/exceptions.dart';
import '../models/bike_model.dart';

abstract class DashboardRemoteDataSource {
  Future<List<BikeModel>> getAllBikes();

  Future<List<BikeModel>> getAvailableBikes();

  Future<BikeModel> getBikeById(String id);

  Future<List<BikeModel>> searchBikes(String query);

  Future<List<BikeModel>> getBikesByLocation(String location);

  Future<void> rentBike(String bikeId);

  Future<void> returnBike(String bikeId);
}

class DashboardRemoteDataSourceImpl implements DashboardRemoteDataSource {
  final Dio dio;

  DashboardRemoteDataSourceImpl(this.dio);

  @override
  Future<List<BikeModel>> getAllBikes() async {
    try {
      final response = await dio.get('/bikes');

      if (response.statusCode == 200) {
        final bikes = (response.data['bikes'] as List)
            .map((bike) => BikeModel.fromJson(bike))
            .toList();
        return bikes;
      } else {
        throw ServerException(
          message: response.data['message'] ?? 'Failed to fetch bikes',
        );
      }
    } on DioException catch (e) {
      throw ServerException(message: e.message ?? 'Network error occurred');
    }
  }

  @override
  Future<List<BikeModel>> getAvailableBikes() async {
    try {
      final response = await dio.get(
        '/bikes',
        queryParameters: {'available': true},
      );

      if (response.statusCode == 200) {
        final bikes = (response.data['bikes'] as List)
            .map((bike) => BikeModel.fromJson(bike))
            .toList();
        return bikes;
      } else {
        throw ServerException(
          message:
              response.data['message'] ?? 'Failed to fetch available bikes',
        );
      }
    } on DioException catch (e) {
      throw ServerException(message: e.message ?? 'Network error occurred');
    }
  }

  @override
  Future<BikeModel> getBikeById(String id) async {
    try {
      final response = await dio.get('/bikes/$id');

      if (response.statusCode == 200) {
        return BikeModel.fromJson(response.data['bike']);
      } else {
        throw ServerException(
          message: response.data['message'] ?? 'Failed to fetch bike',
        );
      }
    } on DioException catch (e) {
      throw ServerException(message: e.message ?? 'Network error occurred');
    }
  }

  @override
  Future<List<BikeModel>> searchBikes(String query) async {
    try {
      final response = await dio.get(
        '/bikes/search',
        queryParameters: {'q': query},
      );

      if (response.statusCode == 200) {
        final bikes = (response.data['bikes'] as List)
            .map((bike) => BikeModel.fromJson(bike))
            .toList();
        return bikes;
      } else {
        throw ServerException(
          message: response.data['message'] ?? 'Failed to search bikes',
        );
      }
    } on DioException catch (e) {
      throw ServerException(message: e.message ?? 'Network error occurred');
    }
  }

  @override
  Future<List<BikeModel>> getBikesByLocation(String location) async {
    try {
      final response = await dio.get(
        '/bikes/location',
        queryParameters: {'location': location},
      );

      if (response.statusCode == 200) {
        final bikes = (response.data['bikes'] as List)
            .map((bike) => BikeModel.fromJson(bike))
            .toList();
        return bikes;
      } else {
        throw ServerException(
          message:
              response.data['message'] ?? 'Failed to fetch bikes by location',
        );
      }
    } on DioException catch (e) {
      throw ServerException(message: e.message ?? 'Network error occurred');
    }
  }

  @override
  Future<void> rentBike(String bikeId) async {
    try {
      await dio.post('/bikes/$bikeId/rent');
    } on DioException catch (e) {
      throw ServerException(message: e.message ?? 'Failed to rent bike');
    }
  }

  @override
  Future<void> returnBike(String bikeId) async {
    try {
      await dio.post('/bikes/$bikeId/return');
    } on DioException catch (e) {
      throw ServerException(message: e.message ?? 'Failed to return bike');
    }
  }
}
