import 'package:dio/dio.dart';
import 'package:bike_sewa/core/api/api_endpoints.dart';
import 'package:bike_sewa/core/error/exceptions.dart';
import 'package:bike_sewa/features/item/domain/entities/item_entity.dart';

class ItemRemoteDatasource {
  final Dio _dio;

  ItemRemoteDatasource({required Dio dio}) : _dio = dio;

  Future<ItemEntity> createItem({
    required String title,
    required String description,
    required String requirements,
    required String category,
    required String location,
    required double pricePerDay,
    required String? imagePath,
    required String? videoPath,
  }) async {
    try {
      final formData = FormData.fromMap({
        'title': title,
        'description': description,
        'requirements': requirements,
        'category': category,
        'location': location,
        'pricePerDay': pricePerDay,
      });

      if (imagePath != null) {
        final imageFile = await MultipartFile.fromFile(
          imagePath,
          contentType: DioMediaType('image', 'jpeg'),
        );
        formData.files.add(MapEntry('image', imageFile));
      }

      if (videoPath != null) {
        final videoFile = await MultipartFile.fromFile(
          videoPath,
          contentType: DioMediaType('video', 'mp4'),
        );
        formData.files.add(MapEntry('video', videoFile));
      }

      final response = await _dio.post(
        ApiEndpoints.items,
        data: formData,
      );

      if (response.statusCode == 201) {
        final data = response.data['item'] as Map<String, dynamic>;
        return ItemEntity(
          id: data['_id'] as String? ?? data['id'] as String? ?? '',
          title: data['title'] as String? ?? '',
          description: data['description'] as String? ?? '',
          requirements: data['requirements'] as String? ?? '',
          category: data['category'] as String? ?? '',
          location: data['location'] as String? ?? '',
          pricePerDay: (data['pricePerDay'] as num?)?.toDouble() ?? 0.0,
          imagePath: data['imagePath'] as String? ?? data['image_path'] as String?,
          videoPath: data['videoPath'] as String? ?? data['video_path'] as String?,
          createdAt: DateTime.tryParse(data['createdAt'] as String? ?? '') ?? DateTime.now(),
          isAvailable: data['isAvailable'] as bool? ?? true,
        );
      }

      throw ServerException(
        message: response.data['message'] as String? ?? 'Failed to create item',
      );
    } on DioException catch (e) {
      throw ServerException(message: _extractDioMessage(e));
    }
  }

  Future<List<ItemEntity>> getItems() async {
    try {
      final response = await _dio.get(ApiEndpoints.items);

      if (response.statusCode == 200) {
        final items = response.data['items'] as List<dynamic>;
        return items.map((item) {
          final data = item as Map<String, dynamic>;
          return ItemEntity(
            id: data['_id'] as String? ?? data['id'] as String? ?? '',
            title: data['title'] as String? ?? '',
            description: data['description'] as String? ?? '',
            requirements: data['requirements'] as String? ?? '',
            category: data['category'] as String? ?? '',
            location: data['location'] as String? ?? '',
            pricePerDay: (data['pricePerDay'] as num?)?.toDouble() ?? 0.0,
            imagePath: data['imagePath'] as String? ?? data['image_path'] as String?,
            videoPath: data['videoPath'] as String? ?? data['video_path'] as String?,
            createdAt: DateTime.tryParse(data['createdAt'] as String? ?? '') ?? DateTime.now(),
            isAvailable: data['isAvailable'] as bool? ?? true,
          );
        }).toList();
      }

      throw ServerException(
        message: response.data['message'] as String? ?? 'Failed to fetch items',
      );
    } on DioException catch (e) {
      throw ServerException(message: _extractDioMessage(e));
    }
  }

  String _extractDioMessage(DioException e) {
    try {
      if (e.response?.data is Map) {
        return e.response!.data['message'] as String? ??
            e.message ??
            'Network error';
      }
    } catch (_) {}
    return e.message ?? 'Network error';
  }
}