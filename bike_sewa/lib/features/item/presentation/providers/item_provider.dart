import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:bike_sewa/features/item/domain/entities/item_entity.dart';

final itemListProvider =
    NotifierProvider<ItemListNotifier, List<ItemEntity>>(ItemListNotifier.new);

class ItemListNotifier extends Notifier<List<ItemEntity>> {
  @override
  List<ItemEntity> build() => const [];

  void addItem(ItemEntity item) {
    state = [item, ...state];
  }

  void updateItem(ItemEntity item) {
    state = state
        .map((existing) => existing.id == item.id ? item : existing)
        .toList();
  }

  void removeItem(String id) {
    state = state.where((item) => item.id != id).toList();
  }

  void setItems(List<ItemEntity> items) {
    state = items;
  }

  void clearItems() {
    state = const [];
  }
}