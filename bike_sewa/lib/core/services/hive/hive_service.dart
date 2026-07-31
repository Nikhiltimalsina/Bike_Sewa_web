import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:bike_sewa/core/constants/hive_table_constants.dart';
import 'package:bike_sewa/features/auth/data/models/auth_hive_model.dart';

final hiveServiceProvider = Provider<HiveService>((ref) {
  return HiveService();
});

class HiveService {
  Future<void> init() async {
    await Hive.initFlutter();
    _registerAdapters();
    await openBoxes();
  }

  void _registerAdapters() {
    if (!Hive.isAdapterRegistered(HiveConstants.authTypeId)) {
      Hive.registerAdapter(AuthHiveModelAdapter());
    }
  }

  Future<void> openBoxes() async {
    if (!Hive.isBoxOpen(HiveConstants.authBox)) {
      await Hive.openBox<AuthHiveModel>(HiveConstants.authBox);
    }
  }

  Future<void> close() async {
    await Hive.close();
  }

  Box<AuthHiveModel> get _authBox =>
      Hive.box<AuthHiveModel>(HiveConstants.authBox);

  Future<AuthHiveModel> registerUser(AuthHiveModel model) async {
    final exists = _authBox.values.any((u) => u.email == model.email);
    if (exists) throw Exception('Email already exists');
    await _authBox.put(model.authId, model);
    return model;
  }

  Future<AuthHiveModel?> loginUser(String email, String password) async {
    final users = _authBox.values.where(
      (u) => u.email == email && u.password == password,
    );
    if (users.isNotEmpty) {
      final user = users.first;
      await _authBox.put(HiveConstants.currentUserKey, user);
      return user;
    }
    return null;
  }

  Future<void> saveCurrentUser(AuthHiveModel model) async {
    await _authBox.put(HiveConstants.currentUserKey, model);
  }

  Future<void> logoutUser() async {
    if (_authBox.containsKey(HiveConstants.currentUserKey)) {
      await _authBox.delete(HiveConstants.currentUserKey);
    }
  }

  Future<AuthHiveModel?> getCurrentUser() async {
    if (_authBox.containsKey(HiveConstants.currentUserKey)) {
      return _authBox.get(HiveConstants.currentUserKey);
    }
    return null;
  }
}
