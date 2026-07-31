# Sensor Implementation Plan — Bike Sewa

## App Analysis Summary

**Bike Sewa** is a bike rental Flutter app (dark theme, cyan accent) for Kathmandu.
- **Architecture**: Clean architecture (data / domain / presentation) with Riverpod `Notifier` pattern
- **State Management**: `flutter_riverpod` 2.x with `NotifierProvider`
- **Storage**: Hive (local), FlutterSecureStorage (tokens), SharedPreferences (session)
- **Networking**: Dio with smart retry interceptor
- **Existing Auth Flow**: Splash → Onboarding → Login/Register → Dashboard (tabbed: Home / Explore / Activity / Profile)
- **Existing Services**: `core/services/hive/`, `core/services/connectivity/`, `core/services/media/`, `core/services/sync/`
- **Permissions**: `permission_handler` already in dependencies; Android manifest and iOS Info.plist exist

---

## Three Sensors to Add

### 1. Biometric Authentication (Face Lock + Fingerprint)

**Purpose**: Allow users to log in / unlock the app using fingerprint or face recognition instead of (or alongside) password entry.

**Flutter Package**: `local_auth` ^2.1.8

#### Implementation

**A. Dependencies (`pubspec.yaml`)**
```yaml
dependencies:
  local_auth: ^2.1.8
```

**B. Platform Configuration**

*Android* (`android/app/src/main/AndroidManifest.xml`):
Add inside `<manifest>`:
```xml
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
```

*iOS* (`ios/Runner/Info.plist`):
Add before `</dict>`:
```xml
<key>NSFaceIDUsageDescription</key>
<string>This app uses Face ID to securely authenticate you</string>
```

**C. Service Layer**

Create file: `lib/core/services/sensors/biometric_service.dart`

```dart
import 'package:local_auth/local_auth.dart';

class BiometricService {
  final LocalAuthentication _auth = LocalAuthentication();

  Future<bool> get isBiometricSupported async {
    try {
      return await _auth.canCheckBiometrics;
    } catch (_) {
      return false;
    }
  }

  Future<List<BiometricType>> get availableBiometrics async {
    try {
      return await _auth.getAvailableBiometrics();
    } catch (_) {
      return [];
    }
  }

  Future<bool> authenticate({
    required String localizedReason,
  }) async {
    try {
      return await _auth.authenticate(
        localizedReason: localizedReason,
        options: const AuthenticationOptions(
          biometricOnly: false,
          stickyAuth: true,
        ),
      );
    } catch (_) {
      return false;
    }
  }
}
```

**D. Riverpod Provider**

Create file: `lib/core/services/sensors/biometric_provider.dart`

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'biometric_service.dart';

final biometricServiceProvider = Provider<BiometricService>((ref) {
  return BiometricService();
});

enum BiometricAuthStatus { idle, authenticating, authenticated, error, disabled }

class BiometricAuthState extends Equatable {
  final BiometricAuthStatus status;
  final bool isBiometricAvailable;
  final String? error;

  const BiometricAuthState({
    this.status = BiometricAuthStatus.idle,
    this.isBiometricAvailable = false,
    this.error,
  });

  BiometricAuthState copyWith({
    BiometricAuthStatus? status,
    bool? isBiometricAvailable,
    String? error,
  }) {
    return BiometricAuthState(
      status: status ?? this.status,
      isBiometricAvailable: isBiometricAvailable ?? this.isBiometricAvailable,
      error: error ?? this.error,
    );
  }

  @override
  List<Object?> get props => [status, isBiometricAvailable, error];
}

class BiometricAuthNotifier extends Notifier<BiometricAuthState> {
  late BiometricService _biometricService;

  @override
  BiometricAuthState build() {
    _biometricService = ref.read(biometricServiceProvider);
    _checkAvailability();
    return const BiometricAuthState();
  }

  Future<void> _checkAvailability() async {
    final supported = await _biometricService.isBiometricSupported;
    if (!supported) {
      state = const BiometricAuthState(
        status: BiometricAuthStatus.disabled,
        isBiometricAvailable = false,
      );
      return;
    }
    final biometrics = await _biometricService.availableBiometrics;
    state = BiometricAuthState(
      status: BiometricAuthStatus.idle,
      isBiometricAvailable = biometrics.isNotEmpty,
    );
  }

  Future<bool> authenticate() async {
    state = state.copyWith(
      status: BiometricAuthStatus.authenticating,
      error: null,
    );
    final result = await _biometricService.authenticate(
      localizedReason: 'Authenticate to access Bike Sewa',
    );
    if (result) {
      state = state.copyWith(
        status: BiometricAuthStatus.authenticated,
        error: null,
      );
    } else {
      state = state.copyWith(
        status: BiometricAuthStatus.error,
        error: 'Authentication failed',
      );
    }
    return result;
  }

  void reset() {
    state = const BiometricAuthState(
      status: BiometricAuthStatus.idle,
      isBiometricAvailable: state.isBiometricAvailable,
    );
  }
}

final biometricAuthProvider =
    NotifierProvider<BiometricAuthNotifier, BiometricAuthState>(
  BiometricAuthNotifier.new,
);
```

**E. Integration Points**

1. **Splash Screen** (`splash_screen_view.dart`): After `checkCurrentUser()` succeeds and user is authenticated, check if biometrics are enabled in settings. If so, trigger biometric prompt before navigating to dashboard. If user fails biometric auth, fall back to regular dashboard access or re-prompt for password.

2. **Login View** (`login_view.dart`): Add a biometric button alongside the login form. If biometrics are available, show a fingerprint/face icon button. Tapping it triggers `biometricAuthProvider.authenticate()`. On success, skip password login and mark user as authenticated.

3. **Profile / Settings** (`profile_view.dart`): Add a "Biometric Lock" toggle section. Store the preference in SharedPreferences or Hive (`biometrics_enabled`). This flag controls whether biometric auth is required at splash.

4. **Auth State Persistence**: Store a `biometricEnabled` flag in SharedPreferences/Hive. On subsequent app launches, if the flag is set and biometric auth succeeds, auto-proceed to dashboard after splash.

**F. File Structure**
```
lib/core/services/sensors/
  biometric_service.dart
  biometric_provider.dart
  tilt_navigation_service.dart   (see below)
  tilt_navigation_provider.dart  (see below)
```

---

### 2. Tilt Navigation

**Purpose**: Use the device accelerometer/gyroscope to navigate between dashboard tabs by tilting the phone left/right, and possibly tilt forward/back for other actions (e.g., scroll, confirm).

**Flutter Package**: `sensors_plus` ^2.0.0

#### Implementation

**A. Dependencies (`pubspec.yaml`)**
```yaml
dependencies:
  sensors_plus: ^2.0.0
```

**B. Service Layer**

Create file: `lib/core/services/sensors/tilt_navigation_service.dart`

```dart
import 'dart:async';
import 'package:sensors_plus/sensors_plus.dart';

class TiltNavigationService {
  static const double _leftThreshold = -0.6;
  static const double _rightThreshold = 0.6;
  static const double _forwardThreshold = 0.6;
  static const double _backwardThreshold = -0.6;
  static const Duration _debounce = Duration(milliseconds: 500);

  StreamSubscription<AccelerometerEvent>? _accelSubscription;
  StreamSubscription<GyroscopeEvent>? _gyroSubscription;

  final StreamController<TiltDirection> _tiltController =
      StreamController<TiltDirection>.broadcast();

  Stream<TiltDirection> get tiltStream => _tiltController.stream;

  bool _isEnabled = false;
  bool _isCalibrated = false;
  double _baseX = 0.0;
  double _baseY = 0.0;
  double _baseZ = 0.0;
  DateTime? _lastTiltTime;

  bool get isEnabled => _isEnabled;
  bool get isCalibrated => _isCalibrated;

  void start() {
    if (_isEnabled) return;
    _isEnabled = true;
    _isCalibrated = false;

    _accelSubscription = accelerometerEvents.listen((event) {
      if (!_isCalibrated) {
        _baseX = event.x;
        _baseY = event.y;
        _baseZ = event.z;
        _isCalibrated = true;
        return;
      }

      final now = DateTime.now();
      if (_lastTiltTime != null &&
          now.difference(_lastTiltTime!).inMilliseconds <
              _debounce.inMilliseconds) {
        return;
      }

      final deltaX = event.x - _baseX;
      final deltaY = event.y - _baseY;

      _lastTiltTime = now;

      if (deltaX < _leftThreshold) {
        _tiltController.add(TiltDirection.left);
      } else if (deltaX > _rightThreshold) {
        _tiltController.add(TiltDirection.right);
      } else if (deltaY > _forwardThreshold) {
        _tiltController.add(TiltDirection.forward);
      } else if (deltaY < _backwardThreshold) {
        _tiltController.add(TiltDirection.backward);
      }
    });
  }

  void stop() {
    _isEnabled = false;
    _isCalibrated = false;
    _accelSubscription?.cancel();
    _gyroSubscription?.cancel();
  }

  void resetCalibration() {
    _isCalibrated = false;
  }

  void dispose() {
    stop();
    _tiltController.close();
  }
}

enum TiltDirection { left, right, forward, backward, none }
```

**C. Riverpod Provider**

Create file: `lib/core/services/sensors/tilt_navigation_provider.dart`

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'tilt_navigation_service.dart';

final tiltNavigationServiceProvider =
    Provider<TiltNavigationService>((ref) {
  return TiltNavigationService();
});

enum TiltNavStatus { idle, active, paused }

class TiltNavState extends Equatable {
  final TiltNavStatus status;
  final TiltDirection? lastTilt;
  final bool isCalibrated;

  const TiltNavState({
    this.status = TiltNavStatus.idle,
    this.lastTilt,
    this.isCalibrated = false,
  });

  TiltNavState copyWith({
    TiltNavStatus? status,
    TiltDirection? lastTilt,
    bool? isCalibrated,
  }) {
    return TiltNavState(
      status: status ?? this.status,
      lastTilt: lastTilt ?? this.lastTilt,
      isCalibrated: isCalibrated ?? this.isCalibrated,
    );
  }

  @override
  List<Object?> get props => [status, lastTilt, isCalibrated];
}

class TiltNavNotifier extends Notifier<TiltNavState> {
  late TiltNavigationService _tiltService;
  StreamSubscription<TiltDirection>? _tiltSub;

  @override
  TiltNavState build() {
    _tiltService = ref.read(tiltNavigationServiceProvider);
    return const TiltNavState();
  }

  void enable() {
    _tiltService.start();
    _tiltSub = _tiltService.tiltStream.listen((direction) {
      state = state.copyWith(
        lastTilt: direction,
        isCalibrated = _tiltService.isCalibrated,
      );
      if (direction != TiltDirection.none) {
        _tiltService.resetCalibration();
      }
    });
    state = state.copyWith(status: TiltNavStatus.active);
  }

  void disable() {
    _tiltSub?.cancel();
    _tiltService.stop();
    state = const TiltNavState(status: TiltNavStatus.idle);
  }

  void calibrate() {
    _tiltService.resetCalibration();
    state = state.copyWith(isCalibrated = false);
  }

  @override
  void close() {
    _tiltSub?.cancel();
    _tiltService.dispose();
    super.close();
  }
}

final tiltNavProvider =
    NotifierProvider<TiltNavNotifier, TiltNavState>(TiltNavNotifier.new);
```

**D. Integration Points**

1. **DashboardView** — The primary integration point. Wrap the tab navigation to respond to tilt events:
   - `TiltDirection.left` → move to previous tab
   - `TiltDirection.right` → move to next tab
   - `TiltDirection.forward` → optional: confirm / select action (e.g., simulate Fab tap)
   - `TiltDirection.backward` → optional: go back

2. **Settings Toggle** — In `ProfileView`, add a "Tilt Navigation" toggle (stored in SharedPreferences). When enabled, the `TiltNavNotifier.enable()` is called; when disabled, `disable()` is called.

3. **Visual Feedback** — Show a subtle indicator in the dashboard header when tilt navigation is active (e.g., a small tilt icon with a pulsing dot).

**E. File Structure Addition**
```
lib/core/services/sensors/
  biometric_service.dart
  biometric_provider.dart
  tilt_navigation_service.dart
  tilt_navigation_provider.dart
```

---

## Complete File Structure After Implementation

```
lib/
├── app/
│   ├── app.dart              (modified — biometric prompt at splash)
│   └── routes/
│       └── app_routes.dart
├── core/
│   ├── services/
│   │   ├── sensors/
│   │   │   ├── biometric_service.dart       (NEW)
│   │   │   ├── biometric_provider.dart      (NEW)
│   │   │   ├── tilt_navigation_service.dart (NEW)
│   │   │   └── tilt_navigation_provider.dart (NEW)
│   │   ├── hive/
│   │   ├── connectivity/
│   │   ├── media/
│   │   └── sync/
│   ├── providers/
│   │   └── root_providers.dart              (NEW — register sensor providers)
│   ├── constants/
│   ├── error/
│   ├── theme/
│   ├── utils/
│   └── api/
├── features/
│   ├── auth/
│   │   ├── presentation/
│   │   │   ├── pages/
│   │   │   │   └── login_view.dart          (modified — biometric button)
│   │   │   └── view_model/
│   │   ├── presentation/state/
│   │   │   └── auth_state.dart              (modified — add biometric flag)
│   │   └── presentation/providers/
│   │       └── auth_provider.dart           (modified — add biometric provider)
│   ├── dashboard/
│   │   ├── presentation/
│   │   │   ├── pages/
│   │   │   │   └── dashboard_view.dart      (modified — tilt nav integration)
│   │   │   └── providers/
│   │   └── ...
│   ├── profile/  (or in dashboard/presentation/pages/profile_view.dart)
│   │   └── ...                              (modified — tilt + biometric toggles)
│   └── splash/
│       └── presentation/
│           └── pages/
│               └── splash_screen_view.dart  (modified — biometric auth gate)
└── main.dart                                 (modified — register sensor providers)
```

---

## Dependencies to Add to `pubspec.yaml`

```yaml
dependencies:
  local_auth: ^2.1.8
  sensors_plus: ^2.0.0
```

---

## Integration Sequence

| Step | Task | Files Changed |
|------|------|---------------|
| 1 | Add `local_auth` + `sensors_plus` to `pubspec.yaml` | `pubspec.yaml` |
| 2 | Create `core/services/sensors/` directory with 4 new files | 4 new files |
| 3 | Update `AndroidManifest.xml` with biometric permissions | `android/app/src/main/AndroidManifest.xml` |
| 4 | Update `iOS/Runner/Info.plist` with Face ID usage description | `ios/Runner/Info.plist` |
| 5 | Register biometric + tilt providers in `main.dart` and via `ProviderScope` | `lib/main.dart` |
| 6 | Integrate biometric auth into splash screen (gate before dashboard) | `splash_screen_view.dart` |
| 7 | Add biometric button to login screen | `login_view.dart` |
| 8 | Add biometric toggle + tilt nav toggle in profile/settings | `profile_view.dart` |
| 9 | Integrate tilt navigation into `DashboardView` | `dashboard_view.dart` |
| 10 | Write tests for sensor services and providers | `test/core/services/sensors/` (new) |

---

## Key Design Decisions

1. **Biometric vs Password**: Biometric is an *alternative* login method, not a replacement. Password login remains available at all times.

2. **Tilt Navigation is Opt-In**: Tilt navigation is disabled by default and must be explicitly enabled in settings. This prevents accidental navigation and respects accessibility.

3. **Sensor Services as Singletons**: Both `BiometricService` and `TiltNavigationService` are provided as single-instance providers via Riverpod, ensuring consistent state and preventing resource leaks.

4. **Debouncing Tilt Events**: A 500ms debounce on tilt detection prevents accidental rapid tab-switching from a single phone movement.

5. **Gyroscope vs Accelerometer**: Tilt navigation uses `accelerometerEvents` from `sensors_plus` because it directly provides gravity-attitude data (x/y/z axes), which maps naturally to left/right/forward/back tilt gestures. The gyroscope is available as a backup for finer control if needed.

6. **Platform-Specific Behavior**: `local_auth` abstracts away platform differences — on Android it uses BiometricPrompt, on iOS it uses Face ID / Touch ID. The same `authenticate()` call works on both platforms.

---

## Security Considerations

- Biometric auth state (`BiometricAuthState`) is held in memory only; no biometric data is stored.
- The `biometricEnabled` preference is stored as a boolean flag only — it controls whether the prompt appears, not the biometric template itself.
- On iOS, Face ID usage description must be provided in `Info.plist` or the app will crash at runtime.
- On Android, `USE_BIOMETRIC` and `USE_FINGERPRINT` permissions are runtime permissions on older Android versions; `local_auth` handles this internally.