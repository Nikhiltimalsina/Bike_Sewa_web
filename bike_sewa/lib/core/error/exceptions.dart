class DatabaseException implements Exception {
  final String message;

  const DatabaseException({this.message = 'Database exception occurred'});

  @override
  String toString() => 'DatabaseException: $message';
}

class ServerException implements Exception {
  final String message;

  const ServerException({this.message = 'Server exception occurred'});

  @override
  String toString() => 'ServerException: $message';
}

class ValidationException implements Exception {
  final String message;

  const ValidationException({this.message = 'Validation error occurred'});

  @override
  String toString() => 'ValidationException: $message';
}
