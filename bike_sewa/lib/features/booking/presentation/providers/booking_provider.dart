import 'package:equatable/equatable.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/api/api_client.dart';
import '../../data/datasources/booking_remote_datasource.dart';
import '../../data/repositories/booking_repository_impl.dart';
import '../../domain/entities/booking_entity.dart';
import '../../domain/repositories/booking_repository.dart';
import '../../domain/usecases/booking_usecases.dart';

/// Booking Remote Datasource Provider
final bookingRemoteDataSourceProvider = Provider<BookingRemoteDataSource>(
  (ref) {
    final dio = ref.watch(dioProvider);
    return BookingRemoteDataSourceImpl(dio);
  },
);

/// Booking Repository Provider
final bookingRepositoryProvider = Provider<BookingRepository>((ref) {
  return BookingRepositoryImpl(
    remoteDataSource: ref.watch(bookingRemoteDataSourceProvider),
  );
});

/// UseCase Providers
final getMyBookingsUseCaseProvider = Provider<GetMyBookingsUseCase>((ref) {
  return GetMyBookingsUseCase(ref.watch(bookingRepositoryProvider));
});

final getBookingByIdUseCaseProvider = Provider<GetBookingByIdUseCase>((ref) {
  return GetBookingByIdUseCase(ref.watch(bookingRepositoryProvider));
});

final createBookingUseCaseProvider = Provider<CreateBookingUseCase>((ref) {
  return CreateBookingUseCase(ref.watch(bookingRepositoryProvider));
});

final cancelBookingUseCaseProvider = Provider<CancelBookingUseCase>((ref) {
  return CancelBookingUseCase(ref.watch(bookingRepositoryProvider));
});

/// My Bookings State
sealed class MyBookingsState extends Equatable {
  const MyBookingsState();

  const factory MyBookingsState.initial() = MyBookingsInitial;
  const factory MyBookingsState.loading() = MyBookingsLoading;
  const factory MyBookingsState.loaded(List<BookingEntity> bookings) =
      MyBookingsLoaded;
  const factory MyBookingsState.failure(String message) = MyBookingsFailure;

  @override
  List<Object?> get props => [];
}

class MyBookingsInitial extends MyBookingsState {
  const MyBookingsInitial();
}

class MyBookingsLoading extends MyBookingsState {
  const MyBookingsLoading();
}

class MyBookingsLoaded extends MyBookingsState {
  final List<BookingEntity> bookings;
  const MyBookingsLoaded(this.bookings);

  @override
  List<Object?> get props => [bookings];
}

class MyBookingsFailure extends MyBookingsState {
  final String message;
  const MyBookingsFailure(this.message);

  @override
  List<Object?> get props => [message];
}

/// My Bookings Notifier
class MyBookingsNotifier extends Notifier<MyBookingsState> {
  @override
  MyBookingsState build() {
    return const MyBookingsState.initial();
  }

  Future<void> loadBookings() async {
    state = const MyBookingsState.loading();
    final getMyBookingsUseCase = ref.read(getMyBookingsUseCaseProvider);
    final result = await getMyBookingsUseCase();
    result.fold(
      (failure) => state = MyBookingsState.failure(failure.message),
      (bookings) => state = MyBookingsState.loaded(bookings),
    );
  }

  Future<void> cancelBooking(String bookingId) async {
    final cancelBookingUseCase = ref.read(cancelBookingUseCaseProvider);
    final result = await cancelBookingUseCase(bookingId);
    result.fold(
      (failure) => state = MyBookingsState.failure(failure.message),
      (_) => loadBookings(),
    );
  }
}

final myBookingsProvider =
    NotifierProvider<MyBookingsNotifier, MyBookingsState>(MyBookingsNotifier.new);
