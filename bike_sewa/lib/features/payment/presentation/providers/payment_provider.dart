import 'package:equatable/equatable.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/api/api_client.dart';
import '../../../payment/data/datasources/payment_remote_datasource.dart';
import '../../../payment/data/repositories/payment_repository_impl.dart';
import '../../../payment/domain/entities/payment_entity.dart';
import '../../../payment/domain/repositories/payment_repository.dart';
import '../../../payment/domain/usecases/payment_usecases.dart';

final paymentRemoteDataSourceProvider =
    Provider<PaymentRemoteDataSource>((ref) {
  final dio = ref.watch(dioProvider);
  return PaymentRemoteDataSourceImpl(dio);
});

final paymentRepositoryProvider = Provider<PaymentRepository>((ref) {
  return PaymentRepositoryImpl(
    remoteDataSource: ref.watch(paymentRemoteDataSourceProvider),
  );
});

final processPaymentUseCaseProvider =
    Provider<ProcessPaymentUseCase>((ref) {
  return ProcessPaymentUseCase(ref.watch(paymentRepositoryProvider));
});

final getMyPaymentsUseCaseProvider =
    Provider<GetMyPaymentsUseCase>((ref) {
  return GetMyPaymentsUseCase(ref.watch(paymentRepositoryProvider));
});

final getPaymentByIdUseCaseProvider =
    Provider<GetPaymentByIdUseCase>((ref) {
  return GetPaymentByIdUseCase(ref.watch(paymentRepositoryProvider));
});

final refundPaymentUseCaseProvider = Provider<RefundPaymentUseCase>((ref) {
  return RefundPaymentUseCase(ref.watch(paymentRepositoryProvider));
});

class MyPaymentsNotifier extends Notifier<MyPaymentsState> {
  @override
  MyPaymentsState build() {
    return const MyPaymentsState.initial();
  }

  Future<void> loadPayments() async {
    state = const MyPaymentsState.loading();
    final useCase = ref.read(getMyPaymentsUseCaseProvider);
    final result = await useCase();
    result.fold(
      (failure) => state = MyPaymentsState.failure(failure.message),
      (payments) => state = MyPaymentsState.loaded(payments),
    );
  }

  Future<void> processPayment({
    required String bookingId,
    required double amount,
    required String method,
  }) async {
    state = const MyPaymentsState.loading();
    final useCase = ref.read(processPaymentUseCaseProvider);
    final result = await useCase(
      ProcessPaymentParams(
        bookingId: bookingId,
        amount: amount,
        method: method,
      ),
    );
    result.fold(
      (failure) => state = MyPaymentsState.failure(failure.message),
      (_) => loadPayments(),
    );
  }
}

sealed class MyPaymentsState extends Equatable {
  const MyPaymentsState();

  const factory MyPaymentsState.initial() = MyPaymentsInitial;
  const factory MyPaymentsState.loading() = MyPaymentsLoading;
  const factory MyPaymentsState.loaded(List<PaymentEntity> payments) =
      MyPaymentsLoaded;
  const factory MyPaymentsState.failure(String message) = MyPaymentsFailure;

  @override
  List<Object?> get props => [];
}

class MyPaymentsInitial extends MyPaymentsState {
  const MyPaymentsInitial();
}

class MyPaymentsLoading extends MyPaymentsState {
  const MyPaymentsLoading();
}

class MyPaymentsLoaded extends MyPaymentsState {
  final List<PaymentEntity> payments;
  const MyPaymentsLoaded(this.payments);

  @override
  List<Object?> get props => [payments];
}

class MyPaymentsFailure extends MyPaymentsState {
  final String message;
  const MyPaymentsFailure(this.message);

  @override
  List<Object?> get props => [message];
}

final myPaymentsProvider =
    NotifierProvider<MyPaymentsNotifier, MyPaymentsState>(
  MyPaymentsNotifier.new,
);