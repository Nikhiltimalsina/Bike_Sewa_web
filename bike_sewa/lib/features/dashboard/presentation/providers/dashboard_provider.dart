import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/api/api_client.dart';
import '../../data/datasources/dashboard_remote_datasource.dart';
import '../../data/repositories/dashboard_repository_impl.dart';
import '../../domain/entities/bike_entity.dart';
import '../../domain/repositories/dashboard_repository.dart';
import '../../domain/usecases/dashboard_usecases.dart';

final dashboardRemoteDataSourceProvider =
    Provider<DashboardRemoteDataSource>((ref) {
  return DashboardRemoteDataSourceImpl(ref.watch(dioProvider));
});

final dashboardRepositoryProvider = Provider<DashboardRepository>((ref) {
  return DashboardRepositoryImpl(
    remoteDataSource: ref.watch(dashboardRemoteDataSourceProvider),
  );
});

/// Get All Bikes UseCase Provider
final getAllBikesUseCaseProvider = Provider<GetAllBikesUseCase>((ref) {
  return GetAllBikesUseCase(ref.watch(dashboardRepositoryProvider));
});

/// Get Available Bikes UseCase Provider
final getAvailableBikesUseCaseProvider = Provider<GetAvailableBikesUseCase>((
  ref,
) {
  return GetAvailableBikesUseCase(ref.watch(dashboardRepositoryProvider));
});

/// Get Bike By Id UseCase Provider
final getBikeByIdUseCaseProvider = Provider<GetBikeByIdUseCase>((ref) {
  return GetBikeByIdUseCase(ref.watch(dashboardRepositoryProvider));
});

/// Search Bikes UseCase Provider
final searchBikesUseCaseProvider = Provider<SearchBikesUseCase>((ref) {
  return SearchBikesUseCase(ref.watch(dashboardRepositoryProvider));
});

/// Get Bikes By Location UseCase Provider
final getBikesByLocationUseCaseProvider = Provider<GetBikesByLocationUseCase>((
  ref,
) {
  return GetBikesByLocationUseCase(ref.watch(dashboardRepositoryProvider));
});

/// Rent Bike UseCase Provider
final rentBikeUseCaseProvider = Provider<RentBikeUseCase>((ref) {
  return RentBikeUseCase(ref.watch(dashboardRepositoryProvider));
});

/// Return Bike UseCase Provider
final returnBikeUseCaseProvider = Provider<ReturnBikeUseCase>((ref) {
  return ReturnBikeUseCase(ref.watch(dashboardRepositoryProvider));
});

/// Bikes List State Notifier
class BikesListNotifier extends StateNotifier<BikesListState> {
  final GetAllBikesUseCase getAllBikesUseCase;
  final GetAvailableBikesUseCase getAvailableBikesUseCase;
  final SearchBikesUseCase searchBikesUseCase;

  BikesListNotifier({
    required this.getAllBikesUseCase,
    required this.getAvailableBikesUseCase,
    required this.searchBikesUseCase,
  }) : super(const BikesListState.initial());

  Future<void> loadAllBikes() async {
    state = const BikesListState.loading();
    final result = await getAllBikesUseCase();

    result.fold(
      (failure) => state = BikesListState.failure(failure.message),
      (bikes) => state = BikesListState.loaded(bikes),
    );
  }

  Future<void> loadAvailableBikes() async {
    state = const BikesListState.loading();
    final result = await getAvailableBikesUseCase();

    result.fold(
      (failure) => state = BikesListState.failure(failure.message),
      (bikes) => state = BikesListState.loaded(bikes),
    );
  }

  Future<void> searchBikes(String query) async {
    state = const BikesListState.loading();
    final result = await searchBikesUseCase(query);

    result.fold(
      (failure) => state = BikesListState.failure(failure.message),
      (bikes) => state = BikesListState.loaded(bikes),
    );
  }
}

/// Bikes List State
sealed class BikesListState {
  const BikesListState();

  const factory BikesListState.initial() = BikesListInitial;
  const factory BikesListState.loading() = BikesListLoading;
  const factory BikesListState.loaded(List<BikeEntity> bikes) = BikesListLoaded;
  const factory BikesListState.failure(String message) = BikesListFailure;
}

class BikesListInitial extends BikesListState {
  const BikesListInitial();
}

class BikesListLoading extends BikesListState {
  const BikesListLoading();
}

class BikesListLoaded extends BikesListState {
  final List<BikeEntity> bikes;
  const BikesListLoaded(this.bikes);
}

class BikesListFailure extends BikesListState {
  final String message;
  const BikesListFailure(this.message);
}

/// Bikes List State Notifier Provider
final bikesListProvider =
    StateNotifierProvider<BikesListNotifier, BikesListState>((ref) {
      return BikesListNotifier(
        getAllBikesUseCase: ref.watch(getAllBikesUseCaseProvider),
        getAvailableBikesUseCase: ref.watch(getAvailableBikesUseCaseProvider),
        searchBikesUseCase: ref.watch(searchBikesUseCaseProvider),
      );
    });
