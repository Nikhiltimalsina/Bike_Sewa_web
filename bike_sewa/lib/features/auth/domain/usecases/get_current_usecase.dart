import 'package:dartz/dartz.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/core/utils/base_usecase.dart';
import 'package:bike_sewa/features/auth/domain/entities/auth_entity.dart';
import 'package:bike_sewa/features/auth/domain/repositories/auth_repository.dart';

class GetCurrentUserUsecase implements UseCaseNoParams<AuthEntity> {
  final IAuthRepository _authRepository;

  GetCurrentUserUsecase({required IAuthRepository authRepository})
    : _authRepository = authRepository;

  @override
  Future<Either<Failure, AuthEntity>> call() {
    return _authRepository.getCurrentUser();
  }
}
