import 'package:equatable/equatable.dart';

/// Booking status as tracked through the rental lifecycle.
enum BookingStatus { confirmed, ongoing, completed, cancelled }

/// A single rental booking, shown on the Activity tab.
class BookingEntity extends Equatable {
  final String id;
  final String bikeId;
  final String bikeName;
  final String? bikeImageUrl;
  final DateTime startDate;
  final DateTime endDate;
  final double totalPrice;
  final BookingStatus status;
  final String pickupLocation;

  const BookingEntity({
    required this.id,
    required this.bikeId,
    required this.bikeName,
    this.bikeImageUrl,
    required this.startDate,
    required this.endDate,
    required this.totalPrice,
    required this.status,
    required this.pickupLocation,
  });

  BookingEntity copyWith({
    String? id,
    String? bikeId,
    String? bikeName,
    String? bikeImageUrl,
    DateTime? startDate,
    DateTime? endDate,
    double? totalPrice,
    BookingStatus? status,
    String? pickupLocation,
  }) {
    return BookingEntity(
      id: id ?? this.id,
      bikeId: bikeId ?? this.bikeId,
      bikeName: bikeName ?? this.bikeName,
      bikeImageUrl: bikeImageUrl ?? this.bikeImageUrl,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      totalPrice: totalPrice ?? this.totalPrice,
      status: status ?? this.status,
      pickupLocation: pickupLocation ?? this.pickupLocation,
    );
  }

  @override
  List<Object?> get props => [
    id,
    bikeId,
    bikeName,
    bikeImageUrl,
    startDate,
    endDate,
    totalPrice,
    status,
    pickupLocation,
  ];
}
