import 'package:equatable/equatable.dart';
import '../../domain/entities/payment_entity.dart';

class PaymentModel extends Equatable {
  final String id;
  final String bookingId;
  final double amount;
  final String method;
  final String status;
  final String transactionId;
  final DateTime paidAt;
  final String? receiptUrl;

  const PaymentModel({
    required this.id,
    required this.bookingId,
    required this.amount,
    required this.method,
    required this.status,
    required this.transactionId,
    required this.paidAt,
    this.receiptUrl,
  });

  PaymentStatus get _statusEnum => PaymentStatus.values.firstWhere(
    (s) => s.name == status,
    orElse: () => PaymentStatus.pending,
  );

  PaymentMethod get _methodEnum => PaymentMethod.values.firstWhere(
    (m) => m.name == method,
    orElse: () => PaymentMethod.card,
  );

  PaymentEntity toEntity() {
    return PaymentEntity(
      id: id,
      bookingId: bookingId,
      amount: amount,
      method: _methodEnum,
      status: _statusEnum,
      transactionId: transactionId,
      paidAt: paidAt,
      receiptUrl: receiptUrl,
    );
  }

  factory PaymentModel.fromEntity(PaymentEntity entity) {
    return PaymentModel(
      id: entity.id,
      bookingId: entity.bookingId,
      amount: entity.amount,
      method: entity.method.name,
      status: entity.status.name,
      transactionId: entity.transactionId,
      paidAt: entity.paidAt,
      receiptUrl: entity.receiptUrl,
    );
  }

  factory PaymentModel.fromJson(Map<String, dynamic> json) {
    return PaymentModel(
      id: json['id'] as String? ?? '',
      bookingId: json['bookingId'] as String? ?? json['booking_id'] as String? ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      method: json['method'] as String? ?? 'card',
      status: json['status'] as String? ?? 'pending',
      transactionId: json['transactionId'] as String? ?? json['transaction_id'] as String? ?? '',
      paidAt: DateTime.tryParse(
        json['paidAt'] as String? ?? json['paid_at'] as String? ?? '',
      ) ?? DateTime.now(),
      receiptUrl: json['receiptUrl'] as String? ?? json['receipt_url'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'bookingId': bookingId,
    'amount': amount,
    'method': method,
    'status': status,
    'transactionId': transactionId,
    'paidAt': paidAt.toIso8601String(),
    'receiptUrl': receiptUrl,
  };

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