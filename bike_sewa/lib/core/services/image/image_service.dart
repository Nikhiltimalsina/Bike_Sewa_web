import 'dart:io';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:image_picker/image_picker.dart';
import '../../error/exceptions.dart';

class ImageService {
  static final ImageService _instance = ImageService._internal();
  factory ImageService() => _instance;
  ImageService._internal();

  final ImagePicker _picker = ImagePicker();

  Future<File?> pickImage(ImageSource source) async {
    try {
      final XFile? picked = await _picker.pickImage(
        source: source,
        imageQuality: 85,
        maxWidth: 1024,
        maxHeight: 1024,
      );
      if (picked == null) return null;
      return File(picked.path);
    } catch (e) {
      throw ValidationException(message: 'Failed to pick image: $e');
    }
  }

  Future<File?> compressImage(File image) async {
    try {
      final result = await FlutterImageCompress.compressWithFile(
        image.absolute.path,
        minWidth: 800,
        minHeight: 800,
        quality: 80,
        rotate: 0,
      );
      if (result == null) return image;
      final tempDir = image.parent;
      final compressedFile = File(
        '${tempDir.path}/compressed_${DateTime.now().millisecondsSinceEpoch}.jpg',
      );
      await compressedFile.writeAsBytes(result);
      return compressedFile;
    } catch (_) {
      return image;
    }
  }

  bool isValidImageSize(File file, {int maxSizeMB = 5}) {
    final sizeInBytes = file.lengthSync();
    final sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB <= maxSizeMB;
  }

  double getFileSizeInMB(File file) {
    return file.lengthSync() / (1024 * 1024);
  }
}