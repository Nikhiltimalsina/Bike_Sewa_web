import 'package:flutter_test/flutter_test.dart';
import 'package:bike_sewa/core/constants/hive_table_constants.dart';

void main() {
  test('Hive constants keep auth box configuration stable', () {
    expect(HiveConstants.authTypeId, 1);
    expect(HiveConstants.authBox, 'user_table');
    expect(HiveConstants.currentUserKey, '__current_user__');
  });
}
