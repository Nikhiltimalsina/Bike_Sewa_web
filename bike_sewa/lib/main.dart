import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:bike_sewa/app/app.dart';
import 'package:bike_sewa/core/api/api_client.dart';
import 'package:bike_sewa/core/services/hive/hive_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialise Hive local storage
  final hiveService = HiveService();
  await hiveService.init();

  // Initialise SharedPreferences (used to persist JWT token)
  final prefs = await SharedPreferences.getInstance();

  runApp(
    ProviderScope(
      overrides: [
        // Inject the real SharedPreferences instance
        sharedPreferencesProvider.overrideWithValue(prefs),
        // Inject the initialized HiveService instance
        hiveServiceProvider.overrideWithValue(hiveService),
      ],
      child: const BikeRentalApp(),
    ),
  );
}
