import 'package:dio/dio.dart';
import 'package:bike_sewa/core/api/api_client.dart';
import 'package:bike_sewa/core/api/api_endpoints.dart';
import 'package:bike_sewa/core/error/dio_error_mapper.dart';
import 'package:bike_sewa/core/error/exceptions.dart';
import 'package:bike_sewa/features/auth/data/models/auth_hive_model.dart';

class AuthRemoteDatasource {
  final Dio _dio;
  final ApiClient _apiClient;

  AuthRemoteDatasource({required Dio dio, required ApiClient apiClient})
    : _dio = dio,
      _apiClient = apiClient;

  /// Quickly checks if the backend server is reachable by sending a lightweight
  /// GET request to the base URL. Throws [ServerException] immediately if the
  /// server is unreachable, avoiding long wait times.
  Future<void> _checkServerAvailability() async {
    try {
      await _dio.get(
        '/',
        options: Options(
          // Short timeout for the health check so the user gets fast feedback
          sendTimeout: const Duration(seconds: 3),
          receiveTimeout: const Duration(seconds: 3),
          // Don't throw on error status — we only care if we can connect at all
          validateStatus: (_) => true,
        ),
      );
    } on DioException catch (_) {
      throw ServerException(
        message:
            'Could not reach the server. Please make sure the backend is running on port 3001 and your device is connected to the same network as your PC.\n\n'
            '• Android emulator → uses 10.0.2.2 automatically\n'
            '• iOS simulator → uses localhost automatically\n'
            '• Physical device → set the LAN IP (e.g., 192.168.x.x) in App settings',
      );
    }
  }

  Future<AuthHiveModel> register({
    required String fullName,
    required String email,
    required String phone,
    required String username,
    required String password,
  }) async {
    try {
      // Check server availability first for fast feedback
      await _checkServerAvailability();

      final response = await _dio.post(
        ApiEndpoints.register,
        data: {
          'fullName': fullName,
          'email': email,
          'phone': phone,
          'username': username,
          'password': password,
        },
      );

      if (response.statusCode == 201) {
        final user = response.data['user'] as Map<String, dynamic>;
        return _userMapToHiveModel(user);
      }

      throw ServerException(
        message: response.data['message'] as String? ?? 'Registration failed',
      );
    } on DioException catch (e) {
      throw ServerException(message: friendlyDioMessage(e));
    }
  }

  Future<AuthHiveModel> login({
    required String email,
    required String password,
  }) async {
    try {
      // Check server availability first for fast feedback
      await _checkServerAvailability();

      final response = await _dio.post(
        ApiEndpoints.login,
        data: {'email': email, 'password': password},
      );

      if (response.statusCode == 200) {
        final token = response.data['token'] as String;
        final user = response.data['user'] as Map<String, dynamic>;

        await _apiClient.saveToken(token);

        return _userMapToHiveModel(user, token: token);
      }

      throw ServerException(
        message: response.data['message'] as String? ?? 'Login failed',
      );
    } on DioException catch (e) {
      throw ServerException(message: friendlyDioMessage(e));
    }
  }

  Future<void> clearToken() async {
    await _apiClient.clearToken();
  }

  Future<AuthHiveModel> getCurrentUser() async {
    try {
      final response = await _dio.get(
        ApiEndpoints.whoami,
      );

      if (response.statusCode == 200) {
        final user = response.data['user'] as Map<String, dynamic>;
        return _userMapToHiveModel(user);
      }

      throw ServerException(
        message: response.data['message'] as String? ?? 'Failed to get user profile',
      );
    } on DioException catch (e) {
      throw ServerException(message: friendlyDioMessage(e));
    }
  }

  Future<AuthHiveModel> updateProfile({
    String? fullName,
    String? phone,
    String? currentPassword,
    String? newPassword,
    bool? twoFactorEnabled,
    String? avatarPath,
  }) async {
    try {
      final formData = FormData();

      if (fullName != null) formData.fields.add(MapEntry('fullName', fullName));
      if (phone != null) formData.fields.add(MapEntry('phone', phone));
      if (currentPassword != null) formData.fields.add(MapEntry('currentPassword', currentPassword));
      if (newPassword != null) formData.fields.add(MapEntry('newPassword', newPassword));
      if (twoFactorEnabled != null) formData.fields.add(MapEntry('twoFactorEnabled', twoFactorEnabled ? 'true' : 'false'));

      if (avatarPath != null && avatarPath.isNotEmpty) {
        final file = await MultipartFile.fromFile(avatarPath);
        formData.files.add(MapEntry('avatar', file));
      }

      final response = await _dio.put(
        ApiEndpoints.updateProfile,
        data: formData,
      );

      if (response.statusCode == 200) {
        final user = response.data['user'] as Map<String, dynamic>;
        return _userMapToHiveModel(user);
      }

      throw ServerException(
        message: response.data['message'] as String? ?? 'Profile update failed',
      );
    } on DioException catch (e) {
      throw ServerException(message: friendlyDioMessage(e));
    }
  }

  Future<String> forgotPassword({required String email}) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.forgotPassword,
        data: {'email': email},
      );

      if (response.statusCode == 200) {
        return response.data['resetToken'] as String? ?? '';
      }

      throw ServerException(
        message: response.data['message'] as String? ?? 'Forgot password failed',
      );
    } on DioException catch (e) {
      throw ServerException(message: friendlyDioMessage(e));
    }
  }

  Future<AuthHiveModel> resetPassword({required String token, required String password}) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.resetPassword,
        data: {'token': token, 'password': password},
      );

      if (response.statusCode == 200) {
        final user = response.data['user'] as Map<String, dynamic>?;
        if (user != null) {
          return _userMapToHiveModel(user);
        }
        return _userMapToHiveModel({});
      }

      throw ServerException(
        message: response.data['message'] as String? ?? 'Reset password failed',
      );
    } on DioException catch (e) {
      throw ServerException(message: friendlyDioMessage(e));
    }
  }

  AuthHiveModel _userMapToHiveModel(
    Map<String, dynamic> user, {
    String? token,
  }) {
    String? avatar = user['avatar'] as String?;
    if (avatar != null && avatar.isNotEmpty && !avatar.startsWith('/')) {
      avatar = '/uploads/avatars/$avatar';
    }

    return AuthHiveModel(
      authId: user['_id'] as String? ?? '',
      fullName: user['fullName'] as String? ?? '',
      email: user['email'] as String? ?? '',
      username: '',
      password: '',
      phone: user['phone'] as String? ?? '',
      token: token,
      avatar: avatar,
    );
  }
}
