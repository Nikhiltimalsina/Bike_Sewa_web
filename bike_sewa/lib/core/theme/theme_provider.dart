import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

enum AppThemeMode { dark, light, system }

class ThemeState extends Equatable {
  final AppThemeMode mode;
  final bool isDark;

  const ThemeState({this.mode = AppThemeMode.system, this.isDark = true});

  ThemeState copyWith({AppThemeMode? mode, bool? isDark}) {
    return ThemeState(
      mode: mode ?? this.mode,
      isDark: isDark ?? this.isDark,
    );
  }

  @override
  List<Object?> get props => [mode, isDark];
}

class ThemeNotifier extends Notifier<ThemeState> {
  final bool _lightDark = true;

  @override
  ThemeState build() {
    return const ThemeState();
  }

  void toggleTheme() {
    final newMode = state.mode == AppThemeMode.dark
        ? AppThemeMode.light
        : state.mode == AppThemeMode.light
            ? AppThemeMode.system
            : AppThemeMode.dark;
    final newIsDark = newMode == AppThemeMode.light
        ? false
        : newMode == AppThemeMode.system
            ? _lightDark
            : true;
    state = state.copyWith(mode: newMode, isDark: newIsDark);
  }

  void setThemeMode(AppThemeMode mode) {
    final isDark = mode == AppThemeMode.dark
        ? true
        : mode == AppThemeMode.light
            ? false
            : _lightDark;
    state = state.copyWith(mode: mode, isDark: isDark);
  }
}

final themeProvider = NotifierProvider<ThemeNotifier, ThemeState>(ThemeNotifier.new);

ThemeData get lightTheme {
  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFF00C2CB),
      brightness: Brightness.light,
      primary: const Color(0xFF00C2CB),
      secondary: const Color(0xFF0066FF),
      surface: Colors.white,
      onSurface: const Color(0xFF1A1A1A),
      onSurfaceVariant: const Color(0xFF5F6368),
    ),
    scaffoldBackgroundColor: const Color(0xFFF8F9FA),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFF00C2CB),
      foregroundColor: Colors.white,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: TextStyle(
        color: Colors.white,
        fontSize: 18,
        fontWeight: FontWeight.w700,
      ),
      iconTheme: IconThemeData(color: Colors.white),
    ),
    cardTheme: const CardThemeData(
      color: Colors.white,
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(16)),
      ),
      shadowColor: Color(0x14000000),
    ),
    textTheme: GoogleFonts.poppinsTextTheme().copyWith(
      headlineLarge: const TextStyle(
        color: Color(0xFF1A1A1A),
        fontSize: 26,
        fontWeight: FontWeight.w800,
      ),
      headlineMedium: const TextStyle(
        color: Color(0xFF1A1A1A),
        fontSize: 20,
        fontWeight: FontWeight.w700,
      ),
      titleLarge: const TextStyle(
        color: Color(0xFF1A1A1A),
        fontSize: 16,
        fontWeight: FontWeight.w600,
      ),
      bodyLarge: const TextStyle(
        color: Color(0xFF3C4043),
        fontSize: 14,
      ),
      bodyMedium: const TextStyle(
        color: Color(0xFF5F6368),
        fontSize: 13,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFF00C2CB),
        foregroundColor: Colors.black,
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
        ),
        textStyle: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: const Color(0xFF00C2CB),
        side: const BorderSide(color: Color(0xFF00C2CB)),
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: const Color(0xFFF0F2F5),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: Color(0xFF00C2CB), width: 1.5),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    ),
    iconTheme: const IconThemeData(color: Color(0xFF5F6368)),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: Colors.white,
      selectedItemColor: Color(0xFF00C2CB),
      unselectedItemColor: Color(0xFF5F6368),
      type: BottomNavigationBarType.fixed,
    ),
    dividerColor: const Color(0xFFE8EAED),
    chipTheme: ChipThemeData(
      backgroundColor: const Color(0xFFF0F2F5),
      selectedColor: Color(0xFF00C2CB),
      labelStyle: TextStyle(color: Color(0xFF1A1A1A)),
    ),
  );
}

ThemeData get darkTheme {
  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFF00C2CB),
      brightness: Brightness.dark,
      primary: const Color(0xFF00C2CB),
      secondary: const Color(0xFF0066FF),
      surface: const Color(0xFF121212),
      onSurface: Colors.white,
      onSurfaceVariant: Colors.white60,
    ),
    scaffoldBackgroundColor: const Color(0xFF0D0D0D),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFF1A1A1A),
      foregroundColor: Colors.white,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: TextStyle(
        color: Colors.white,
        fontSize: 18,
        fontWeight: FontWeight.w700,
      ),
      iconTheme: IconThemeData(color: Colors.white),
    ),
    cardTheme: const CardThemeData(
      color: Color(0xFF1A1A1A),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(16)),
      ),
      shadowColor: Color(0x4D000000),
    ),
    textTheme: GoogleFonts.poppinsTextTheme(ThemeData.dark().textTheme).copyWith(
      headlineLarge: const TextStyle(
        color: Colors.white,
        fontSize: 26,
        fontWeight: FontWeight.w800,
      ),
      headlineMedium: const TextStyle(
        color: Colors.white,
        fontSize: 20,
        fontWeight: FontWeight.w700,
      ),
      titleLarge: const TextStyle(
        color: Colors.white,
        fontSize: 16,
        fontWeight: FontWeight.w600,
      ),
      bodyLarge: const TextStyle(color: Colors.white70, fontSize: 14),
      bodyMedium: const TextStyle(color: Colors.white54, fontSize: 13),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFF00C2CB),
        foregroundColor: Colors.black,
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
        ),
        textStyle: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: const Color(0xFF00C2CB),
        side: const BorderSide(color: Color(0xFF00C2CB)),
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: const Color(0xFF222222),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: Color(0xFF00C2CB), width: 1.5),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    ),
    iconTheme: const IconThemeData(color: Colors.white70),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: Color(0xFF1A1A1A),
       selectedItemColor: Color(0xFF00C2CB),
      unselectedItemColor: Colors.white54,
      type: BottomNavigationBarType.fixed,
    ),
    dividerColor: const Color(0xFF2A2A2A),
    chipTheme: ChipThemeData(
      backgroundColor: const Color(0xFF222222),
      selectedColor: Color(0xFF00C2CB),
      labelStyle: TextStyle(color: Colors.white),
    ),
  );
}