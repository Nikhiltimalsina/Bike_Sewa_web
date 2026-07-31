import 'package:get_it/get_it.dart';
import 'package:dio/dio.dart';

// Service Locator / Dependency Injection Container
//Using GetIt for dependency injection

final getIt = GetIt.instance;

/// Setup all dependencies
Future<void> setupServiceLocator() async {
  // External Dependencies
  _setupExternalDependencies();

  // Core Services
  _setupCoreServices();

  // Data Sources
  _setupDataSources();

  // Repositories
  _setupRepositories();

  // Use Cases
  _setupUseCases();

  // Providers / State Management
  _setupProviders();
}

void _setupExternalDependencies() {
  // Dio setup
  final dio = Dio();
  dio.options = BaseOptions(
    baseUrl: 'https://api.example.com', // Add your API base URL
    connectTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 30),
  );

  getIt.registerSingleton<Dio>(dio);
}

void _setupCoreServices() {
  // Register core services here
  // Example:
  // getIt.registerSingleton<HiveService>(HiveService());
}

void _setupDataSources() {
  // Register data sources (local and remote)
  // Example:
  // getIt.registerSingleton<AuthRemoteDataSource>(
  //   AuthRemoteDataSourceImpl(getIt<Dio>()),
  // );
}

void _setupRepositories() {
  // Register repositories
  // Example:
  // getIt.registerSingleton<AuthRepository>(
  //   AuthRepositoryImpl(
  //     remoteDataSource: getIt<AuthRemoteDataSource>(),
  //   ),
  // );
}

void _setupUseCases() {
  // Register use cases
  // Example:
  // getIt.registerSingleton<LoginUseCase>(
  //   LoginUseCase(getIt<AuthRepository>()),
  // );
}

void _setupProviders() {
  // Register Riverpod providers if needed
  // This is typically done directly in feature folders
}
