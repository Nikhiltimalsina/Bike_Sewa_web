# Clean Architecture Implementation for Bike Sewa

This document describes the clean architecture structure implemented in the Bike Sewa Flutter project.

## Project Structure Overview

```
lib/
├── core/                          # Shared/Core Layer
│   ├── constants/                 # App-wide constants
│   │   ├── app_constants.dart    # String, API, Hive, Route, Duration constants
│   │   ├── color_constants.dart  # Color definitions
│   │   └── hive_table_constants.dart # Hive type IDs and table names
│   │
│   ├── error/                     # Error handling
│   │   ├── exceptions.dart        # Custom exceptions
│   │   └── failures.dart          # Failure classes for Either<Failure, T>
│   │
│   ├── services/                  # Core services
│   │   └── hive_service.dart      # Hive database service
│   │
│   ├── utils/                     # Utilities and helpers
│   │   ├── base_usecase.dart      # Base usecase classes
│   │   └── extensions.dart        # String, BuildContext, DateTime extensions
│   │
│   ├── theme/                     # Theme configuration
│   │   └── app_theme.dart         # Light and dark themes
│   │
│   ├── navigation/                # Navigation
│   │   ├── route_names.dart       # Route name constants
│   │   └── app_router.dart        # Route generation
│   │
│   ├── widgets/                   # Reusable widgets
│   │   └── (add common widgets here)
│   │
│   └── di/                        # Dependency Injection
│       └── injection_container.dart # Service locator setup (GetIt)
│
├── features/                      # Feature Modules
│   │
│   ├── auth/                      # Authentication Feature
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   │   ├── auth_remote_datasource.dart    # API calls
│   │   │   │   └── auth_local_datasource.dart     # Hive storage
│   │   │   ├── models/
│   │   │   │   └── user_model.dart               # DTO for API/Storage
│   │   │   └── repositories/
│   │   │       └── auth_repository_impl.dart      # Repository implementation
│   │   │
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── user_entity.dart              # Pure business entity
│   │   │   ├── repositories/
│   │   │   │   └── auth_repository.dart          # Abstract repository
│   │   │   └── usecases/
│   │   │       └── auth_usecases.dart            # LoginUseCase, RegisterUseCase, etc.
│   │   │
│   │   └── presentation/
│   │       ├── pages/
│   │       │   ├── login_page.dart
│   │       │   └── register_page.dart
│   │       ├── widgets/
│   │       │   └── (auth-specific widgets)
│   │       └── providers/
│   │           └── auth_provider.dart             # Riverpod providers & state
│   │
│   ├── dashboard/                 # Dashboard/Bikes Feature
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   │   └── dashboard_remote_datasource.dart
│   │   │   ├── models/
│   │   │   │   └── bike_model.dart
│   │   │   └── repositories/
│   │   │       └── dashboard_repository_impl.dart
│   │   │
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── bike_entity.dart
│   │   │   ├── repositories/
│   │   │   │   └── dashboard_repository.dart
│   │   │   └── usecases/
│   │   │       └── dashboard_usecases.dart
│   │   │
│   │   └── presentation/
│   │       ├── pages/
│   │       ├── widgets/
│   │       └── providers/
│   │           └── dashboard_provider.dart
│   │
│   └── onboarding/                # Onboarding Feature (Presentation-only)
│       └── presentation/
│           ├── pages/
│           └── widgets/
│
├── view/                          # Legacy Views (to be refactored)
│   ├── splashscreen_view.dart
│   ├── onboarding_view.dart
│   ├── login_view.dart
│   ├── register_view.dart
│   └── dashboard_view.dart
│
├── l10n/                          # Localization
│
├── app/
│   ├── app.dart                   # App root widget
│   ├── routes/
│   ├── theme/                     # (moved to core/theme)
│   └── ...
│
└── main.dart                      # Entry point
```

## Architecture Layers Explained

### 1. **Presentation Layer** (`features/*/presentation/`)
- **Pages**: Full-screen widgets (UI screens)
- **Widgets**: Feature-specific reusable widgets
- **Providers**: Riverpod providers for state management
  - StateNotifiers for complex state
  - FutureProviders for async operations
  - Selectors for computed state

**Responsibilities:**
- Display UI
- Handle user input
- Call use cases via providers
- Manage local UI state

### 2. **Domain Layer** (`features/*/domain/`)
- **Entities**: Pure business logic objects (no framework dependencies)
- **Repositories (Abstract)**: Contract/interface for data operations
- **UseCases**: Single-responsibility use cases (Login, Register, GetBikes, etc.)

**Responsibilities:**
- Define business rules
- Define repository contracts
- Orchestrate use cases

**No Dependencies On:**
- Presentation, Data, or Framework layers
- External packages (except equatable, dartz)

### 3. **Data Layer** (`features/*/data/`)
- **DataSources**: 
  - RemoteDataSource: API calls (Dio)
  - LocalDataSource: Local storage (Hive)
- **Models (DTO)**: Data Transfer Objects with JSON serialization
- **Repositories (Implementation)**: Implements domain contracts

**Responsibilities:**
- Fetch data from APIs and local storage
- Convert between Models and Entities
- Handle errors and map them to Failures

**Key Pattern:**
```
Remote/Local DataSource → Models → Repository (converts to Entity) → Domain
```

## Layer Dependencies (Clean Architecture Rule)

```
Presentation Layer
        ↓ (depends on)
Domain Layer
        ↓ (depends on)
Data Layer
        ↓ (depends on)
External Packages & Frameworks
```

**Important:** Each layer only knows about layers below it, never above.

## Key Patterns & Best Practices

### 1. **Either<Failure, Success>** (from `dartz`)
All repositories and use cases return Either for type-safe error handling:

```dart
Future<Either<Failure, UserEntity>> login(String email, String password);

// Usage:
final result = await loginUseCase(params);
result.fold(
  (failure) => handleError(failure.message),
  (user) => handleSuccess(user),
);
```

### 2. **Model ↔ Entity Conversion**
Models convert from/to Entities at repository boundary:

```dart
// Remote API response → Model
final model = UserModel.fromJson(response);

// Model → Entity (for domain/presentation)
final entity = model.toEntity();
```

### 3. **Use Cases with Parameters**
Use Cases accept immutable parameter objects:

```dart
class LoginUseCase extends UseCase<UserEntity, LoginParams> {
  @override
  Future<Either<Failure, UserEntity>> call(LoginParams params) async {
    return repository.login(email: params.email, password: params.password);
  }
}
```

### 4. **Riverpod State Management**
Features use Riverpod for state management:

```dart
// Provider for usecase
final loginUseCaseProvider = Provider<LoginUseCase>((ref) {
  return LoginUseCase(ref.watch(authRepositoryProvider));
});

// State notifier for complex state
final authStateProvider = StateNotifierProvider<AuthStateNotifier, AuthState>((ref) {
  return AuthStateNotifier(
    loginUseCase: ref.watch(loginUseCaseProvider),
    // ... other dependencies
  );
});

// In UI:
ref.watch(authStateProvider).when(
  data: (state) => ..., 
  loading: () => ..., 
  error: (err, stack) => ...,
);
```

## Adding a New Feature

Follow this pattern to add a new feature (e.g., `bookings`):

### 1. Create Structure
```
lib/features/bookings/
├── data/
│   ├── datasources/
│   │   ├── bookings_remote_datasource.dart
│   │   └── bookings_local_datasource.dart
│   ├── models/
│   │   └── booking_model.dart
│   └── repositories/
│       └── bookings_repository_impl.dart
├── domain/
│   ├── entities/
│   │   └── booking_entity.dart
│   ├── repositories/
│   │   └── bookings_repository.dart
│   └── usecases/
│       ├── create_booking_usecase.dart
│       ├── get_user_bookings_usecase.dart
│       ├── cancel_booking_usecase.dart
│       └── update_booking_usecase.dart
└── presentation/
    ├── pages/
    │   ├── bookings_page.dart
    │   └── booking_detail_page.dart
    ├── widgets/
    │   └── booking_card.dart
    └── providers/
        └── bookings_provider.dart
```

### 2. Create Domain Layer First
```dart
// entity
class BookingEntity { ... }

// abstract repository
abstract class BookingsRepository {
  Future<Either<Failure, BookingEntity>> createBooking(...);
  Future<Either<Failure, List<BookingEntity>>> getUserBookings(...);
  ...
}

// usecases
class CreateBookingUseCase extends UseCase<BookingEntity, CreateBookingParams> { ... }
```

### 3. Create Data Layer
```dart
// models (with JSON serialization)
class BookingModel { ... }

// datasources
class BookingsRemoteDataSourceImpl { ... }
class BookingsLocalDataSourceImpl { ... }

// repository implementation
class BookingsRepositoryImpl implements BookingsRepository { ... }
```

### 4. Create Presentation Layer
```dart
// Riverpod providers
final bookingsRepositoryProvider = Provider((ref) => ...);
final createBookingUseCaseProvider = Provider((ref) => ...);

// State notifier
class BookingsStateNotifier extends StateNotifier<BookingsState> { ... }
final bookingsStateProvider = StateNotifierProvider<...>((ref) => ...);

// Pages and widgets
class BookingsPage extends ConsumerWidget { ... }
```

## Dependency Injection Setup

Use the `injection_container.dart` to register all dependencies:

```dart
Future<void> setupServiceLocator() async {
  // External dependencies
  _setupExternalDependencies(); // Dio, etc.
  
  // Core services
  _setupCoreServices(); // HiveService, etc.
  
  // Auth feature
  getIt.registerSingleton<AuthRemoteDataSource>(
    AuthRemoteDataSourceImpl(getIt<Dio>()),
  );
  getIt.registerSingleton<AuthLocalDataSource>(
    AuthLocalDataSourceImpl(getIt<Box<UserModel>>()),
  );
  getIt.registerSingleton<AuthRepository>(
    AuthRepositoryImpl(
      remoteDataSource: getIt<AuthRemoteDataSource>(),
      localDataSource: getIt<AuthLocalDataSource>(),
    ),
  );
  // ... register all features similarly
}
```

## Common Use Case Patterns

### Base Use Cases
Located in `core/utils/base_usecase.dart`:

```dart
// With parameter
abstract class UseCase<Type, Params> {
  Future<Either<Failure, Type>> call(Params params);
}

// No parameter
abstract class UseCaseNoParams<Type> {
  Future<Either<Failure, Type>> call();
}

// With String parameter
abstract class UseCaseWithString<Type> {
  Future<Either<Failure, Type>> call(String param);
}
```

## Constants Organization

Keep constants organized in `core/constants/`:

```dart
// app_constants.dart
class AppStrings { ... }
class ApiConstants { ... }
class HiveConstants { ... }
class RouteConstants { ... }
class DurationConstants { ... }

// color_constants.dart
class AppColors { ... }

// hive_table_constants.dart
class HiveTypeConstants { ... }
```

## Useful Extensions

Located in `core/utils/extensions.dart`:

- **String**: `capitalize()`, `isValidEmail()`, `isNullOrEmpty()`, etc.
- **BuildContext**: `showSnackBar()`, `screenSize`, `showErrorSnackBar()`, etc.
- **DateTime**: `isToday`, `isYesterday`, `toFormattedString()`, etc.
- **Num**: `toFormattedString()`, `toCurrency()`, etc.

## Migration Guide: Existing Views → New Architecture

The legacy views in `lib/view/` should be refactored into the feature structure:

**Before:**
```
lib/view/
├── login_view.dart
├── register_view.dart
└── dashboard_view.dart
```

**After:**
```
lib/features/auth/presentation/pages/
├── login_page.dart (refactored from login_view.dart)
└── register_page.dart (refactored from register_view.dart)

lib/features/dashboard/presentation/pages/
└── dashboard_page.dart (refactored from dashboard_view.dart)
```

Each refactored page should:
1. Extend `ConsumerWidget` (for Riverpod)
2. Use `ref.watch()` to access providers/state
3. Call use cases through providers
4. Display UI based on state (loading, success, error)

## Running Tests

With this architecture, testing is straightforward:

```dart
// Test use case in isolation
test('LoginUseCase should return user when login succeeds', () async {
  // Arrange
  when(mockRepository.login(...)).thenAnswer((_) async => Right(user));
  
  // Act
  final result = await useCase(params);
  
  // Assert
  expect(result, Right(user));
});

// Test repository
test('AuthRepositoryImpl should cache user locally on successful login', () async {
  // Uses mock datasources
});

// Test state notifier
testWidgets('AuthStateNotifier should update state on successful login', (tester) async {
  // Uses mock repositories
});
```

## Resources

- **Dartz**: `Either` for error handling - https://pub.dev/packages/dartz
- **Equatable**: Value equality - https://pub.dev/packages/equatable
- **Riverpod**: State management - https://riverpod.dev
- **GetIt**: Service locator - https://pub.dev/packages/get_it
- **Hive**: Local database - https://docs.hivedb.dev
- **Dio**: HTTP client - https://pub.dev/packages/dio

## Next Steps

1. **Refactor existing views** into the feature architecture
2. **Generate models** from JSON using `json_serializable`
3. **Implement DI** for all features in `injection_container.dart`
4. **Test each layer** independently
5. **Add error handling** UI states (loading, error, empty)
6. **Set up navigation** using Riverpod for authenticated/unauthenticated routes

---

**Created**: $(date) | **Architecture**: Clean Architecture | **State Management**: Riverpod
