import 'package:dartz/dartz.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/features/auth/domain/entities/auth_entity.dart';
import 'package:bike_sewa/features/auth/domain/usecases/get_current_usecase.dart';
import 'package:bike_sewa/features/auth/domain/usecases/login_usecase.dart';
import 'package:bike_sewa/features/auth/domain/usecases/logout_usecase.dart';
import 'package:bike_sewa/features/auth/domain/usecases/register_usecase.dart';
import 'package:bike_sewa/features/auth/presentation/providers/auth_provider.dart';
import 'package:bike_sewa/features/auth/presentation/state/auth_state.dart';
import 'package:mocktail/mocktail.dart';

class MockRegisterUsecase extends Mock implements RegisterUsecase {}

class MockLoginUsecase extends Mock implements LoginUsecase {}

class MockGetCurrentUserUsecase extends Mock implements GetCurrentUserUsecase {}

class MockLogoutUsecase extends Mock implements LogoutUsecase {}

void main() {
  late MockRegisterUsecase mockRegisterUsecase;
  late MockLoginUsecase mockLoginUsecase;
  late MockGetCurrentUserUsecase mockGetCurrentUserUsecase;
  late MockLogoutUsecase mockLogoutUsecase;
  late ProviderContainer container;

  setUpAll(() {
    registerFallbackValue(RegisterUsecaseParams(
      fullName: 'test',
      email: 'test@test.com',
      phone: '1234567890',
      username: 'testuser',
      password: 'password',
    ));
    registerFallbackValue(LoginUsecaseParams(email: 'test@test.com', password: 'password'));
  });

  setUp(() {
    mockRegisterUsecase = MockRegisterUsecase();
    mockLoginUsecase = MockLoginUsecase();
    mockGetCurrentUserUsecase = MockGetCurrentUserUsecase();
    mockLogoutUsecase = MockLogoutUsecase();

    container = ProviderContainer(
      overrides: [
        registerUsecaseProvider.overrideWithValue(mockRegisterUsecase),
        loginUsecaseProvider.overrideWithValue(mockLoginUsecase),
        getCurrentUserUsecaseProvider.overrideWithValue(
          mockGetCurrentUserUsecase,
        ),
        logoutUsecaseProvider.overrideWithValue(mockLogoutUsecase),
      ],
    );
  });

  tearDown(() {
    container.dispose();
  });

  const tUser = AuthEntity(
    authId: '1',
    fullName: 'Test User',
    email: 'test@example.com',
    username: 'testuser',
    phone: '1234567890',
    password: 'password123',
  );

  group('AuthViewModel', () {
    group('initial state', () {
      test('should have initial state when created', () {
        final state = container.read(authViewModelProvider);

        expect(state.status, AuthStatus.initial);
        expect(state.authEntity, isNull);
        expect(state.errorMessage, isNull);
      });
    });

    group('register', () {
      test('should emit loading then registered state when successful', () async {
        when(() => mockRegisterUsecase(any())).thenAnswer((_) async => Right<Failure, bool>(true));

        final viewModel = container.read(authViewModelProvider.notifier);

        await viewModel.register(
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '1234567890',
          username: 'testuser',
          password: 'password123',
        );

        final state = container.read(authViewModelProvider);
        expect(state.status, AuthStatus.registered);
        verify(() => mockRegisterUsecase(any())).called(1);
      });

      test('should emit error state when registration fails', () async {
        const failure = ApiFailure(message: 'Email already exists');
        when(() => mockRegisterUsecase(any())).thenAnswer((_) async => Left(failure));

        final viewModel = container.read(authViewModelProvider.notifier);

        await viewModel.register(
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '1234567890',
          username: 'testuser',
          password: 'password123',
        );

        final state = container.read(authViewModelProvider);
        expect(state.status, AuthStatus.error);
        expect(state.errorMessage, 'Email already exists');
        verify(() => mockRegisterUsecase(any())).called(1);
      });

      test('should pass correct params to register usecase', () async {
        RegisterUsecaseParams? capturedParams;
        when(() => mockRegisterUsecase(any())).thenAnswer((invocation) {
          capturedParams = invocation.positionalArguments[0] as RegisterUsecaseParams;
          return Future.value(Right<Failure, bool>(true));
        });

        final viewModel = container.read(authViewModelProvider.notifier);

        await viewModel.register(
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '1234567890',
          username: 'testuser',
          password: 'password123',
        );

        expect(capturedParams?.fullName, 'Test User');
        expect(capturedParams?.email, 'test@example.com');
        expect(capturedParams?.phone, '1234567890');
        expect(capturedParams?.username, 'testuser');
        expect(capturedParams?.password, 'password123');
      });
    });

    group('login', () {
      test('should emit loading then authenticated state when successful', () async {
        when(() => mockLoginUsecase(any())).thenAnswer((_) async => Right(tUser));

        final viewModel = container.read(authViewModelProvider.notifier);

        await viewModel.login(
          email: 'test@example.com',
          password: 'password',
        );

        final state = container.read(authViewModelProvider);
        expect(state.status, AuthStatus.authenticated);
        expect(state.authEntity, tUser);
        verify(() => mockLoginUsecase(any())).called(1);
      });

      test('should emit error state when login fails', () async {
        const failure = ApiFailure(message: 'Invalid credentials');
        when(() => mockLoginUsecase(any())).thenAnswer((_) async => Left(failure));

        final viewModel = container.read(authViewModelProvider.notifier);
        await viewModel.login(email: 'test@example.com', password: 'password');

        final state = container.read(authViewModelProvider);
        expect(state.status, AuthStatus.error);
        expect(state.errorMessage, 'Invalid credentials');
        verify(() => mockLoginUsecase(any())).called(1);
      });

      test('should pass correct credentials to usecase', () async {
        LoginUsecaseParams? capturedParams;
        when(() => mockLoginUsecase(any())).thenAnswer((invocation) {
          capturedParams = invocation.positionalArguments[0] as LoginUsecaseParams;
          return Future.value(Right(tUser));
        });

        final viewModel = container.read(authViewModelProvider.notifier);
        await viewModel.login(
          email: 'user@test.com',
          password: 'mypassword',
        );

        expect(capturedParams?.email, 'user@test.com');
        expect(capturedParams?.password, 'mypassword');
      });
    });

    group('logout', () {
      test('should emit unauthenticated state when logout is successful', () async {
        when(() => mockLogoutUsecase()).thenAnswer((_) async => Right<Failure, bool>(true));

        final viewModel = container.read(authViewModelProvider.notifier);
        await viewModel.logout();

        final state = container.read(authViewModelProvider);
        expect(state.status, AuthStatus.unauthenticated);
        verify(() => mockLogoutUsecase()).called(1);
      });

      test('should emit error state when logout fails', () async {
        const failure = ApiFailure(message: 'Logout failed');
        when(() => mockLogoutUsecase()).thenAnswer((_) async => Left(failure));

        final viewModel = container.read(authViewModelProvider.notifier);
        await viewModel.logout();

        final state = container.read(authViewModelProvider);
        expect(state.status, AuthStatus.error);
        expect(state.errorMessage, 'Logout failed');
        verify(() => mockLogoutUsecase()).called(1);
      });
    });

    group('checkCurrentUser', () {
      test('should emit authenticated state with user when user exists', () async {
        when(() => mockGetCurrentUserUsecase()).thenAnswer((_) async => Right(tUser));

        final viewModel = container.read(authViewModelProvider.notifier);
        await viewModel.checkCurrentUser();

        final state = container.read(authViewModelProvider);
        expect(state.status, AuthStatus.authenticated);
        expect(state.authEntity, tUser);
        verify(() => mockGetCurrentUserUsecase()).called(1);
      });

      test('should emit unauthenticated state when user not found', () async {
        const failure = ApiFailure(message: 'User not found');
        when(() => mockGetCurrentUserUsecase()).thenAnswer((_) async => Left(failure));

        final viewModel = container.read(authViewModelProvider.notifier);
        await viewModel.checkCurrentUser();

        final state = container.read(authViewModelProvider);
        expect(state.status, AuthStatus.unauthenticated);
        verify(() => mockGetCurrentUserUsecase()).called(1);
      });
    });
  });
}
