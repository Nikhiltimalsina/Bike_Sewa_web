import 'package:dio/dio.dart';

/// Converts a [DioException] into a short, human-readable message instead
/// of Dio's verbose default `.message` (which dumps a full explanatory
/// paragraph for any non-2xx response).
String friendlyDioMessage(DioException e) {
  final statusCode = e.response?.statusCode;

  // Try to surface a server-provided message first, e.g. {"message": "..."}
  final data = e.response?.data;
  if (data is Map && data['message'] is String) {
    return data['message'] as String;
  }

return switch (e.type) {
    DioExceptionType.connectionTimeout ||
    DioExceptionType.sendTimeout ||
    DioExceptionType.receiveTimeout =>
      'The server is taking too long to respond. This usually means:\n'
      '• The backend server is not running on port 3001\n'
      '• Your device is on a different network than your PC\n'
      '• For physical devices, you need to set your PC\'s LAN IP (e.g., 192.168.x.x)',
    DioExceptionType.connectionError =>
      "Couldn't connect to the server. Please check:\n"
      "• The backend is running on port 3001\n"
      "• Android emulator → uses 10.0.2.2 automatically\n"
      "• iOS simulator → uses localhost automatically\n"
      "• Physical device → set your PC's LAN IP (e.g., 192.168.x.x)\n"
      "• On Windows, check that port 3001 is allowed through Windows Defender Firewall",
    DioExceptionType.badResponse => switch (statusCode) {
      404 => 'This isn\'t available right now (404). The server route may not be set up yet.',
      401 || 403 => 'You\'re not authorized to do that. Try logging in again.',
      int s when s >= 500 => 'Something went wrong on the server. Please try again shortly.',
      _ => 'Request failed with status $statusCode.',
    },
    DioExceptionType.cancel => 'Request was cancelled.',
    _ => 'Something went wrong. Please try again.',
  };
}