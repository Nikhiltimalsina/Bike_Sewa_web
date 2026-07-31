import 'package:dartz/dartz.dart';
import '../error/failures.dart';

/// Base UseCase with single parameter
abstract class UseCase<SuccessType, Params> {
  Future<Either<Failure, SuccessType>> call(Params params);
}

/// Base UseCase with no parameters
abstract class UseCaseNoParams<SuccessType> {
  Future<Either<Failure, SuccessType>> call();
}

/// Base UseCase with single String parameter
abstract class UseCaseWithString<SuccessType> {
  Future<Either<Failure, SuccessType>> call(String param);
}

/// Base UseCase with two parameters
abstract class UseCaseWithTwoParams<SuccessType, Param1, Param2> {
  Future<Either<Failure, SuccessType>> call(Param1 param1, Param2 param2);
}
