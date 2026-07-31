import 'package:hive/hive.dart';
import 'package:uuid/uuid.dart';
import 'package:bike_sewa/core/constants/hive_table_constants.dart';
import 'package:bike_sewa/features/auth/domain/entities/auth_entity.dart';

part 'auth_hive_model.g.dart';

@HiveType(typeId: HiveConstants.authTypeId)
class AuthHiveModel extends HiveObject {
  @HiveField(0)
  final String authId;

  @HiveField(1)
  final String fullName;

  @HiveField(2)
  final String email;

  @HiveField(3)
  final String username;

  @HiveField(4)
  final String password;

  @HiveField(5)
  final String phone;

  @HiveField(6)
  final String? token;

  @HiveField(7)
  final String? avatar;

  AuthHiveModel({
    String? authId,
    required this.fullName,
    required this.email,
    required this.username,
    required this.password,
    required this.phone,
    this.token,
    this.avatar,
  }) : authId = authId ?? const Uuid().v4();

  factory AuthHiveModel.fromEntity(AuthEntity entity) {
    return AuthHiveModel(
      authId: entity.authId,
      fullName: entity.fullName,
      email: entity.email,
      username: entity.username,
      password: entity.password,
      phone: entity.phone,
      token: entity.token,
      avatar: entity.avatar,
    );
  }

  AuthEntity toEntity() {
    return AuthEntity(
      authId: authId,
      fullName: fullName,
      email: email,
      username: username,
      password: password,
      phone: phone,
      token: token,
      avatar: avatar,
    );
  }

  static List<AuthEntity> toEntityList(List<AuthHiveModel> models) {
    return models.map((m) => m.toEntity()).toList();
  }
}
