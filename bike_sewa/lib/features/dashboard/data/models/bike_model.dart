import 'package:equatable/equatable.dart';
import '../../domain/entities/bike_entity.dart';

/// Bike Model (Data Layer - DTO)
class BikeModel extends Equatable {
  final String id;
  final String name;
  final String model;
  final String location;
  final double latitude;
  final double longitude;
  final bool isAvailable;
  final double pricePerHour;
  final String? imageUrl;

  const BikeModel({
    required this.id,
    required this.name,
    required this.model,
    required this.location,
    required this.latitude,
    required this.longitude,
    this.isAvailable = true,
    required this.pricePerHour,
    this.imageUrl,
  });

  BikeEntity toEntity() {
    return BikeEntity(
      id: id,
      name: name,
      model: model,
      location: location,
      latitude: latitude,
      longitude: longitude,
      isAvailable: isAvailable,
      pricePerHour: pricePerHour,
      imageUrl: imageUrl,
    );
  }

  factory BikeModel.fromEntity(BikeEntity entity) {
    return BikeModel(
      id: entity.id,
      name: entity.name,
      model: entity.model,
      location: entity.location,
      latitude: entity.latitude,
      longitude: entity.longitude,
      isAvailable: entity.isAvailable,
      pricePerHour: entity.pricePerHour,
      imageUrl: entity.imageUrl,
    );
  }

  factory BikeModel.fromJson(Map<String, dynamic> json) {
    return BikeModel(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      model: json['model'] as String? ?? '',
      location: json['location'] as String? ?? '',
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
      isAvailable:
          json['isAvailable'] as bool? ?? json['is_available'] as bool? ?? true,
      pricePerHour:
          (json['pricePerHour'] as num? ?? json['price_per_hour'] as num?)
              ?.toDouble() ??
          0.0,
      imageUrl: json['imageUrl'] as String? ?? json['image_url'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'model': model,
    'location': location,
    'latitude': latitude,
    'longitude': longitude,
    'isAvailable': isAvailable,
    'pricePerHour': pricePerHour,
    'imageUrl': imageUrl,
  };

  @override
  List<Object?> get props => [
    id,
    name,
    model,
    location,
    latitude,
    longitude,
    isAvailable,
    pricePerHour,
    imageUrl,
  ];
}
