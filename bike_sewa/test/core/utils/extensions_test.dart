import 'package:flutter_test/flutter_test.dart';
import 'package:bike_sewa/core/utils/extensions.dart';

void main() {
  group('StringExtensions', () {
    test('should capitalize first letter', () {
      expect('hello'.capitalizeFirstLetter(), 'Hello');
    });
  });
}
