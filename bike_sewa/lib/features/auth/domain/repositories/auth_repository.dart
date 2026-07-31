import 'package:dartz/dartz.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/features/auth/domain/entities/auth_entity.dart';

abstract interface class IAuthRepository {
  Future<Either<Failure, bool>> register(AuthEntity entity);

  Future<Either<Failure, AuthEntity>> login(String email, String password);

  Future<Either<Failure, AuthEntity>> getCurrentUser();

  Future<Either<Failure, AuthEntity>> updateProfile({
    String? fullName,
    String? phone,
    String? currentPassword,
    String? newPassword,
    bool? twoFactorEnabled,
    String? avatarPath,
  });

  Future<Either<Failure, String>> forgotPassword({required String email});

  Future<Either<Failure, AuthEntity>> resetPassword({
    required String token,
    required String password,
  });

  Future<Either<Failure, bool>> logout();
}
