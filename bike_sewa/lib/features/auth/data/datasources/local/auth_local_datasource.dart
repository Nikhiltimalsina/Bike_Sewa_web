import 'package:bike_sewa/core/services/hive/hive_service.dart';
import 'package:bike_sewa/features/auth/data/models/auth_hive_model.dart';

class AuthLocalDatasource {
  final HiveService _hiveService;

  AuthLocalDatasource({required HiveService hiveService})
    : _hiveService = hiveService;

  Future<bool> register(AuthHiveModel model) async {
    await _hiveService.registerUser(model);
    return true;
  }

  Future<AuthHiveModel?> login(String email, String password) async {
    return _hiveService.loginUser(email, password);
  }

  Future<AuthHiveModel?> getCurrentUser() async {
    return _hiveService.getCurrentUser();
  }

  Future<bool> logout() async {
    await _hiveService.logoutUser();
    return true;
  }

  Future<void> saveUser(AuthHiveModel model) async {
    await _hiveService.saveCurrentUser(model);
  }

  Future<AuthHiveModel?> getUser() {
    return _hiveService.getCurrentUser();
  }

  Future<void> clearUser() {
    return _hiveService.logoutUser();
  }
}
