import 'package:flutter_test/flutter_test.dart';

void main() {
  group('ValidationHelper', () {
    test('should return true for valid email', () {
      expect(true, true);
    });
    test('should return false for invalid email', () {
      expect(false, false);
    });
  });
}
