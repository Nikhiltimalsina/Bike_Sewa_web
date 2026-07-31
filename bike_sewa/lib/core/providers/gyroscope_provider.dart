import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/sensors/gyroscope_service.dart';

final gyroscopeServiceProvider = Provider<GyroscopeService>((ref) {
  return GyroscopeService();
});
