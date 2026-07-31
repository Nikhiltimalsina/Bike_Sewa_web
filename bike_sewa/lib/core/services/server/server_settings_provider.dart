import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:bike_sewa/core/api/api_client.dart';
import 'package:bike_sewa/core/api/api_endpoints.dart';

/// Persists the custom LAN IP address in SharedPreferences and applies it
/// to [ApiEndpoints.customPhysicalDeviceIp] so the whole app uses it.
class ServerSettingsNotifier extends StateNotifier<String> {
  final SharedPreferences _prefs;

  static const String _key = 'custom_lan_ip';

  ServerSettingsNotifier(this._prefs) : super('') {
    _loadSavedIp();
  }

  /// Load the previously saved IP from disk and apply it globally.
  Future<void> _loadSavedIp() async {
    final saved = _prefs.getString(_key) ?? '';
    if (saved.isNotEmpty) {
      state = saved;
      ApiEndpoints.customPhysicalDeviceIp = saved;
    }
  }

  /// Save a new LAN IP address and apply it globally.
  Future<void> setIp(String ip) async {
    final trimmed = ip.trim();
    state = trimmed;
    ApiEndpoints.customPhysicalDeviceIp = trimmed.isEmpty ? null : trimmed;
    await _prefs.setString(_key, trimmed);
  }

  /// Remove the custom IP and fall back to auto-detected values.
  Future<void> clearIp() async {
    state = '';
    ApiEndpoints.customPhysicalDeviceIp = null;
    await _prefs.remove(_key);
  }
}

final serverSettingsProvider =
    StateNotifierProvider<ServerSettingsNotifier, String>((ref) {
  final prefs = ref.read(sharedPreferencesProvider);
  return ServerSettingsNotifier(prefs);
});
