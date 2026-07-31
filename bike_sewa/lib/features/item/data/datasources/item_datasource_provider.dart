import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:bike_sewa/core/api/api_client.dart';
import 'package:bike_sewa/features/item/data/datasources/item_remote_datasource.dart';
import 'package:bike_sewa/features/item/data/repositories/item_repository_impl.dart';
import 'package:bike_sewa/features/item/domain/repositories/item_repository.dart';
import 'package:bike_sewa/features/item/domain/usecases/item_usecases.dart';

final itemRemoteDatasourceProvider = Provider<ItemRemoteDatasource>((ref) {
  return ItemRemoteDatasource(dio: ref.read(dioProvider));
});

final itemRepositoryProvider = Provider<ItemRepository>((ref) {
  return ItemRepositoryImpl(
    remoteDatasource: ref.watch(itemRemoteDatasourceProvider),
  );
});

final createItemUsecaseProvider = Provider<CreateItemUsecase>((ref) {
  return CreateItemUsecase(repository: ref.watch(itemRepositoryProvider));
});

final getItemsUsecaseProvider = Provider<GetItemsUsecase>((ref) {
  return GetItemsUsecase(repository: ref.watch(itemRepositoryProvider));
});