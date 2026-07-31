import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/constants/color_constants.dart';

class AIAssistant {
  final Map<String, String> _navigationMap = {
    'home': '/',
    'dashboard': '/dashboard',
    'explore': '/explore',
    'scan': '/scan',
    'activity': '/activity',
    'my bookings': '/my-bookings',
    'profile': '/profile',
    'settings': '/settings',
    'search': '/search',
    'bookings': '/my-bookings',
  };

  final Map<String, String> _searchMap = {
    'sport': 'sport',
    'cruiser': 'cruiser',
    'commuter': 'commuter',
    'adventure': 'adventure',
    'naked': 'naked',
    'sport bike': 'sport',
    'cruiser bike': 'cruiser',
    'commuter bike': 'commuter',
    'adventure bike': 'adventure',
    'naked bike': 'naked',
  };

  List<String> getSupportedActions() {
    return [
      'Navigate to Home',
      'Navigate to Explore Bikes',
      'Navigate to Scan QR',
      'Navigate to My Bookings',
      'Navigate to Profile',
      'Search for Sport bikes',
      'Search for Cruiser bikes',
      'Search for Commuter bikes',
      'Search for Adventure bikes',
      'Search for Naked bikes',
    ];
  }

  String processCommand(String command) {
    final lower = command.toLowerCase().trim();

    for (final entry in _navigationMap.entries) {
      if (lower.contains(entry.key)) {
        return 'navigate:${entry.value}';
      }
    }

    for (final entry in _searchMap.entries) {
      if (lower.contains(entry.key)) {
        return 'search:${entry.value}';
      }
    }

    if (lower.contains('refresh') || lower.contains('reload')) {
      return 'refresh';
    }

    if (lower.contains('theme') || lower.contains('dark') || lower.contains('light')) {
      return 'toggle_theme';
    }

    return 'unknown';
  }

  String getResponse(String action) {
    switch (action) {
      case 'navigate:/':
        return 'Navigating to the Home page.';
      case 'navigate:/dashboard':
        return 'Opening the Dashboard.';
      case 'navigate:/explore':
        return 'Opening the Explore Bikes page to browse available bikes.';
      case 'navigate:/scan':
        return 'Opening the QR Scanner. Point your camera at a bike QR code.';
      case 'navigate:/my-bookings':
        return 'Opening My Bookings to view your current and past rides.';
      case 'navigate:/profile':
        return 'Opening your Profile page.';
      case 'navigate:/settings':
        return 'Opening Settings.';
      case 'search:sport':
        return 'Searching for Sport bikes. Filtering results now.';
      case 'search:cruiser':
        return 'Searching for Cruiser bikes. Filtering results now.';
      case 'search:commuter':
        return 'Searching for Commuter bikes. Filtering results now.';
      case 'search:adventure':
        return 'Searching for Adventure bikes. Filtering results now.';
      case 'search:naked':
        return 'Searching for Naked bikes. Filtering results now.';
      case 'refresh':
        return 'Refreshing the current page.';
      case 'toggle_theme':
        return 'Toggling theme between light and dark.';
      default:
        return 'I can help you navigate the app and search for bikes. Try asking me to go to a specific page or search for a bike type like sport, cruiser, or adventure.';
    }
  }
}

class ChatMessage {
  final String text;
  final bool isUser;
  final DateTime timestamp;

  const ChatMessage({
    required this.text,
    required this.isUser,
    required this.timestamp,
  });
}

class AIAssistantChatbot extends ConsumerStatefulWidget {
  const AIAssistantChatbot({super.key});

  @override
  ConsumerState<AIAssistantChatbot> createState() => _AIAssistantChatbotState();
}

class _AIAssistantChatbotState extends ConsumerState<AIAssistantChatbot> {
  final TextEditingController _messageController = TextEditingController();
  final List<ChatMessage> _messages = [];
  final AIAssistant _assistant = AIAssistant();
  bool _isTyping = false;

  void _sendMessage() {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add(ChatMessage(text: text, isUser: true, timestamp: DateTime.now()));
      _isTyping = true;
    });

    _messageController.clear();

    Future.delayed(const Duration(milliseconds: 800), () {
      final action = _assistant.processCommand(text);
      final response = _assistant.getResponse(action);

      if (mounted) {
        setState(() {
          _messages.add(ChatMessage(text: response, isUser: false, timestamp: DateTime.now()));
          _isTyping = false;
        });
      }
    });
  }

  void _quickAction(String action) {
    _messageController.text = action;
    _sendMessage();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: AppColors.cardBg,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      insetPadding: const EdgeInsets.all(16),
      child: SizedBox(
        height: MediaQuery.of(context).size.height * 0.7,
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: const BoxDecoration(
                color: Color(0xFF00C2CB),
                borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: const BoxDecoration(
                      color: Colors.black26,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.auto_awesome_outlined, 
color: Colors.white, size: 24),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Bike Sewa Assistant',
                          style: GoogleFonts.poppins(
                            color: Colors.white,
                            fontWeight: FontWeight.w700,
                            fontSize: 16,
                          ),
                        ),
                        Text(
                          'Online • Can help navigate & search',
                          style: GoogleFonts.poppins(
                            color: Colors.white70,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close_rounded, color: Colors.white),
                  ),
                ],
              ),
            ),
            Expanded(
              child: _messages.isEmpty
                  ? Center(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.chat_bubble_outline, color: Colors.white38, size: 48),
                            const SizedBox(height: 12),
                            Text(
                              'Hello! I can help you navigate the app\nand search for bikes.',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.poppins(
                                color: Colors.white54,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(12),
                      itemCount: _messages.length,
                      itemBuilder: (context, index) {
                        final msg = _messages[index];
                        return _buildMessageBubble(msg);
                      },
                    ),
            ),
            if (_isTyping)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Row(
                  children: [
                    _typingDot(0),
                    _typingDot(1),
                    _typingDot(2),
                  ],
                ),
              ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: AppColors.darkBg,
                border: Border(top: BorderSide(color: Colors.white.withValues(alpha: 0.05))),
              ),
              child: Column(
                children: [
                  if (_messages.isEmpty)
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        _quickActionChip('Go Home', Icons.home),
                        _quickActionChip('Explore Bikes', Icons.search),
                        _quickActionChip('Scan QR', Icons.qr_code_scanner),
                        _quickActionChip('My Bookings', Icons.calendar_month),
                        _quickActionChip('Search Sport', Icons.sports_motorsports),
                      ],
                    ),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _messageController,
                          onSubmitted: (_) => _sendMessage(),
                          style: GoogleFonts.poppins(color: Colors.white, fontSize: 14),
                          decoration: InputDecoration(
                            hintText: 'Ask me anything...',
                            hintStyle: GoogleFonts.poppins(color: Colors.white38, fontSize: 13),
                            filled: true,
                            fillColor: AppColors.darkBg.withValues(alpha: 0.5),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(24),
                              borderSide: BorderSide.none,
                            ),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        decoration: const BoxDecoration(
                          color: Color(0xFF00C2CB),
                          shape: BoxShape.circle,
                        ),
                        child: IconButton(
                          onPressed: _sendMessage,
                          icon: const Icon(Icons.send_rounded, color: Colors.black, size: 20),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _typingDot(int index) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 600),
      margin: EdgeInsets.only(left: index == 0 ? 0 : 4),
      width: 8,
      height: 8,
      decoration: BoxDecoration(
        color: Colors.white38,
        shape: BoxShape.circle,
      ),
    );
  }

  Widget _buildMessageBubble(ChatMessage message) {
    return Align(
      alignment: message.isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.75,
        ),
        decoration: BoxDecoration(
          color: message.isUser ? const Color(0xFF00C2CB) : const Color(0xFF2A2A2A),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Text(
          message.text,
          style: GoogleFonts.poppins(
            color: message.isUser ? Colors.black : Colors.white,
            fontSize: 13,
          ),
        ),
      ),
    );
  }

  Widget _quickActionChip(String label, IconData icon) {
    return ActionChip(
      onPressed: () => _quickAction(label),
      avatar: Icon(icon, size: 18, color: const Color(0xFF00C2CB)),
      label: Text(
        label,
        style: GoogleFonts.poppins(
          color: Colors.white,
          fontSize: 11,
          fontWeight: FontWeight.w600,
        ),
      ),
      backgroundColor: const Color(0xFF1A1A1A),
      side: const BorderSide(color: Colors.white10),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
    );
  }
}