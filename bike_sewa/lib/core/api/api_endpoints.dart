import 'dart:io' show Platform;

import 'package:flutter/foundation.dart';

class ApiEndpoints {
  ApiEndpoints._();

  /// Custom LAN IP override for physical devices.
  /// Set this to your PC's LAN IP (e.g., '192.168.1.100') when testing on
  /// physical devices. If null, the base URL is auto-detected based on the
  /// current platform.
  static String? customPhysicalDeviceIp = '192.168.1.67';

  /// Base URL — automatically selected based on platform.
  ///
  /// | Platform            | URL                          |
  /// |---------------------|------------------------------|
  /// | Web                 | http://localhost:3001        |
  /// | Android emulator    | http://10.0.2.2:3001         |
  /// | iOS simulator       | http://localhost:3001         |
  /// | Physical device     | customPhysicalDeviceIp:3001  |
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:3001';
    }

    // If a custom IP is set, use it (for physical devices)
    if (customPhysicalDeviceIp != null && customPhysicalDeviceIp!.isNotEmpty) {
      return 'http://$customPhysicalDeviceIp:3001';
    }

    // Android check — works for both emulator and physical devices
    if (Platform.isAndroid) {
      // On Android emulator, 10.0.2.2 maps to the host machine's localhost.
      // On physical Android devices, the user must set [customPhysicalDeviceIp].
      // We default to 10.0.2.2 for emulator; if it fails, the user can set the IP.
      return 'http://10.0.2.2:3001';
    }

    // iOS simulator runs on the host machine, so localhost works.
    if (Platform.isIOS) {
      return 'http://localhost:3001';
    }

    // Fallback for other platforms (e.g., macOS, Windows, Linux desktop)
    return 'http://localhost:3001';
  }

  /// Timeout values used by ApiClient when configuring Dio.
  static const Duration connectTimeout = Duration(seconds: 10);
  static const Duration receiveTimeout = Duration(seconds: 10);

  // Auth
  // NOTE: keep BOTH names below if other files still reference the old
  // authLogin/authRegister — or rename the call sites in
  // auth_remote_datasource.dart to match if you'd rather standardize on
  // the shorter names.
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String authLogin = '/auth/login';
  static const String authRegister = '/auth/register';
  static const String whoami = '/auth/whoami';
  static const String updateProfile = '/auth/update';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';

  // Bikes / Dashboard
  static const String bikes = '/bikes';
  static const String bikeSearch = '/bikes/search';
  static const String bikesByLocation = '/bikes/location';

  // Bookings
  static const String bookings = '/bookings';
  static const String myBookings = '/bookings/me';

  // Payments
  static const String payments = '/payments';

  // Items
  static const String items = '/items';
  static const String itemUpload = '/items/upload';

  // Admin
  static const String adminBike = '/admin/bikes';
  static const String adminBooking = '/admin/bookings';
  static const String adminUser = '/admin/users';
  static const String adminRevenue = '/admin/stats/revenue';
}