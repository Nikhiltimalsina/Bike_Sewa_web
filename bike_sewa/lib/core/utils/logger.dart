import 'package:flutter/foundation.dart';

/// Utility class for logging
class AppLogger {
  static const String _tag = 'BikeSewa';

  AppLogger._();

  static void info(String message) {
    debugPrint('[$_tag] INFO: $message');
  }

  static void debug(String message) {
    debugPrint('[$_tag] DEBUG: $message');
  }

  static void warning(String message) {
    debugPrint('[$_tag] WARNING: $message');
  }

  static void error(String message, [dynamic error, StackTrace? stackTrace]) {
    debugPrint('[$_tag] ERROR: $message');
    if (error != null) debugPrint('Error: $error');
    if (stackTrace != null) debugPrint('StackTrace: $stackTrace');
  }
}
