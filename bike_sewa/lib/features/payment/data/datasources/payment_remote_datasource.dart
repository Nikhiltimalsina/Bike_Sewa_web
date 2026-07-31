import 'package:dio/dio.dart';
import '../../../../core/error/dio_error_mapper.dart';
import '../../../../core/error/exceptions.dart';
import '../models/payment_model.dart';

abstract class PaymentRemoteDataSource {
  Future<List<PaymentModel>> getMyPayments();

  Future<PaymentModel> getPaymentById(String id);

  Future<PaymentModel> processPayment({
    required String bookingId,
    required double amount,
    required String method,
  });

  Future<void> refundPayment(String paymentId);
}

class PaymentRemoteDataSourceImpl implements PaymentRemoteDataSource {
  final Dio dio;

  PaymentRemoteDataSourceImpl(this.dio);

  @override
  Future<List<PaymentModel>> getMyPayments() async {
    try {
      final response = await dio.get('/payments/me');
      if (response.statusCode == 200) {
        return (response.data['payments'] as List)
            .map((p) => PaymentModel.fromJson(p))
            .toList();
      }
      throw ServerException(
        message: response.data['message'] ?? 'Failed to fetch payments',
      );
    } on DioException catch (e) {
      throw ServerException(message: friendlyDioMessage(e));
    }
  }

  @override
  Future<PaymentModel> getPaymentById(String id) async {
    try {
      final response = await dio.get('/payments/$id');
      if (response.statusCode == 200) {
        return PaymentModel.fromJson(response.data['payment']);
      }
      throw ServerException(
        message: response.data['message'] ?? 'Failed to fetch payment',
      );
    } on DioException catch (e) {
      throw ServerException(message: friendlyDioMessage(e));
    }
  }

  @override
  Future<PaymentModel> processPayment({
    required String bookingId,
    required double amount,
    required String method,
  }) async {
    try {
      final response = await dio.post(
        '/payments',
        data: {
          'bookingId': bookingId,
          'amount': amount,
          'method': method,
        },
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        return PaymentModel.fromJson(response.data['payment']);
      }
      throw ServerException(
        message: response.data['message'] ?? 'Payment failed',
      );
    } on DioException catch (e) {
      throw ServerException(message: friendlyDioMessage(e));
    }
  }

  @override
  Future<void> refundPayment(String paymentId) async {
    try {
      await dio.post('/payments/$paymentId/refund');
    } on DioException catch (e) {
      throw ServerException(message: friendlyDioMessage(e));
    }
  }
}