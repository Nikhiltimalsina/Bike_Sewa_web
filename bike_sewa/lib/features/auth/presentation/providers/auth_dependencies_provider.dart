import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:bike_sewa/core/api/api_client.dart';
import 'package:bike_sewa/core/services/hive/hive_service.dart';
import 'package:bike_sewa/features/auth/data/datasources/local/auth_local_datasource.dart';
import 'package:bike_sewa/features/auth/data/datasources/remote/auth_remote_datasource.dart';
import 'package:bike_sewa/features/auth/data/repositories/auth_repository_impl.dart';
import 'package:bike_sewa/features/auth/domain/repositories/auth_repository.dart';
import 'package:bike_sewa/features/auth/domain/usecases/get_current_usecase.dart';
import 'package:bike_sewa/features/auth/domain/usecases/login_usecase.dart';
import 'package:bike_sewa/features/auth/domain/usecases/logout_usecase.dart';
import 'package:bike_sewa/features/auth/domain/usecases/register_usecase.dart';
import 'package:bike_sewa/features/auth/domain/usecases/update_profile_usecase.dart';
import 'package:bike_sewa/features/auth/domain/usecases/forgot_password_usecase.dart';

final authLocalDatasourceProvider = Provider<AuthLocalDatasource>((ref) {
  return AuthLocalDatasource(hiveService: ref.watch(hiveServiceProvider));
});

final authRepositoryProvider = Provider<IAuthRepository>((ref) {
  return AuthRepositoryImpl(
    remoteDatasource: AuthRemoteDatasource(
      dio: ref.read(dioProvider),
      apiClient: ref.read(apiClientProvider),
    ),
    localDatasource: ref.watch(authLocalDatasourceProvider),
  );
});

final loginUsecaseProvider = Provider<LoginUsecase>((ref) {
  return LoginUsecase(authRepository: ref.watch(authRepositoryProvider));
});

final registerUsecaseProvider = Provider<RegisterUsecase>((ref) {
  return RegisterUsecase(authRepository: ref.watch(authRepositoryProvider));
});

final logoutUsecaseProvider = Provider<LogoutUsecase>((ref) {
  return LogoutUsecase(authRepository: ref.watch(authRepositoryProvider));
});

final getCurrentUserUsecaseProvider = Provider<GetCurrentUserUsecase>((ref) {
  return GetCurrentUserUsecase(
    authRepository: ref.watch(authRepositoryProvider),
  );
});

final updateProfileUsecaseProvider = Provider<UpdateProfileUsecase>((ref) {
  return UpdateProfileUsecase(
    authRepository: ref.watch(authRepositoryProvider),
  );
});

final forgotPasswordUsecaseProvider = Provider<ForgotPasswordUsecase>((ref) {
  return ForgotPasswordUsecase(
    authRepository: ref.watch(authRepositoryProvider),
  );
});

final resetPasswordUsecaseProvider = Provider<ResetPasswordUsecase>((ref) {
  return ResetPasswordUsecase(
    authRepository: ref.watch(authRepositoryProvider),
  );
});
