import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/core/utils/base_usecase.dart';
import 'package:bike_sewa/features/auth/domain/entities/auth_entity.dart';
import 'package:bike_sewa/features/auth/domain/repositories/auth_repository.dart';

class ForgotPasswordParams extends Equatable {
  final String email;

  const ForgotPasswordParams({required this.email});

  @override
  List<Object?> get props => [email];
}

class ForgotPasswordUsecase implements UseCase<String, ForgotPasswordParams> {
  final IAuthRepository _authRepository;

  ForgotPasswordUsecase({required IAuthRepository authRepository})
    : _authRepository = authRepository;

  @override
  Future<Either<Failure, String>> call(ForgotPasswordParams params) {
    return _authRepository.forgotPassword(email: params.email);
  }
}

class ResetPasswordParams extends Equatable {
  final String token;
  final String password;

  const ResetPasswordParams({required this.token, required this.password});

  @override
  List<Object?> get props => [token, password];
}

class ResetPasswordUsecase implements UseCase<AuthEntity, ResetPasswordParams> {
  final IAuthRepository _authRepository;

  ResetPasswordUsecase({required IAuthRepository authRepository})
    : _authRepository = authRepository;

  @override
  Future<Either<Failure, AuthEntity>> call(ResetPasswordParams params) {
    return _authRepository.resetPassword(token: params.token, password: params.password);
  }
}
