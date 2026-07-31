import 'package:dio/dio.dart';

/// Network helper for common network operations
class NetworkHelper {
  NetworkHelper._();

  /// Check if response is successful
  static bool isSuccessful(int? statusCode) {
    return statusCode != null && statusCode >= 200 && statusCode < 300;
  }

  /// Parse error from Dio exception
  static String parseError(DioException exception) {
    switch (exception.type) {
      case DioExceptionType.badResponse:
        return exception.response?.data['message'] ?? 'Server error';
      case DioExceptionType.connectionTimeout:
        return 'Connection timeout';
      case DioExceptionType.receiveTimeout:
        return 'Receive timeout';
      case DioExceptionType.sendTimeout:
        return 'Send timeout';
      case DioExceptionType.unknown:
        return exception.message ?? 'Unknown error';
      default:
        return 'Network error occurred';
    }
  }

  /// Retry logic helper
  static Future<T> retryRequest<T>(
    Future<T> Function() request, {
    int maxRetries = 3,
    Duration delay = const Duration(seconds: 1),
  }) async {
    int attempt = 0;

    while (true) {
      try {
        return await request();
      } catch (e) {
        attempt++;
        if (attempt >= maxRetries) {
          rethrow;
        }
        await Future.delayed(delay * attempt);
      }
    }
  }
}
