import 'dart:io';
import 'package:image_picker/image_picker.dart';
import '../error/exceptions.dart';

/// File picker helper
class FilePickerHelper {
  static final ImagePicker _picker = ImagePicker();

  FilePickerHelper._();

  /// Pick image from gallery
  static Future<File?> pickImageFromGallery() async {
    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 85,
      );

      if (image != null) {
        return File(image.path);
      }
      return null;
    } catch (e) {
      throw ValidationException(message: 'Failed to pick image: $e');
    }
  }

  /// Pick image from camera
  static Future<File?> pickImageFromCamera() async {
    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 85,
      );

      if (image != null) {
        return File(image.path);
      }
      return null;
    } catch (e) {
      throw ValidationException(message: 'Failed to capture image: $e');
    }
  }

  /// Pick video from gallery
  static Future<File?> pickVideoFromGallery() async {
    try {
      final XFile? video = await _picker.pickVideo(source: ImageSource.gallery);

      if (video != null) {
        return File(video.path);
      }
      return null;
    } catch (e) {
      throw ValidationException(message: 'Failed to pick video: $e');
    }
  }

  /// Pick video from camera
  static Future<File?> pickVideoFromCamera() async {
    try {
      final XFile? video = await _picker.pickVideo(source: ImageSource.camera);

      if (video != null) {
        return File(video.path);
      }
      return null;
    } catch (e) {
      throw ValidationException(message: 'Failed to capture video: $e');
    }
  }

  /// Validate image file size (max 5MB)
  static bool isValidImageSize(File file, {int maxSizeMB = 5}) {
    final fileSizeInBytes = file.lengthSync();
    final fileSizeInMB = fileSizeInBytes / (1024 * 1024);
    return fileSizeInMB <= maxSizeMB;
  }

  /// Get file size in MB
  static double getFileSizeInMB(File file) {
    final fileSizeInBytes = file.lengthSync();
    return fileSizeInBytes / (1024 * 1024);
  }
}
