import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:bike_sewa/features/auth/presentation/state/auth_state.dart';
import 'package:bike_sewa/features/auth/presentation/view_model/auth_view_model.dart';

export 'package:bike_sewa/features/auth/presentation/providers/auth_dependencies_provider.dart';

final authViewModelProvider = NotifierProvider<AuthViewModel, AuthState>(
  AuthViewModel.new,
);
