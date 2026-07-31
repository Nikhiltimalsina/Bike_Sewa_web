import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/core/utils/base_usecase.dart';
import 'package:bike_sewa/features/auth/domain/entities/auth_entity.dart';
import 'package:bike_sewa/features/auth/domain/repositories/auth_repository.dart';

class UpdateProfileParams extends Equatable {
  final String? fullName;
  final String? phone;
  final String? currentPassword;
  final String? newPassword;
  final bool? twoFactorEnabled;
  final String? avatarPath;

  const UpdateProfileParams({
    this.fullName,
    this.phone,
    this.currentPassword,
    this.newPassword,
    this.twoFactorEnabled,
    this.avatarPath,
  });

  @override
  List<Object?> get props => [fullName, phone, currentPassword, newPassword, twoFactorEnabled, avatarPath];
}

class UpdateProfileUsecase implements UseCase<AuthEntity, UpdateProfileParams> {
  final IAuthRepository _authRepository;

  UpdateProfileUsecase({required IAuthRepository authRepository})
    : _authRepository = authRepository;

  @override
  Future<Either<Failure, AuthEntity>> call(UpdateProfileParams params) {
    return _authRepository.updateProfile(
      fullName: params.fullName,
      phone: params.phone,
      currentPassword: params.currentPassword,
      newPassword: params.newPassword,
      twoFactorEnabled: params.twoFactorEnabled,
      avatarPath: params.avatarPath,
    );
  }
}
