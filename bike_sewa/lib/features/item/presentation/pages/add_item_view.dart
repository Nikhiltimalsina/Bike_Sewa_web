import 'dart:io';
import 'dart:typed_data';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:uuid/uuid.dart';
import 'package:video_thumbnail/video_thumbnail.dart';

import '../../../../core/constants/color_constants.dart';
import '../../data/datasources/item_datasource_provider.dart';
import '../../domain/entities/item_entity.dart';
import '../../domain/usecases/item_usecases.dart';
import '../providers/item_provider.dart';

// Export providers for use in view
export '../../data/datasources/item_datasource_provider.dart';

class AddItemView extends ConsumerStatefulWidget {
  const AddItemView({super.key});

  @override
  ConsumerState<AddItemView> createState() => _AddItemViewState();
}

class _AddItemViewState extends ConsumerState<AddItemView> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _requirementsController = TextEditingController();
  final _categoryController = TextEditingController();
  final _locationController = TextEditingController();
  final _priceController = TextEditingController();
  final _uuid = const Uuid();

  String? _imagePath;
  String? _videoPath;
  bool _isPickingImage = false;
  bool _isPickingVideo = false;
  bool _isSubmitting = false;

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _requirementsController.dispose();
    _categoryController.dispose();
    _locationController.dispose();
    _priceController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkBg,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(),
              const SizedBox(height: 18),
              _buildFormCard(),
              const SizedBox(height: 16),
              _buildMediaCard(),
              const SizedBox(height: 22),
              _buildSubmitButton(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      children: [
        IconButton(
          onPressed: () => Navigator.pop(context),
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
          padding: EdgeInsets.zero,
          constraints: const BoxConstraints(),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Add Item',
                style: GoogleFonts.poppins(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                ),
              ),
              Text(
                'Upload media and add item details',
                style: GoogleFonts.poppins(color: Colors.white54, fontSize: 12),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildFormCard() {
    return Form(
      key: _formKey,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.cardBg,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: Colors.white10),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildTextField(
              controller: _titleController,
              label: 'Title',
              hint: 'Enter item title',
              icon: Icons.title,
              validator: (value) => value == null || value.trim().isEmpty
                  ? 'Title is required'
                  : null,
            ),
            const SizedBox(height: 14),
            _buildTextField(
              controller: _descriptionController,
              label: 'Description',
              hint: 'Describe your item',
              icon: Icons.description_outlined,
              minLines: 4,
              maxLines: 6,
              validator: (value) => value == null || value.trim().isEmpty
                  ? 'Description is required'
                  : null,
            ),
            const SizedBox(height: 14),
            _buildTextField(
              controller: _requirementsController,
              label: 'Requirements',
              hint: 'Documents, deposit, age, license, or other requirements',
              icon: Icons.list_alt_outlined,
              minLines: 3,
              maxLines: 5,
              validator: (value) => value == null || value.trim().isEmpty
                  ? 'Requirements are required'
                  : null,
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: _buildTextField(
                    controller: _categoryController,
                    label: 'Category',
                    hint: 'Bike, scooter, camera...',
                    icon: Icons.category_outlined,
                    validator: (value) => value == null || value.trim().isEmpty
                        ? 'Category is required'
                        : null,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildTextField(
                    controller: _locationController,
                    label: 'Location',
                    hint: 'Thamel, Kathmandu',
                    icon: Icons.location_on_outlined,
                    validator: (value) => value == null || value.trim().isEmpty
                        ? 'Location is required'
                        : null,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            _buildTextField(
              controller: _priceController,
              label: 'Price per day',
              hint: 'Rs. 500',
              icon: Icons.currency_rupee,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Price is required';
                }

                final price = double.tryParse(value.trim());
                if (price == null || price <= 0) {
                  return 'Enter a valid price';
                }

                return null;
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    int? minLines,
    int? maxLines,
    TextInputType? keyboardType,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.poppins(
            color: Colors.white,
            fontSize: 12,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          minLines: minLines,
          maxLines: maxLines ?? 1,
          keyboardType: keyboardType,
          textCapitalization: TextCapitalization.sentences,
          style: GoogleFonts.poppins(color: Colors.white, fontSize: 13),
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: Icon(icon, color: Colors.white38, size: 18),
            hintStyle: GoogleFonts.poppins(color: Colors.white38, fontSize: 13),
            filled: true,
            fillColor: AppColors.darkBg,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.white12),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.white12),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppColors.cyan),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppColors.error),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppColors.error),
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 12,
              vertical: 13,
            ),
          ),
          validator: validator,
        ),
      ],
    );
  }

  Widget _buildMediaCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Media Upload',
            style: GoogleFonts.poppins(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Upload at least one image or video for your item',
            style: GoogleFonts.poppins(color: Colors.white54, fontSize: 12),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: _MediaPickerCard(
                  title: 'Image',
                  subtitle: _imagePath == null
                      ? 'Pick JPG or PNG'
                      : _fileName(_imagePath!),
                  icon: Icons.photo_camera_outlined,
                  isLoading: _isPickingImage,
                  onTap: _pickImage,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _MediaPickerCard(
                  title: 'Video',
                  subtitle: _videoPath == null
                      ? 'Pick MP4 or MOV'
                      : _fileName(_videoPath!),
                  icon: Icons.videocam_outlined,
                  isLoading: _isPickingVideo,
                  onTap: _pickVideo,
                ),
              ),
            ],
          ),
          if (_imagePath != null || _videoPath != null)
            ..._buildSelectedMedia(),
        ],
      ),
    );
  }

  List<Widget> _buildSelectedMedia() {
    final widgets = <Widget>[];

    if (_imagePath != null) {
      widgets.add(
        Padding(
          padding: const EdgeInsets.only(top: 16),
          child: _SelectedMedia(
            path: _imagePath!,
            label: 'Image',
            icon: Icons.image,
            onRemove: () => setState(() => _imagePath = null),
          ),
        ),
      );
    }

    if (_videoPath != null) {
      widgets.add(
        Padding(
          padding: const EdgeInsets.only(top: 16),
          child: _SelectedMedia(
            path: _videoPath!,
            label: 'Video',
            icon: Icons.video_file,
            onRemove: () => setState(() => _videoPath = null),
          ),
        ),
      );
    }

    return widgets;
  }

  Widget _buildSubmitButton() {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: ElevatedButton(
        onPressed: _isSubmitting ? null : _submit,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.cyan,
          foregroundColor: Colors.black,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
        ),
        child: _isSubmitting
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  color: Colors.black,
                  strokeWidth: 2,
                ),
              )
            : Text(
                'Upload & Add Item',
                style: GoogleFonts.poppins(
                  color: Colors.black,
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                ),
              ),
      ),
    );
  }

  Future<void> _pickImage() async {
    setState(() => _isPickingImage = true);

    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.image,
        allowMultiple: false,
      );

      if (result != null && result.files.single.path != null && mounted) {
        setState(() => _imagePath = result.files.single.path!);
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Unable to pick image: $error')));
      }
    } finally {
      if (mounted) {
        setState(() => _isPickingImage = false);
      }
    }
  }

  Future<void> _pickVideo() async {
    setState(() => _isPickingVideo = true);

    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.video,
        allowMultiple: false,
      );

      if (result != null && result.files.single.path != null && mounted) {
        setState(() => _videoPath = result.files.single.path!);
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Unable to pick video: $error')));
      }
    } finally {
      if (mounted) {
        setState(() => _isPickingVideo = false);
      }
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    if (_imagePath == null && _videoPath == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please upload an image or video')),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      final usecase = ref.read(createItemUsecaseProvider);
      
      final result = await usecase(
        CreateItemUsecaseParams(
          title: _titleController.text.trim(),
          description: _descriptionController.text.trim(),
          requirements: _requirementsController.text.trim(),
          category: _categoryController.text.trim(),
          location: _locationController.text.trim(),
          pricePerDay: double.parse(_priceController.text.trim()),
          imagePath: _imagePath,
          videoPath: _videoPath,
        ),
      );

      result.fold(
        (failure) {
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(failure.message)),
          );
        },
        (item) {
          ref.read(itemListProvider.notifier).addItem(item);
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Item uploaded successfully')),
          );
          Navigator.pop(context, true);
        },
      );
    } catch (e) {
      if (!mounted) return;
      // Fallback to local storage if server unavailable
      ref.read(itemListProvider.notifier).addItem(
        ItemEntity(
          id: _uuid.v4(),
          title: _titleController.text.trim(),
          description: _descriptionController.text.trim(),
          requirements: _requirementsController.text.trim(),
          category: _categoryController.text.trim(),
          location: _locationController.text.trim(),
          pricePerDay: double.parse(_priceController.text.trim()),
          imagePath: _imagePath,
          videoPath: _videoPath,
        ),
      );
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Item saved locally: $e')),
      );
      Navigator.pop(context, true);
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  String _fileName(String path) {
    return path.replaceAll(r'\', '/').split('/').last;
  }
}

class _MediaPickerCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final bool isLoading;
  final VoidCallback onTap;

  const _MediaPickerCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.isLoading,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: isLoading ? null : onTap,
      child: Container(
        height: 92,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.darkBg,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.white12),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (isLoading)
              const SizedBox(
                width: 22,
                height: 22,
                child: CircularProgressIndicator(
                  color: AppColors.cyan,
                  strokeWidth: 2,
                ),
              )
            else
              Icon(icon, color: AppColors.cyan, size: 26),
            const SizedBox(height: 8),
            Text(
              title,
              style: GoogleFonts.poppins(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              style: GoogleFonts.poppins(color: Colors.white54, fontSize: 10),
            ),
          ],
        ),
      ),
    );
  }
}

class _SelectedMedia extends StatelessWidget {
  final String path;
  final String label;
  final IconData icon;
  final VoidCallback onRemove;

  const _SelectedMedia({
    required this.path,
    required this.label,
    required this.icon,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(14),
          child: SizedBox(
            height: 160,
            child: label == 'Image'
                ? Image.file(
                    File(path),
                    fit: BoxFit.cover,
                    width: double.infinity,
                    errorBuilder: (_, _, _) => _MediaPlaceholder(icon: icon),
                  )
                : _VideoPreview(path: path),
          ),
        ),
        Positioned(
          top: 8,
          right: 8,
          child: Material(
            color: Colors.black54,
            shape: const CircleBorder(),
            child: IconButton(
              onPressed: onRemove,
              icon: const Icon(Icons.close, color: Colors.white, size: 18),
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(minWidth: 30, minHeight: 30),
            ),
          ),
        ),
      ],
    );
  }
}

class _VideoPreview extends StatefulWidget {
  final String path;

  const _VideoPreview({required this.path});

  @override
  State<_VideoPreview> createState() => _VideoPreviewState();
}

class _VideoPreviewState extends State<_VideoPreview> {
  Uint8List? _thumbnail;

  @override
  void initState() {
    super.initState();
    _loadThumbnail();
  }

  Future<void> _loadThumbnail() async {
    try {
      final data = await VideoThumbnail.thumbnailData(
        video: widget.path,
        imageFormat: ImageFormat.PNG,
        maxWidth: 220,
        quality: 35,
      );

      if (mounted && data != null) {
        setState(() => _thumbnail = data);
      }
    } catch (_) {
      return;
    }
  }

  @override
  Widget build(BuildContext context) {
    return _thumbnail == null
        ? const _MediaPlaceholder(icon: Icons.video_file)
        : Image.memory(_thumbnail!, fit: BoxFit.cover, width: double.infinity);
  }
}

class _MediaPlaceholder extends StatelessWidget {
  final IconData icon;

  const _MediaPlaceholder({required this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white10,
      child: Center(child: Icon(icon, color: Colors.white24, size: 44)),
    );
  }
}
