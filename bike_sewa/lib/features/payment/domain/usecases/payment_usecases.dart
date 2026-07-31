import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/utils/base_usecase.dart';
import '../entities/payment_entity.dart';
import '../repositories/payment_repository.dart';

class GetMyPaymentsUseCase
    extends UseCaseNoParams<List<PaymentEntity>> {
  final PaymentRepository repository;

  GetMyPaymentsUseCase(this.repository);

  @override
  Future<Either<Failure, List<PaymentEntity>>> call() async {
    return repository.getMyPayments();
  }
}

class GetPaymentByIdUseCase extends UseCaseWithString<PaymentEntity> {
  final PaymentRepository repository;

  GetPaymentByIdUseCase(this.repository);

  @override
  Future<Either<Failure, PaymentEntity>> call(String id) async {
    return repository.getPaymentById(id);
  }
}

class ProcessPaymentParams {
  final String bookingId;
  final double amount;
  final String method;

  const ProcessPaymentParams({
    required this.bookingId,
    required this.amount,
    required this.method,
  });
}

class ProcessPaymentUseCase
    extends UseCase<PaymentEntity, ProcessPaymentParams> {
  final PaymentRepository repository;

  ProcessPaymentUseCase(this.repository);

  @override
  Future<Either<Failure, PaymentEntity>> call(
    ProcessPaymentParams params,
  ) async {
    return repository.processPayment(
      bookingId: params.bookingId,
      amount: params.amount,
      method: params.method,
    );
  }
}

class RefundPaymentUseCase extends UseCaseWithString<void> {
  final PaymentRepository repository;

  RefundPaymentUseCase(this.repository);

  @override
  Future<Either<Failure, void>> call(String paymentId) async {
    return repository.refundPayment(paymentId);
  }
}