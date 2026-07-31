import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:bike_sewa/features/auth/domain/usecases/get_current_usecase.dart';
import 'package:bike_sewa/features/auth/domain/usecases/login_usecase.dart';
import 'package:bike_sewa/features/auth/domain/usecases/logout_usecase.dart';
import 'package:bike_sewa/features/auth/domain/usecases/register_usecase.dart';
import 'package:bike_sewa/features/auth/domain/usecases/update_profile_usecase.dart';
import 'package:bike_sewa/features/auth/domain/usecases/forgot_password_usecase.dart';
import 'package:bike_sewa/features/auth/presentation/providers/auth_dependencies_provider.dart';
import 'package:bike_sewa/features/auth/presentation/state/auth_state.dart';

class AuthViewModel extends Notifier<AuthState> {
  late final RegisterUsecase _registerUsecase;
  late final LoginUsecase _loginUsecase;
  late final LogoutUsecase _logoutUsecase;
  late final GetCurrentUserUsecase _getCurrentUserUsecase;
  late final UpdateProfileUsecase _updateProfileUsecase;
  late final ForgotPasswordUsecase _forgotPasswordUsecase;
  late final ResetPasswordUsecase _resetPasswordUsecase;

  @override
  AuthState build() {
    _registerUsecase = ref.read(registerUsecaseProvider);
    _loginUsecase = ref.read(loginUsecaseProvider);
    _logoutUsecase = ref.read(logoutUsecaseProvider);
    _getCurrentUserUsecase = ref.read(getCurrentUserUsecaseProvider);
    _updateProfileUsecase = ref.read(updateProfileUsecaseProvider);
    _forgotPasswordUsecase = ref.read(forgotPasswordUsecaseProvider);
    _resetPasswordUsecase = ref.read(resetPasswordUsecaseProvider);
    return const AuthState();
  }

  void resetState() {
    state = const AuthState();
  }

  Future<void> register({
    required String fullName,
    required String email,
    required String phone,
    required String username,
    required String password,
  }) async {
    state = state.copyWith(status: AuthStatus.loading, errorMessage: null);

    final params = RegisterUsecaseParams(
      fullName: fullName,
      email: email,
      phone: phone,
      username: username,
      password: password,
    );

    final result = await _registerUsecase(params);

    result.fold(
      (failure) => state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: failure.message,
      ),
      (_) => state = state.copyWith(
        status: AuthStatus.registered,
        errorMessage: null,
      ),
    );
  }

  Future<void> login({required String email, required String password}) async {
    state = state.copyWith(status: AuthStatus.loading, errorMessage: null);

    final params = LoginUsecaseParams(email: email, password: password);
    final result = await _loginUsecase(params);

    result.fold(
      (failure) => state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: failure.message,
      ),
      (authEntity) => state = state.copyWith(
        status: AuthStatus.authenticated,
        authEntity: authEntity,
        errorMessage: null,
      ),
    );
  }

  Future<void> logout() async {
    state = state.copyWith(status: AuthStatus.loading);

    final result = await _logoutUsecase();

    result.fold(
      (failure) => state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: failure.message,
      ),
      (_) => state = state.copyWith(
        status: AuthStatus.unauthenticated,
        authEntity: null,
        errorMessage: null,
      ),
    );
  }

  Future<void> checkCurrentUser() async {
    state = state.copyWith(status: AuthStatus.loading, errorMessage: null);

    try {
      final result = await _getCurrentUserUsecase();

      result.fold(
        (failure) => state = const AuthState(status: AuthStatus.unauthenticated),
        (authEntity) => state = AuthState(
          status: AuthStatus.authenticated,
          authEntity: authEntity,
        ),
      );
    } catch (e) {
      state = const AuthState(status: AuthStatus.unauthenticated);
    }
  }

  Future<void> forgotPassword(String email) async {
    state = state.copyWith(status: AuthStatus.loading, errorMessage: null);

    final params = ForgotPasswordParams(email: email);
    final result = await _forgotPasswordUsecase(params);

    result.fold(
      (failure) => state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: failure.message,
      ),
      (resetToken) => state = state.copyWith(
        status: AuthStatus.registered,
        errorMessage: null,
      ),
    );
  }

  Future<void> resetPassword({required String token, required String password}) async {
    state = state.copyWith(status: AuthStatus.loading, errorMessage: null);

    final params = ResetPasswordParams(token: token, password: password);
    final result = await _resetPasswordUsecase(params);

    result.fold(
      (failure) => state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: failure.message,
      ),
      (authEntity) => state = state.copyWith(
        status: AuthStatus.authenticated,
        authEntity: authEntity,
        errorMessage: null,
      ),
    );
  }

  Future<void> updateProfile({
    String? fullName,
    String? phone,
    String? currentPassword,
    String? newPassword,
    bool? twoFactorEnabled,
    String? avatarPath,
  }) async {
    state = state.copyWith(status: AuthStatus.loading, errorMessage: null);

    final params = UpdateProfileParams(
      fullName: fullName,
      phone: phone,
      currentPassword: currentPassword,
      newPassword: newPassword,
      twoFactorEnabled: twoFactorEnabled,
      avatarPath: avatarPath,
    );

    final result = await _updateProfileUsecase(params);

    result.fold(
      (failure) => state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: failure.message,
      ),
      (authEntity) => state = state.copyWith(
        status: AuthStatus.authenticated,
        authEntity: authEntity,
        errorMessage: null,
      ),
    );
  }
}
