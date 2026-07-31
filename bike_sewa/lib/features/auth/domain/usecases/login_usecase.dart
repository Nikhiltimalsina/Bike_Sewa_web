import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/core/utils/base_usecase.dart';
import 'package:bike_sewa/features/auth/domain/entities/auth_entity.dart';
import 'package:bike_sewa/features/auth/domain/repositories/auth_repository.dart';

class LoginUsecaseParams extends Equatable {
  final String email;
  final String password;

  const LoginUsecaseParams({required this.email, required this.password});

  @override
  List<Object?> get props => [email, password];
}

class LoginUsecase implements UseCase<AuthEntity, LoginUsecaseParams> {
  final IAuthRepository _authRepository;

  LoginUsecase({required IAuthRepository authRepository})
    : _authRepository = authRepository;

  @override
  Future<Either<Failure, AuthEntity>> call(LoginUsecaseParams params) {
    return _authRepository.login(params.email, params.password);
  }
}
