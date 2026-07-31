import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/payment_entity.dart';

abstract class PaymentRepository {
  Future<Either<Failure, List<PaymentEntity>>> getMyPayments();

  Future<Either<Failure, PaymentEntity>> getPaymentById(String id);

  Future<Either<Failure, PaymentEntity>> processPayment({
    required String bookingId,
    required double amount,
    required String method,
  });

  Future<Either<Failure, void>> refundPayment(String paymentId);
}