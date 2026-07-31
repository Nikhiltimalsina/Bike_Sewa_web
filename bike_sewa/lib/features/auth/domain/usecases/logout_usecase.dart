import 'package:dartz/dartz.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/core/utils/base_usecase.dart';
import 'package:bike_sewa/features/auth/domain/repositories/auth_repository.dart';

class LogoutUsecase implements UseCaseNoParams<bool> {
  final IAuthRepository _authRepository;

  LogoutUsecase({required IAuthRepository authRepository})
    : _authRepository = authRepository;

  @override
  Future<Either<Failure, bool>> call() {
    return _authRepository.logout();
  }
}
