import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/utils/base_usecase.dart';
import '../entities/booking_entity.dart';
import '../repositories/booking_repository.dart';

/// Get My Bookings UseCase
class GetMyBookingsUseCase extends UseCaseNoParams<List<BookingEntity>> {
  final BookingRepository repository;

  GetMyBookingsUseCase(this.repository);

  @override
  Future<Either<Failure, List<BookingEntity>>> call() async {
    return repository.getMyBookings();
  }
}

/// Get Booking By Id UseCase
class GetBookingByIdUseCase extends UseCaseWithString<BookingEntity> {
  final BookingRepository repository;

  GetBookingByIdUseCase(this.repository);

  @override
  Future<Either<Failure, BookingEntity>> call(String id) async {
    return repository.getBookingById(id);
  }
}

/// Create Booking UseCase
class CreateBookingParams {
  final String bikeId;
  final DateTime startDate;
  final DateTime endDate;

  const CreateBookingParams({
    required this.bikeId,
    required this.startDate,
    required this.endDate,
  });
}

class CreateBookingUseCase
    extends UseCase<BookingEntity, CreateBookingParams> {
  final BookingRepository repository;

  CreateBookingUseCase(this.repository);

  @override
  Future<Either<Failure, BookingEntity>> call(
    CreateBookingParams params,
  ) async {
    return repository.createBooking(
      bikeId: params.bikeId,
      startDate: params.startDate,
      endDate: params.endDate,
    );
  }
}

/// Cancel Booking UseCase
class CancelBookingUseCase extends UseCaseWithString<void> {
  final BookingRepository repository;

  CancelBookingUseCase(this.repository);

  @override
  Future<Either<Failure, void>> call(String bookingId) async {
    return repository.cancelBooking(bookingId);
  }
}
