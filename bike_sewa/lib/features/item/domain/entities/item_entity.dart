import 'package:equatable/equatable.dart';

class ItemEntity extends Equatable {
  final String id;
  final String title;
  final String description;
  final String requirements;
  final String category;
  final String location;
  final double pricePerDay;
  final String? imagePath;
  final String? videoPath;
  final DateTime createdAt;
  final bool isAvailable;

  ItemEntity({
    required this.id,
    required this.title,
    required this.description,
    required this.requirements,
    required this.category,
    required this.location,
    required this.pricePerDay,
    this.imagePath,
    this.videoPath,
    DateTime? createdAt,
    this.isAvailable = true,
  }) : createdAt = createdAt ?? DateTime.now();

  ItemEntity copyWith({
    String? id,
    String? title,
    String? description,
    String? requirements,
    String? category,
    String? location,
    double? pricePerDay,
    String? imagePath,
    String? videoPath,
    DateTime? createdAt,
    bool? isAvailable,
  }) {
    return ItemEntity(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      requirements: requirements ?? this.requirements,
      category: category ?? this.category,
      location: location ?? this.location,
      pricePerDay: pricePerDay ?? this.pricePerDay,
      imagePath: imagePath ?? this.imagePath,
      videoPath: videoPath ?? this.videoPath,
      createdAt: createdAt ?? this.createdAt,
      isAvailable: isAvailable ?? this.isAvailable,
    );
  }

  @override
  List<Object?> get props => [
    id,
    title,
    description,
    requirements,
    category,
    location,
    pricePerDay,
    imagePath,
    videoPath,
    createdAt,
    isAvailable,
  ];
}
