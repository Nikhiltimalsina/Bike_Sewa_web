import 'dart:convert';
import 'package:equatable/equatable.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../core/api/api_client.dart';

class PaymentTransaction extends Equatable {
  final String id;
  final String bikeName;
  final double amount;
  final String paymentMethod;
  final DateTime date;
  final String status;
  final String? transactionRef;

  const PaymentTransaction({
    required this.id,
    required this.bikeName,
    required this.amount,
    required this.paymentMethod,
    required this.date,
    this.status = 'Completed',
    this.transactionRef,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'bikeName': bikeName,
        'amount': amount,
        'paymentMethod': paymentMethod,
        'date': date.toIso8601String(),
        'status': status,
        'transactionRef': transactionRef,
      };

  factory PaymentTransaction.fromJson(Map<String, dynamic> json) =>
      PaymentTransaction(
        id: json['id'] as String,
        bikeName: json['bikeName'] as String,
        amount: (json['amount'] as num).toDouble(),
        paymentMethod: json['paymentMethod'] as String,
        date: DateTime.parse(json['date'] as String),
        status: json['status'] as String? ?? 'Completed',
        transactionRef: json['transactionRef'] as String?,
      );

  @override
  List<Object?> get props => [id, bikeName, amount, paymentMethod, date, status, transactionRef];
}

class RecentPaymentsNotifier extends StateNotifier<List<PaymentTransaction>> {
  final SharedPreferences? _prefs;

  RecentPaymentsNotifier(this._prefs) : super([]) {
    _loadFromStorage();
  }

  void _loadFromStorage() {
    if (_prefs == null) return;
    final jsonString = _prefs.getString('recent_payment_transactions');
    if (jsonString != null && jsonString.isNotEmpty) {
      try {
        final List<dynamic> list = jsonDecode(jsonString);
        state = list.map((e) => PaymentTransaction.fromJson(e)).toList();
      } catch (_) {}
    }
  }

  Future<void> addTransaction(PaymentTransaction transaction) async {
    state = [transaction, ...state];
    if (_prefs != null) {
      final jsonString = jsonEncode(state.map((e) => e.toJson()).toList());
      _prefs.setString('recent_payment_transactions', jsonString);
    }
  }
}

final recentPaymentsProvider =
    StateNotifierProvider<RecentPaymentsNotifier, List<PaymentTransaction>>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return RecentPaymentsNotifier(prefs);
});
