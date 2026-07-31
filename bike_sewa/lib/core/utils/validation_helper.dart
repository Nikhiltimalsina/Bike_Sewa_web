/// Validation helper
class ValidationHelper {
  ValidationHelper._();

  /// Validate email format
  static bool isValidEmail(String email) {
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    return emailRegex.hasMatch(email);
  }

  /// Validate password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
  static bool isValidPassword(String password) {
    if (password.length < 8) return false;
    if (!password.contains(RegExp(r'[A-Z]'))) return false;
    if (!password.contains(RegExp(r'[a-z]'))) return false;
    if (!password.contains(RegExp(r'[0-9]'))) return false;
    return true;
  }

  /// Validate phone number
  static bool isValidPhoneNumber(String phone) {
    final phoneRegex = RegExp(r'^[0-9]{10,}$');
    return phoneRegex.hasMatch(phone.replaceAll(RegExp(r'\D'), ''));
  }

  /// Validate name (min 2 chars, no special chars)
  static bool isValidName(String name) {
    if (name.length < 2) return false;
    if (name.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'))) return false;
    return true;
  }

  /// Validate URL
  static bool isValidUrl(String url) {
    try {
      Uri.parse(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch (e) {
      return false;
    }
  }

  /// Validate credit card number (Luhn algorithm)
  static bool isValidCreditCard(String cardNumber) {
    cardNumber = cardNumber.replaceAll(RegExp(r'\s'), '');
    if (!cardNumber.contains(RegExp(r'^[0-9]{13,19}$'))) return false;

    int sum = 0;
    int digit;
    int addend;
    bool timesTwo = false;

    for (int i = cardNumber.length - 1; i >= 0; i--) {
      digit = int.parse(cardNumber[i]);

      if (timesTwo) {
        addend = digit * 2;
        if (addend > 9) {
          addend -= 9;
        }
      } else {
        addend = digit;
      }

      sum += addend;
      timesTwo = !timesTwo;
    }

    int modulus = sum % 10;
    return modulus == 0;
  }

  /// Check if string is empty or whitespace
  static bool isEmpty(String? value) {
    return value == null || value.trim().isEmpty;
  }

  /// Get validation error message
  static String getValidationError(String field, String value) {
    switch (field.toLowerCase()) {
      case 'email':
        return isValidEmail(value) ? '' : 'Invalid email format';
      case 'password':
        return isValidPassword(value)
            ? ''
            : 'Password must be 8+ chars with uppercase, lowercase, and numbers';
      case 'phone':
        return isValidPhoneNumber(value) ? '' : 'Invalid phone number';
      case 'name':
        return isValidName(value)
            ? ''
            : 'Name must be 2+ chars without special chars';
      default:
        return '';
    }
  }
}
