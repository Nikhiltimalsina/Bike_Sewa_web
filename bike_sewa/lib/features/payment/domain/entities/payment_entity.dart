import 'package:equatable/equatable.dart';

enum PaymentStatus { pending, completed, failed, refunded }

enum PaymentMethod { card, upi, wallet, cash }

class PaymentEntity extends Equatable {
  final String id;
  final String bookingId;
  final double amount;
  final PaymentMethod method;
  final PaymentStatus status;
  final String transactionId;
  final DateTime paidAt;
  final String? receiptUrl;

  const PaymentEntity({
    required this.id,
    required this.bookingId,
    required this.amount,
    required this.method,
    required this.status,
    required this.transactionId,
    required this.paidAt,
    this.receiptUrl,
  });

  PaymentEntity copyWith({
    String? id,
    String? bookingId,
    double? amount,
    PaymentMethod? method,
    PaymentStatus? status,
    String? transactionId,
    DateTime? paidAt,
    String? receiptUrl,
  }) {
    return PaymentEntity(
      id: id ?? this.id,
      bookingId: bookingId ?? this.bookingId,
      amount: amount ?? this.amount,
      method: method ?? this.method,
      status: status ?? this.status,
      transactionId: transactionId ?? this.transactionId,
      paidAt: paidAt ?? this.paidAt,
      receiptUrl: receiptUrl ?? this.receiptUrl,
    );
  }

  @override
  List<Object?> get props => [
    id,
    bookingId,
    amount,
    method,
    status,
    transactionId,
    paidAt,
    receiptUrl,
  ];
}