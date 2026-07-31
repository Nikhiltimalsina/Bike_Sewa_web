import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  final String message;

  const Failure(this.message);

  @override
  List<Object> get props => [message];
}

class LocalDatabaseFailure extends Failure {
  const LocalDatabaseFailure({
    String message = "Local database operation failure",
  }) : super(message);
}

class ServerFailure extends Failure {
  const ServerFailure({String message = "Server failure"}) : super(message);
}

class DatabaseFailure extends Failure {
  const DatabaseFailure({String message = "Database failure"}) : super(message);
}

class GenericFailure extends Failure {
  const GenericFailure({String message = "Something went wrong"})
    : super(message);
}

class ApiFailure extends Failure {
  final int? statusCode;

  const ApiFailure({this.statusCode, required String message}) : super(message);
}
