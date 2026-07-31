import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/booking_entity.dart';

/// Abstract Booking Repository
abstract class BookingRepository {
  /// All bookings for the signed-in rider, most recent first.
  Future<Either<Failure, List<BookingEntity>>> getMyBookings();

  Future<Either<Failure, BookingEntity>> getBookingById(String id);

  Future<Either<Failure, BookingEntity>> createBooking({
    required String bikeId,
    required DateTime startDate,
    required DateTime endDate,
  });

  Future<Either<Failure, void>> cancelBooking(String bookingId);
}
