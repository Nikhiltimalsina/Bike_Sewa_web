import 'package:dio/dio.dart';
import 'package:dio_smart_retry/dio_smart_retry.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_endpoints.dart';

// ── Providers ────────────────────────────────────────────────

final sharedPreferencesProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError(
    'sharedPreferencesProvider must be overridden in ProviderScope overrides.',
  );
});

final dioProvider = Provider<Dio>((ref) {
  final prefs = ref.read(sharedPreferencesProvider);

  final dio = Dio(
    BaseOptions(
      baseUrl: ApiEndpoints.baseUrl,
      connectTimeout: ApiEndpoints.connectTimeout,
      receiveTimeout: ApiEndpoints.receiveTimeout,
      headers: {'Content-Type': 'application/json'},
    ),
  );

  // Retry failed requests on connection errors (fast retries to avoid long waits)
  dio.interceptors.add(
    RetryInterceptor(
      dio: dio,
      retries: 1,
      retryDelays: const [
        Duration(milliseconds: 300),
      ],
      // Only retry on connection/timeout errors, not on bad responses
      retryEvaluator: (DioException error, int attempt) {
        return error.type == DioExceptionType.connectionTimeout ||
            error.type == DioExceptionType.sendTimeout ||
            error.type == DioExceptionType.receiveTimeout ||
            error.type == DioExceptionType.connectionError;
      },
    ),
  );

  // Log requests and responses when in debug mode
  if (kDebugMode) {
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          debugPrint('→ ${options.method} ${options.uri}');
          return handler.next(options);
        },
        onResponse: (response, handler) {
          debugPrint('← ${response.statusCode} ${response.requestOptions.uri}');
          return handler.next(response);
        },
        onError: (DioException error, handler) {
          debugPrint('✗ ${error.requestOptions.method} ${error.requestOptions.uri} → ${error.type}: ${error.message}');
          return handler.next(error);
        },
      ),
    );
  }

  // Attach JWT token to every request if one is stored
  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) {
        final token = prefs.getString(ApiClient.tokenKey);
        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (DioException error, handler) {
        return handler.next(error);
      },
    ),
  );

  return dio;
});

// ── ApiClient helper ─────────────────────────────────────────

class ApiClient {
  static const String tokenKey = 'auth_token';

  final SharedPreferences _prefs;

  ApiClient(this._prefs);

  // Persist JWT after login
  Future<void> saveToken(String token) async {
    await _prefs.setString(tokenKey, token);
  }

  // Remove JWT on logout
  Future<void> clearToken() async {
    await _prefs.remove(tokenKey);
  }

  String? get token => _prefs.getString(tokenKey);
  bool get isLoggedIn => token != null && token!.isNotEmpty;
}

final apiClientProvider = Provider<ApiClient>((ref) {
  final prefs = ref.read(sharedPreferencesProvider);
  return ApiClient(prefs);
});
