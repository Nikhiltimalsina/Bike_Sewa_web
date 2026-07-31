import 'package:flutter_test/flutter_test.dart';
import 'package:bike_sewa/features/auth/domain/entities/auth_entity.dart';
import 'package:bike_sewa/features/auth/presentation/state/auth_state.dart';

void main() {
  group('AuthState', () {
    test('should have correct initial values', () {
      // Arrange
      const state = AuthState();

      // Assert
      expect(state.status, AuthStatus.initial);
      expect(state.authEntity, isNull);
      expect(state.errorMessage, isNull);
    });

    test('copyWith should update status', () {
      // Arrange
      const state = AuthState();

      // Act
      final newState = state.copyWith(status: AuthStatus.authenticated);

      // Assert
      expect(newState.status, AuthStatus.authenticated);
    });

    test('copyWith should update authEntity', () {
      // Arrange
      const tUser = AuthEntity(
        authId: '1',
        fullName: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        phone: '1234567890',
        password: 'password123',
      );
      const state = AuthState();

      // Act
      final newState = state.copyWith(authEntity: tUser);

      // Assert
      expect(newState.authEntity, tUser);
    });

    test('props should return all fields', () {
      // Arrange
      const tUser = AuthEntity(
        authId: '1',
        fullName: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        phone: '1234567890',
        password: 'password123',
      );
      const state = AuthState(
        status: AuthStatus.authenticated,
        authEntity: tUser,
        errorMessage: 'error',
      );

      // Assert
      expect(state.props, [AuthStatus.authenticated, tUser, 'error']);
    });

    test('two states with same values should be equal', () {
      // Arrange
      const state1 = AuthState(status: AuthStatus.authenticated);
      const state2 = AuthState(status: AuthStatus.authenticated);

      // Assert
      expect(state1, state2);
    });
  });
}