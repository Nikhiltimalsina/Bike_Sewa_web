import 'package:flutter/material.dart';

/// String extensions
extension StringExtension on String {
  /// Capitalize the first character
  String capitalize() {
    if (isEmpty) return this;
    return this[0].toUpperCase() + substring(1);
  }

  /// Capitalize the first character of each word
  String capitalizeFirstLetter() {
    if (isEmpty) return this;
    return split(' ').map((word) => word.capitalize()).join(' ');
  }

  /// Check if string is a valid email
  bool isValidEmail() {
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    return emailRegex.hasMatch(this);
  }

  /// Check if string is empty or whitespace
  bool isNullOrEmpty() {
    return isEmpty || trim().isEmpty;
  }

  /// Check if string is a valid phone number
  bool isValidPhoneNumber() {
    final phoneRegex = RegExp(r'^[0-9]{10,}$');
    return phoneRegex.hasMatch(replaceAll(RegExp(r'\D'), ''));
  }
}

/// BuildContext extensions
extension BuildContextExtension on BuildContext {
  /// Get device size
  Size get screenSize => MediaQuery.of(this).size;

  /// Get device width
  double get screenWidth => MediaQuery.of(this).size.width;

  /// Get device height
  double get screenHeight => MediaQuery.of(this).size.height;

  /// Check if device is in landscape
  bool get isLandscape =>
      MediaQuery.of(this).orientation == Orientation.landscape;

  /// Check if device is in portrait
  bool get isPortrait =>
      MediaQuery.of(this).orientation == Orientation.portrait;

  /// Get device padding
  EdgeInsets get devicePadding => MediaQuery.of(this).padding;

  /// Show snackbar
  void showSnackBar(
    String message, {
    Duration duration = const Duration(seconds: 2),
  }) {
    ScaffoldMessenger.of(
      this,
    ).showSnackBar(SnackBar(content: Text(message), duration: duration));
  }

  /// Show error snackbar
  void showErrorSnackBar(
    String message, {
    Duration duration = const Duration(seconds: 2),
  }) {
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        duration: duration,
      ),
    );
  }

  /// Show success snackbar
  void showSuccessSnackBar(
    String message, {
    Duration duration = const Duration(seconds: 2),
  }) {
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
        duration: duration,
      ),
    );
  }
}

/// DateTime extensions
extension DateTimeExtension on DateTime {
  /// Check if date is today
  bool get isToday {
    final now = DateTime.now();
    return year == now.year && month == now.month && day == now.day;
  }

  /// Check if date is yesterday
  bool get isYesterday {
    final yesterday = DateTime.now().subtract(const Duration(days: 1));
    return year == yesterday.year &&
        month == yesterday.month &&
        day == yesterday.day;
  }

  /// Get formatted date string
  String toFormattedString({String format = 'dd/MM/yyyy'}) {
    // Simple formatting - use intl package for more complex formatting
    return toString().split(' ')[0];
  }
}

/// Num extensions
extension NumExtension on num {
  /// Add commas to number
  String toFormattedString() {
    return toString().replaceAllMapped(
      RegExp(r'\B(?=(\d{3})+(?!\d))'),
      (match) => ',',
    );
  }

  /// Convert to currency format
  String toCurrency({String prefix = 'Rs. '}) {
    return '$prefix${toFormattedString()}';
  }
}

/// List extensions
extension ListExtension<T> on List<T> {
  /// Get item or null if index out of range
  T? getOrNull(int index) {
    if (index >= 0 && index < length) {
      return this[index];
    }
    return null;
  }

  /// Check if list is empty or null
  bool get isNullOrEmpty {
    return isEmpty;
  }
}
