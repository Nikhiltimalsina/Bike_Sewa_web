// Example Dashboard Entity
class BikeEntity {
  final String id;
  final String name;
  final String model;
  final String location;
  final double latitude;
  final double longitude;
  final bool isAvailable;
  final double pricePerHour;
  final String? imageUrl;

  const BikeEntity({
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

  BikeEntity copyWith({
    String? id,
    String? name,
    String? model,
    String? location,
    double? latitude,
    double? longitude,
    bool? isAvailable,
    double? pricePerHour,
    String? imageUrl,
  }) {
    return BikeEntity(
      id: id ?? this.id,
      name: name ?? this.name,
      model: model ?? this.model,
      location: location ?? this.location,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      isAvailable: isAvailable ?? this.isAvailable,
      pricePerHour: pricePerHour ?? this.pricePerHour,
      imageUrl: imageUrl ?? this.imageUrl,
    );
  }

  @override
  String toString() => 'BikeEntity(id: $id, name: $name, model: $model)';
}
