import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:permission_handler/permission_handler.dart';
import '../../../../app/routes/app_routes.dart';
import '../../../../core/constants/color_constants.dart';
import '../../domain/entities/bike_entity.dart';
import '../providers/dashboard_provider.dart';
import '../../presentation/pages/booking_view.dart';

class ScanView extends ConsumerStatefulWidget {
  const ScanView({super.key});

  @override
  ConsumerState<ScanView> createState() => _ScanViewState();
}

class _ScanViewState extends ConsumerState<ScanView>
    with SingleTickerProviderStateMixin {
  late AnimationController _scanController;
  final MobileScannerController _scannerController = MobileScannerController();
  bool _hasCameraPermission = false;
  bool _isPermissionChecking = true;
  bool _isProcessingScan = false;
  String? _permissionError;

  @override
  void initState() {
    super.initState();
    _scanController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    _requestCameraPermission();
  }

  Future<void> _requestCameraPermission() async {
    setState(() {
      _isPermissionChecking = true;
      _permissionError = null;
    });

    final status = await Permission.camera.request();
    if (status.isGranted) {
      if (mounted) {
        setState(() {
          _hasCameraPermission = true;
          _isPermissionChecking = false;
        });
      }
    } else if (status.isPermanentlyDenied) {
      if (mounted) {
        setState(() {
          _hasCameraPermission = false;
          _isPermissionChecking = false;
          _permissionError = 'Camera permission permanently denied. Please enable it in Settings.';
        });
      }
    } else {
      if (mounted) {
        setState(() {
          _hasCameraPermission = false;
          _isPermissionChecking = false;
          _permissionError = 'Camera permission is required to scan QR codes.';
        });
      }
    }
  }

  @override
  void dispose() {
    _scanController.dispose();
    _scannerController.dispose();
    super.dispose();
  }

  Future<void> _handleScannedValue(String barcodeValue) async {
    if (_isProcessingScan) return;
    _isProcessingScan = true;

    // Fetch dynamic bikes from repository layer
    await ref.read(bikesListProvider.notifier).loadAllBikes();
    final state = ref.read(bikesListProvider);

    List<BikeEntity> availableBikes = [];
    if (state is BikesListLoaded) {
      availableBikes = state.bikes;
    }

    if (availableBikes.isEmpty) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No bikes currently loaded from repository')),
        );
        _isProcessingScan = false;
      }
      return;
    }

    // Match scanned value against bike ID, or fallback to first bike
    final matchedBike = availableBikes.firstWhere(
      (b) => b.id == barcodeValue || barcodeValue.contains(b.id),
      orElse: () => availableBikes.first,
    );

    if (mounted) {
      _showScanResult(matchedBike);
    }
    _isProcessingScan = false;
  }

  void _showScanResult(BikeEntity bike) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) {
        return Padding(
          padding: EdgeInsets.fromLTRB(
            20,
            20,
            20,
            MediaQuery.of(context).padding.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: AppColors.white10,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppColors.success.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(
                      Icons.qr_code_scanner_rounded,
                      color: AppColors.success,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'QR Code Scanned',
                          style: GoogleFonts.poppins(
                            color: AppColors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${bike.name} ${bike.model}',
                          style: GoogleFonts.poppins(
                            color: AppColors.cyan,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.darkBg,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.location_on_outlined,
                      color: AppColors.cyan,
                      size: 16,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        bike.location.isEmpty ? 'Kathmandu, Nepal' : bike.location,
                        style: GoogleFonts.poppins(
                          color: AppColors.white,
                          fontSize: 12,
                        ),
                      ),
                    ),
                    Text(
                      'Rs. ${bike.pricePerHour.toStringAsFixed(0)}/hr',
                      style: GoogleFonts.poppins(
                        color: AppColors.cyan,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => BookingView(
                          id: bike.id,
                          name: bike.name,
                          model: bike.model,
                          pricePerHour: bike.pricePerHour,
                          imageUrl: bike.imageUrl,
                        ),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.cyan,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    'Book This Bike',
                    style: GoogleFonts.poppins(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 10),
              SizedBox(
                width: double.infinity,
                child: TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text(
                    'Close',
                    style: GoogleFonts.poppins(
                      color: AppColors.white54,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: AppBar(
        backgroundColor: AppColors.cardBg,
        elevation: 0,
        centerTitle: true,
        title: Text(
          'Scan QR Code',
          style: GoogleFonts.poppins(
            color: AppColors.white,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        leading: IconButton(
          onPressed: () => AppRoutes.pop(context),
          icon: const Icon(Icons.close_rounded, color: AppColors.white),
        ),
      ),
      body: Column(
        children: [
          Expanded(child: _buildScannerArea(context)),
          _buildBottomControls(context),
          const SizedBox(height: 16),
          SizedBox(height: MediaQuery.of(context).padding.bottom + 12),
        ],
      ),
    );
  }

  Widget _buildScannerArea(BuildContext context) {
    if (_isPermissionChecking) {
      return const Center(
        child: CircularProgressIndicator(color: AppColors.cyan),
      );
    }

    if (!_hasCameraPermission) {
      return Container(
        margin: const EdgeInsets.all(20),
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: AppColors.cardBg,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.camera_alt_outlined,
              size: 56,
              color: AppColors.white38,
            ),
            const SizedBox(height: 16),
            Text(
              'Camera Permission Required',
              style: GoogleFonts.poppins(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              _permissionError ?? 'Please grant camera permission to scan QR codes.',
              textAlign: TextAlign.center,
              style: GoogleFonts.poppins(
                color: Colors.white54,
                fontSize: 13,
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: openAppSettings,
              icon: const Icon(Icons.settings, size: 18),
              label: Text(
                'Open Settings',
                style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.cyan,
                foregroundColor: Colors.black,
              ),
            ),
          ],
        ),
      );
    }

    return Stack(
      children: [
        Container(
          margin: const EdgeInsets.fromLTRB(20, 20, 20, 12),
          decoration: BoxDecoration(
            color: AppColors.cardBg,
            borderRadius: BorderRadius.circular(16),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: MobileScanner(
              controller: _scannerController,
              onDetect: (capture) {
                final List<Barcode> barcodes = capture.barcodes;
                for (final barcode in barcodes) {
                  final String? val = barcode.rawValue;
                  if (val != null && val.isNotEmpty) {
                    _handleScannedValue(val);
                    break;
                  }
                }
              },
            ),
          ),
        ),
        Positioned.fill(
          child: IgnorePointer(
            child: CustomPaint(
              painter: _ScanOverlayPainter(),
              size: Size.infinite,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildBottomControls(BuildContext context) {
    return Column(
      children: [
        ElevatedButton.icon(
          onPressed: () => _handleScannedValue('bike-001'),
          icon: const Icon(Icons.qr_code_2, size: 20),
          label: Text(
            'Simulate Scan (Repository Bike)',
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.cyan,
            foregroundColor: Colors.black,
            padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
      ],
    );
  }
}

class _ScanOverlayPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final borderPaint = Paint()
      ..color = AppColors.cyan
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;

    final center = Offset(size.width / 2, size.height / 2);
    final rectSize = size.width * 0.55;
    final rect = Rect.fromCenter(
      center: center,
      width: rectSize,
      height: rectSize,
    );
    final rRect = RRect.fromRectAndRadius(rect, const Radius.circular(16));

    canvas.drawRRect(rRect, borderPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
