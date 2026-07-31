import 'package:flutter/material.dart';

/// Application Router for named route navigation
class AppRouter {
  AppRouter._();

  /// Generate routes based on route name
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      // Add your routes here
      // case RouteNames.splash:
      //   return MaterialPageRoute(
      //     builder: (_) => const SplashPage(),
      //     settings: settings,
      //   );
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(child: Text('No route defined for ${settings.name}')),
          ),
          settings: settings,
        );
    }
  }

  /// Handle unknown routes
  static Route<dynamic> unknownRoute(RouteSettings settings) {
    return MaterialPageRoute(
      builder: (_) => Scaffold(
        appBar: AppBar(title: const Text('Page Not Found')),
        body: Center(child: Text('No route defined for "${settings.name}"')),
      ),
    );
  }
}
