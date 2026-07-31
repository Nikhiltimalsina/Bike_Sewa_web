import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:bike_sewa/features/item/domain/entities/item_entity.dart';
import 'package:bike_sewa/features/item/presentation/providers/item_provider.dart';

void main() {
  late ProviderContainer container;

  setUp(() {
    container = ProviderContainer();
  });

  tearDown(() {
    container.dispose();
  });

  final tItem1 = ItemEntity(
    id: '1',
    title: 'iPhone 15',
    description: 'Latest iPhone',
    requirements: 'Good condition',
    category: 'Electronics',
    location: 'Kathmandu',
    pricePerDay: 5000,
  );

  final tItem2 = ItemEntity(
    id: '2',
    title: 'MacBook Pro',
    description: 'M2 MacBook',
    requirements: 'Excellent condition',
    category: 'Electronics',
    location: 'Thamel',
    pricePerDay: 8000,
  );

  group('ItemListNotifier', () {
    group('initial state', () {
      test('should have empty list when created', () {
        // Act
        final state = container.read(itemListProvider);

        // Assert
        expect(state, isEmpty);
      });
    });

    group('addItem', () {
      test('should add item to the beginning of the list', () {
        // Arrange
        final notifier = container.read(itemListProvider.notifier);
        notifier.addItem(tItem1);

        // Act
        final state = container.read(itemListProvider);

        // Assert
        expect(state.length, 1);
        expect(state.first, tItem1);
      });

      test('should add items in correct order', () {
        // Arrange
        final notifier = container.read(itemListProvider.notifier);
        notifier.addItem(tItem1);
        notifier.addItem(tItem2);

        // Act
        final state = container.read(itemListProvider);

        // Assert
        expect(state.length, 2);
        expect(state.first, tItem2);
        expect(state.last, tItem1);
      });
    });

    group('updateItem', () {
      test('should update existing item', () {
        // Arrange
        final notifier = container.read(itemListProvider.notifier);
        notifier.addItem(tItem1);

        final updatedItem = tItem1.copyWith(title: 'Updated iPhone');

        // Act
        notifier.updateItem(updatedItem);

        // Assert
        final state = container.read(itemListProvider);
        expect(state.length, 1);
        expect(state.first.title, 'Updated iPhone');
      });

      test('should not change list length when updating', () {
        // Arrange
        final notifier = container.read(itemListProvider.notifier);
        notifier.addItem(tItem1);

        final updatedItem = tItem1.copyWith(title: 'Updated iPhone');

        // Act
        notifier.updateItem(updatedItem);

        // Assert
        final state = container.read(itemListProvider);
        expect(state.length, 1);
      });
    });

    group('removeItem', () {
      test('should remove item by id', () {
        // Arrange
        final notifier = container.read(itemListProvider.notifier);
        notifier.addItem(tItem1);
        notifier.addItem(tItem2);

        // Act
        notifier.removeItem('1');

        // Assert
        final state = container.read(itemListProvider);
        expect(state.length, 1);
        expect(state.first.id, '2');
      });

      test('should handle removing non-existent item', () {
        // Arrange
        final notifier = container.read(itemListProvider.notifier);
        notifier.addItem(tItem1);

        // Act
        notifier.removeItem('non-existent');

        // Assert
        final state = container.read(itemListProvider);
        expect(state.length, 1);
      });
    });

    group('setItems', () {
      test('should set all items', () {
        // Arrange
        final notifier = container.read(itemListProvider.notifier);

        // Act
        notifier.setItems([tItem1, tItem2]);

        // Assert
        final state = container.read(itemListProvider);
        expect(state.length, 2);
      });

      test('should replace existing items', () {
        // Arrange
        final notifier = container.read(itemListProvider.notifier);
        notifier.addItem(tItem1);

        // Act
        notifier.setItems([tItem2]);

        // Assert
        final state = container.read(itemListProvider);
        expect(state.length, 1);
        expect(state.first.id, '2');
      });

      test('should set empty list', () {
        // Arrange
        final notifier = container.read(itemListProvider.notifier);
        notifier.addItem(tItem1);

        // Act
        notifier.setItems([]);

        // Assert
        final state = container.read(itemListProvider);
        expect(state, isEmpty);
      });
    });

    group('clearItems', () {
      test('should clear all items', () {
        // Arrange
        final notifier = container.read(itemListProvider.notifier);
        notifier.addItem(tItem1);
        notifier.addItem(tItem2);

        // Act
        notifier.clearItems();

        // Assert
        final state = container.read(itemListProvider);
        expect(state, isEmpty);
      });
    });
  });
}