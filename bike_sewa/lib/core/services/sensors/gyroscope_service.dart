import 'dart:async';
import 'package:sensors_plus/sensors_plus.dart';

class GyroscopeService {
  static const double _shakeThreshold = 1.5;
  static const int _shakeWindowMs = 800;
  static const int _shakeMinCount = 3;

  StreamSubscription<GyroscopeEvent>? _gyroSubscription;
  final List<GyroscopeEvent> _recentEvents = [];
  DateTime? _lastShakeTime;
  final StreamController<void> _shakeController = StreamController<void>.broadcast();

  Stream<void> get shakeStream => _shakeController.stream;

  bool _isListening = false;

  void startListening() {
    if (_isListening) return;
    _isListening = true;
    _recentEvents.clear();
    _lastShakeTime = null;

    _gyroSubscription = gyroscopeEventStream().listen((GyroscopeEvent event) {
      final now = DateTime.now();

      if (_lastShakeTime != null &&
          now.difference(_lastShakeTime!).inMilliseconds > _shakeWindowMs) {
        _recentEvents.clear();
      }

      _recentEvents.add(event);
      _lastShakeTime = now;

      final shakeCount = _recentEvents.where((e) {
        final m = (e.x.abs() + e.y.abs() + e.z.abs()) / 3.0;
        return m > _shakeThreshold;
      }).length;

      if (shakeCount >= _shakeMinCount) {
        _shakeController.add(null);
        _recentEvents.clear();
        _lastShakeTime = null;
      }
    });
  }

  void stopListening() {
    _isListening = false;
    _gyroSubscription?.cancel();
    _gyroSubscription = null;
    _recentEvents.clear();
    _lastShakeTime = null;
  }
}
