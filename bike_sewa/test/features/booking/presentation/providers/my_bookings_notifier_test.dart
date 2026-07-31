import 'package:dartz/dartz.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:bike_sewa/core/error/failures.dart';
import 'package:bike_sewa/features/booking/domain/entities/booking_entity.dart';
import 'package:bike_sewa/features/booking/domain/usecases/booking_usecases.dart';
import 'package:bike_sewa/features/booking/presentation/providers/booking_provider.dart';

class MockGetMyBookingsUseCase extends Mock implements GetMyBookingsUseCase {}

class MockCancelBookingUseCase extends Mock implements CancelBookingUseCase {}

void main() {
  late MockGetMyBookingsUseCase mockGetMyBookingsUseCase;
  late MockCancelBookingUseCase mockCancelBookingUseCase;
  late ProviderContainer container;

  setUpAll(() {
    registerFallbackValue('');
    registerFallbackValue(BookingEntity(
      id: '',
      bikeId: '',
      bikeName: '',
      startDate: DateTime.now(),
      endDate: DateTime.now(),
      totalPrice: 0,
      status: BookingStatus.confirmed,
      pickupLocation: '',
    ));
  });

  setUp(() {
    mockGetMyBookingsUseCase = MockGetMyBookingsUseCase();
    mockCancelBookingUseCase = MockCancelBookingUseCase();

    container = ProviderContainer(
      overrides: [
        getMyBookingsUseCaseProvider.overrideWithValue(mockGetMyBookingsUseCase),
        cancelBookingUseCaseProvider.overrideWithValue(mockCancelBookingUseCase),
      ],
    );
  });

  tearDown(() {
    container.dispose();
  });

  final tBookings = [
    BookingEntity(
      id: '1',
      bikeId: 'bike1',
      bikeName: 'Honda Dio 110',
      startDate: DateTime(2024, 1, 10),
      endDate: DateTime(2024, 1, 12),
      totalPrice: 1000,
      status: BookingStatus.confirmed,
      pickupLocation: 'Thamel',
    ),
    BookingEntity(
      id: '2',
      bikeId: 'bike2',
      bikeName: 'Yamaha FZ',
      startDate: DateTime(2024, 1, 5),
      endDate: DateTime(2024, 1, 7),
      totalPrice: 800,
      status: BookingStatus.completed,
      pickupLocation: 'Durbar Marg',
    ),
  ];

  group('MyBookingsNotifier', () {
    group('initial state', () {
      test('should have initial state when created', () {
        final state = container.read(myBookingsProvider);

        expect(state, isA<MyBookingsInitial>());
      });
    });

    group('loadBookings', () {
      test('should emit loading then loaded state when successful', () async {
        when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => Right(tBookings));

        final notifier = container.read(myBookingsProvider.notifier);

        await notifier.loadBookings();

        final state = container.read(myBookingsProvider);
        expect(state, isA<MyBookingsLoaded>());
        expect((state as MyBookingsLoaded).bookings, tBookings);
        verify(() => mockGetMyBookingsUseCase()).called(1);
      });

      test('should emit loading then failure state when failed', () async {
        const failure = ServerFailure(message: 'Failed to load bookings');
        when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => const Left(failure));

        final notifier = container.read(myBookingsProvider.notifier);

        await notifier.loadBookings();

        final state = container.read(myBookingsProvider);
        expect(state, isA<MyBookingsFailure>());
        expect((state as MyBookingsFailure).message, 'Failed to load bookings');
        verify(() => mockGetMyBookingsUseCase()).called(1);
      });

      test('should emit loaded state with empty list when no bookings', () async {
        when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => const Right(<BookingEntity>[]));

        final notifier = container.read(myBookingsProvider.notifier);

        await notifier.loadBookings();

        final state = container.read(myBookingsProvider);
        expect(state, isA<MyBookingsLoaded>());
        expect((state as MyBookingsLoaded).bookings, isEmpty);
      });
    });

    group('cancelBooking', () {
      test('should reload bookings when cancel is successful', () async {
        when(() => mockCancelBookingUseCase(any())).thenAnswer((_) async => Right<Failure, void>(null));
        when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => Right(tBookings));

        final notifier = container.read(myBookingsProvider.notifier);

        await notifier.cancelBooking('1');

        verify(() => mockCancelBookingUseCase('1')).called(1);
        verify(() => mockGetMyBookingsUseCase()).called(1);
      });

      test('should emit failure state when cancel fails', () async {
        const failure = ApiFailure(message: 'Cancel failed');
        when(() => mockCancelBookingUseCase(any())).thenAnswer((_) async => const Left(failure));

        final notifier = container.read(myBookingsProvider.notifier);

        await notifier.cancelBooking('1');

        final state = container.read(myBookingsProvider);
        expect(state, isA<MyBookingsFailure>());
        expect((state as MyBookingsFailure).message, 'Cancel failed');
      });

      test('should pass correct bookingId to use case', () async {
        String? capturedId;
        when(() => mockCancelBookingUseCase(any())).thenAnswer((invocation) {
          capturedId = invocation.positionalArguments[0] as String;
          return Future.value(Right<Failure, void>(null));
        });
        when(() => mockGetMyBookingsUseCase()).thenAnswer((_) async => Right(tBookings));

        final notifier = container.read(myBookingsProvider.notifier);

        await notifier.cancelBooking('booking-123');

        expect(capturedId, 'booking-123');
      });
    });
  });

  group('MyBookingsState', () {
    test('should have correct initial values', () {
      final state = MyBookingsInitial();

      expect(state, isA<MyBookingsInitial>());
    });

    test('loaded state should contain bookings', () {
      final state = MyBookingsLoaded(tBookings);

      expect(state, isA<MyBookingsLoaded>());
      expect(state.bookings, tBookings);
    });

    test('failure state should contain message', () {
      final state = const MyBookingsFailure('Error message');

      expect(state, isA<MyBookingsFailure>());
      expect(state.message, 'Error message');
    });
  });
}
