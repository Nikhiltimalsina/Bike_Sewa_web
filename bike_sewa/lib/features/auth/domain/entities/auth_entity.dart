import 'package:equatable/equatable.dart';

class AuthEntity extends Equatable {
  final String? authId;
  final String fullName;
  final String email;
  final String username;
  final String password;

  /// Phone number required by the backend (`phone` field).
  final String phone;

  /// JWT token stored after successful login.
  final String? token;

  /// Avatar URL returned by the backend after profile update.
  final String? avatar;

  const AuthEntity({
    this.authId,
    required this.fullName,
    required this.email,
    required this.username,
    required this.password,
    required this.phone,
    this.token,
    this.avatar,
  });

  @override
  List<Object?> get props => [
    authId,
    fullName,
    email,
    username,
    password,
    phone,
    token,
    avatar,
  ];
}
