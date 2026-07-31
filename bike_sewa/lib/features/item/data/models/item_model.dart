import 'package:equatable/equatable.dart';

import '../../domain/entities/item_entity.dart';

class ItemModel extends Equatable {
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

  const ItemModel({
    required this.id,
    required this.title,
    required this.description,
    required this.requirements,
    required this.category,
    required this.location,
    required this.pricePerDay,
    this.imagePath,
    this.videoPath,
    required this.createdAt,
    this.isAvailable = true,
  });

  ItemEntity toEntity() {
    return ItemEntity(
      id: id,
      title: title,
      description: description,
      requirements: requirements,
      category: category,
      location: location,
      pricePerDay: pricePerDay,
      imagePath: imagePath,
      videoPath: videoPath,
      createdAt: createdAt,
      isAvailable: isAvailable,
    );
  }

  factory ItemModel.fromEntity(ItemEntity entity) {
    return ItemModel(
      id: entity.id,
      title: entity.title,
      description: entity.description,
      requirements: entity.requirements,
      category: entity.category,
      location: entity.location,
      pricePerDay: entity.pricePerDay,
      imagePath: entity.imagePath,
      videoPath: entity.videoPath,
      createdAt: entity.createdAt,
      isAvailable: entity.isAvailable,
    );
  }

  factory ItemModel.fromJson(Map<String, dynamic> json) {
    return ItemModel(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      requirements: json['requirements'] as String? ?? '',
      category: json['category'] as String? ?? '',
      location: json['location'] as String? ?? '',
      pricePerDay:
          (json['pricePerDay'] as num? ?? json['price_per_day'] as num?)
              ?.toDouble() ??
          0.0,
      imagePath: json['imagePath'] as String? ?? json['image_path'] as String?,
      videoPath: json['videoPath'] as String? ?? json['video_path'] as String?,
      createdAt: json['createdAt'] == null
          ? DateTime.now()
          : DateTime.parse(json['createdAt'] as String),
      isAvailable:
          json['isAvailable'] as bool? ?? json['is_available'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'description': description,
    'requirements': requirements,
    'category': category,
    'location': location,
    'pricePerDay': pricePerDay,
    'imagePath': imagePath,
    'videoPath': videoPath,
    'createdAt': createdAt.toIso8601String(),
    'isAvailable': isAvailable,
  };

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
