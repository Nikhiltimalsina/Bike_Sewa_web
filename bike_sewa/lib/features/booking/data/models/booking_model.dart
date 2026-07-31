import 'package:equatable/equatable.dart';
import '../../domain/entities/booking_entity.dart';

/// Booking Model (Data Layer - DTO)
class BookingModel extends Equatable {
  final String id;
  final String bikeId;
  final String bikeName;
  final String? bikeImageUrl;
  final DateTime startDate;
  final DateTime endDate;
  final double totalPrice;
  final String status;
  final String pickupLocation;

  const BookingModel({
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

  BookingStatus get _statusEnum => BookingStatus.values.firstWhere(
    (s) => s.name == status,
    orElse: () => BookingStatus.confirmed,
  );

  BookingEntity toEntity() {
    return BookingEntity(
      id: id,
      bikeId: bikeId,
      bikeName: bikeName,
      bikeImageUrl: bikeImageUrl,
      startDate: startDate,
      endDate: endDate,
      totalPrice: totalPrice,
      status: _statusEnum,
      pickupLocation: pickupLocation,
    );
  }

  factory BookingModel.fromEntity(BookingEntity entity) {
    return BookingModel(
      id: entity.id,
      bikeId: entity.bikeId,
      bikeName: entity.bikeName,
      bikeImageUrl: entity.bikeImageUrl,
      startDate: entity.startDate,
      endDate: entity.endDate,
      totalPrice: entity.totalPrice,
      status: entity.status.name,
      pickupLocation: entity.pickupLocation,
    );
  }

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      id: json['id'] as String? ?? '',
      bikeId: json['bikeId'] as String? ?? json['bike_id'] as String? ?? '',
      bikeName: json['bikeName'] as String? ?? json['bike_name'] as String? ?? '',
      bikeImageUrl:
          json['bikeImageUrl'] as String? ?? json['bike_image_url'] as String?,
      startDate: DateTime.tryParse(
            json['startDate'] as String? ?? json['start_date'] as String? ?? '',
          ) ??
          DateTime.now(),
      endDate: DateTime.tryParse(
            json['endDate'] as String? ?? json['end_date'] as String? ?? '',
          ) ??
          DateTime.now(),
      totalPrice:
          (json['totalPrice'] as num? ?? json['total_price'] as num?)
              ?.toDouble() ??
          0.0,
      status: json['status'] as String? ?? 'confirmed',
      pickupLocation: json['pickupLocation'] as String? ??
          json['pickup_location'] as String? ??
          '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'bikeId': bikeId,
    'bikeName': bikeName,
    'bikeImageUrl': bikeImageUrl,
    'startDate': startDate.toIso8601String(),
    'endDate': endDate.toIso8601String(),
    'totalPrice': totalPrice,
    'status': status,
    'pickupLocation': pickupLocation,
  };

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
