import 'package:dartz/dartz.dart';
import 'package:bike_sewa/core/error/exceptions.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/features/auth/data/datasources/local/auth_local_datasource.dart';
import 'package:bike_sewa/features/auth/data/datasources/remote/auth_remote_datasource.dart';
import 'package:bike_sewa/features/auth/domain/entities/auth_entity.dart';
import 'package:bike_sewa/features/auth/domain/repositories/auth_repository.dart';

class AuthRepositoryImpl implements IAuthRepository {
  final AuthRemoteDatasource _remoteDatasource;
  final AuthLocalDatasource _localDatasource;

  AuthRepositoryImpl({
    required AuthRemoteDatasource remoteDatasource,
    required AuthLocalDatasource localDatasource,
  }) : _remoteDatasource = remoteDatasource,
       _localDatasource = localDatasource;

  @override
  Future<Either<Failure, bool>> register(AuthEntity entity) async {
    try {
      await _remoteDatasource.register(
        fullName: entity.fullName,
        email: entity.email,
        phone: entity.phone,
        username: entity.username,
        password: entity.password,
      );

      return const Right(true);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(GenericFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, AuthEntity>> login(
    String email,
    String password,
  ) async {
    try {
      final model = await _remoteDatasource.login(
        email: email,
        password: password,
      );

      await _localDatasource.saveUser(model);

      return Right(model.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(GenericFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, AuthEntity>> getCurrentUser() async {
    try {
      final user = await _remoteDatasource.getCurrentUser();
      await _localDatasource.saveUser(user);
      return Right(user.toEntity());
    } on ServerException catch (_) {
      try {
        final user = await _localDatasource.getUser();
        if (user != null) {
          return Right(user.toEntity());
        }
        return Left(LocalDatabaseFailure(message: 'No user session found. Please log in.'));
      } catch (e) {
        return Left(GenericFailure(message: e.toString()));
      }
    } catch (e) {
      return Left(GenericFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, AuthEntity>> updateProfile({
    String? fullName,
    String? phone,
    String? currentPassword,
    String? newPassword,
    bool? twoFactorEnabled,
    String? avatarPath,
  }) async {
    try {
      final user = await _remoteDatasource.updateProfile(
        fullName: fullName,
        phone: phone,
        currentPassword: currentPassword,
        newPassword: newPassword,
        twoFactorEnabled: twoFactorEnabled,
        avatarPath: avatarPath,
      );
      await _localDatasource.saveUser(user);
      return Right(user.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(GenericFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, String>> forgotPassword({required String email}) async {
    try {
      final result = await _remoteDatasource.forgotPassword(email: email);
      return Right(result);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(GenericFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, AuthEntity>> resetPassword({
    required String token,
    required String password,
  }) async {
    try {
      final user = await _remoteDatasource.resetPassword(token: token, password: password);
      await _localDatasource.saveUser(user);
      return Right(user.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(GenericFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, bool>> logout() async {
    try {
      await _remoteDatasource.clearToken();
      await _localDatasource.clearUser();
      return const Right(true);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(GenericFailure(message: e.toString()));
    }
  }
}
