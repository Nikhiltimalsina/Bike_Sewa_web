import 'dart:developer';
import 'package:dio/dio.dart';
import '../../../../core/error/dio_error_mapper.dart';
import '../../../../core/error/exceptions.dart';
import '../models/booking_model.dart';

abstract class BookingRemoteDataSource {
  Future<List<BookingModel>> getMyBookings();

  Future<BookingModel> getBookingById(String id);

  Future<BookingModel> createBooking({
    required String bikeId,
    required DateTime startDate,
    required DateTime endDate,
  });

  Future<void> cancelBooking(String bookingId);
}

class BookingRemoteDataSourceImpl implements BookingRemoteDataSource {
  final Dio dio;

  BookingRemoteDataSourceImpl(this.dio);

  @override
  Future<List<BookingModel>> getMyBookings() async {
    try {
      final response = await dio.get('/bookings/me');
      log('Response data: ${response.data}'); // Debug log for response data
      if (response.statusCode == 200) {
        return (response.data['bookings'] as List)
            .map((b) => BookingModel.fromJson(b))
            .toList();
      }
      throw ServerException(
        message: response.data['message'] ?? 'Failed to fetch bookings',
      );
    } on DioException catch (e) {
      throw ServerException(message: friendlyDioMessage(e));
    }
  }

  @override
  Future<BookingModel> getBookingById(String id) async {
    try {
      final response = await dio.get('/bookings/$id');

      if (response.statusCode == 200) {
        return BookingModel.fromJson(response.data['booking']);
      }
      throw ServerException(
        message: response.data['message'] ?? 'Failed to fetch booking',
      );
    } on DioException catch (e) {
      throw ServerException(message: friendlyDioMessage(e));
    }
  }

  @override
  Future<BookingModel> createBooking({
    required String bikeId,
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    try {
      final response = await dio.post(
        '/bookings',
        data: {
          'bikeId': bikeId,
          'startDate': startDate.toIso8601String(),
          'endDate': endDate.toIso8601String(),
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return BookingModel.fromJson(response.data['booking']);
      }
      throw ServerException(
        message: response.data['message'] ?? 'Failed to create booking',
      );
    } on DioException catch (e) {
      throw ServerException(message: friendlyDioMessage(e));
    }
  }

  @override
  Future<void> cancelBooking(String bookingId) async {
    try {
      await dio.post('/bookings/$bookingId/cancel');
    } on DioException catch (e) {
      throw ServerException(message: friendlyDioMessage(e));
    }
  }
}