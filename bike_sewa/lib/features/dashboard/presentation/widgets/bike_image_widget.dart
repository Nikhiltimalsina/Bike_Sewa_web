import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../../../../core/api/api_endpoints.dart';

String? resolveBikeImageUrl(String? imageUrl) {
  if (imageUrl == null || imageUrl.isEmpty) return null;

  var url = imageUrl.trim();

  if (url.startsWith('http://') || url.startsWith('https://')) {
    final baseHost = Uri.parse(ApiEndpoints.baseUrl).host;
    final basePort = Uri.parse(ApiEndpoints.baseUrl).port;

    if (Platform.isAndroid || Platform.isIOS || kIsWeb) {
      url = url.replaceAll('localhost', baseHost);
      url = url.replaceAll('127.0.0.1', baseHost);
      if (basePort != 80 && basePort != 443) {
        final oldPortPattern = RegExp(r':(3000|3001|3002)');
        if (oldPortPattern.hasMatch(url)) {
          url = url.replaceFirst(oldPortPattern, ':$basePort');
        }
      }

      if (url.contains('/images/') && !url.contains('/uploads/images/')) {
        url = url.replaceAll('/images/', '/uploads/images/');
      }
    }
    return url;
  }

  if (url.startsWith('/')) {
    if (url.startsWith('/images/') && !url.startsWith('/uploads/images/')) {
      url = '/uploads/images/${url.substring('/images/'.length)}';
    }
    return '${ApiEndpoints.baseUrl}$url';
  }

  return url;
}

class BikeImage extends StatelessWidget {
  final String? imageUrl;
  final double? width;
  final double? height;
  final BoxFit fit;
  final Widget Function(BuildContext, Object, StackTrace?)? errorBuilder;

  const BikeImage({
    super.key,
    this.imageUrl,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.errorBuilder,
  });

  @override
  Widget build(BuildContext context) {
    final resolved = resolveBikeImageUrl(imageUrl);

    if (resolved == null) {
      return _placeholder(context);
    }

    return Image.network(
      resolved,
      width: width,
      height: height,
      fit: fit,
      loadingBuilder: (context, child, progress) {
        if (progress == null) return child;
        return const Center(
          child: SizedBox(
            width: 24,
            height: 24,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: Color(0xFF00C2CB),
            ),
          ),
        );
      },
      errorBuilder: (context, error, stackTrace) {
        return errorBuilder != null ? errorBuilder!(context, error, stackTrace) : _placeholder(context);
      },
    );
  }

  Widget _placeholder(BuildContext context) {
    return Container(
      width: width,
      height: height,
      color: const Color(0xFF1A1A1A),
      child: const Icon(
        Icons.two_wheeler_rounded,
        color: Colors.white24,
        size: 36,
      ),
    );
  }
}
