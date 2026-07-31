import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../app/routes/app_routes.dart';
import '../../../../core/constants/color_constants.dart';
import '../../domain/entities/bike_entity.dart';
import '../providers/dashboard_provider.dart';
import '../../presentation/pages/bike_detail_view.dart';
import '../widgets/bike_image_widget.dart';

enum SortOption { nameAsc, priceAsc, priceDesc, newest }

class ExploreView extends ConsumerStatefulWidget {
  const ExploreView({super.key});

  @override
  ConsumerState<ExploreView> createState() => _ExploreViewState();
}

class _ExploreViewState extends ConsumerState<ExploreView> {
  bool _availableOnly = false;
  String _selectedCategory = 'All';
  SortOption _sortOption = SortOption.newest;
  final _searchController = TextEditingController();

  static const List<String> _categories = [
    'All',
    'Sport',
    'Cruiser',
    'Commuter',
    'Adventure',
    'Naked',
  ];

  @override
  void initState() {
    super.initState();
    Future.microtask(
      () => ref.read(bikesListProvider.notifier).loadAllBikes(),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  bool get _hasActiveFilters =>
      _availableOnly || _selectedCategory != 'All' || _searchController.text.isNotEmpty;

  void _applyFilters() {
    final notifier = ref.read(bikesListProvider.notifier);
    final query = _searchController.text.trim();
    if (query.isNotEmpty) {
      notifier.searchBikes(query);
    } else {
      notifier.loadAllBikes();
    }
  }

  void _onCategorySelected(String category) {
    setState(() => _selectedCategory = category);
    _applyFilters();
  }

  void _onSortChanged(SortOption? value) {
    if (value == null) return;
    setState(() => _sortOption = value);
    _applyFilters();
  }

  void _clearFilters() {
    setState(() {
      _availableOnly = false;
      _selectedCategory = 'All';
      _sortOption = SortOption.newest;
      _searchController.clear();
    });
    ref.read(bikesListProvider.notifier).loadAllBikes();
  }

  List<BikeEntity> _applySort(List<BikeEntity> bikes) {
    final list = List<BikeEntity>.from(bikes);
    switch (_sortOption) {
      case SortOption.nameAsc:
        list.sort((a, b) => a.name.compareTo(b.name));
        break;
      case SortOption.priceAsc:
        list.sort((a, b) => a.pricePerHour.compareTo(b.pricePerHour));
        break;
      case SortOption.priceDesc:
        list.sort((a, b) => b.pricePerHour.compareTo(a.pricePerHour));
        break;
      case SortOption.newest:
        break;
    }
    return list;
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(bikesListProvider);

    return SafeArea(
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    'Explore Bikes',
                    style: GoogleFonts.poppins(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                FilterChip(
                  label: Text(
                    'Available only',
                    style: GoogleFonts.poppins(
                      color: _availableOnly ? Colors.black : Colors.white70,
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  selected: _availableOnly,
                  onSelected: (value) {
                    setState(() => _availableOnly = value);
                    final notifier = ref.read(bikesListProvider.notifier);
                    if (value) {
                      notifier.loadAvailableBikes();
                    } else {
                      _applyFilters();
                    }
                  },
                  backgroundColor: AppColors.cardBg,
                  selectedColor: AppColors.cyan,
                  checkmarkColor: Colors.black,
                  side: BorderSide(
                    color: _availableOnly ? AppColors.cyan : Colors.white10,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
                const SizedBox(width: 8),
                if (_hasActiveFilters)
                  TextButton.icon(
                    onPressed: _clearFilters,
                    icon: const Icon(Icons.clear_all_rounded, size: 16, color: Color(0xFF00C2CB)),
                    label: Text(
                      'Clear',
                      style: GoogleFonts.poppins(
                        color: const Color(0xFF00C2CB),
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Search bar
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 0),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    height: 46,
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    decoration: BoxDecoration(
                      color: AppColors.cardBg,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.white10),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.search, color: Colors.white38, size: 18),
                        const SizedBox(width: 10),
                        Expanded(
                          child: TextField(
                            controller: _searchController,
                            onSubmitted: (_) => _applyFilters(),
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontSize: 13,
                            ),
                            decoration: InputDecoration(
                              hintText: 'Search by model or location',
                              hintStyle: GoogleFonts.poppins(
                                color: Colors.white38,
                                fontSize: 13,
                              ),
                              border: InputBorder.none,
                              isDense: true,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  onPressed: _applyFilters,
                  icon: const Icon(Icons.search_rounded, color: Color(0xFF00C2CB)),
                  tooltip: 'Search',
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Category chips + Sort
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 0),
            child: Row(
              children: [
                Expanded(
                  child: SizedBox(
                    height: 36,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _categories.length,
                      itemBuilder: (context, index) {
                        final cat = _categories[index];
                        final isSelected = _selectedCategory == cat;
                        return Padding(
                          padding: EdgeInsets.only(right: index < _categories.length - 1 ? 8 : 0),
                          child: FilterChip(
                            label: Text(
                              cat,
                              style: GoogleFonts.poppins(
                                color: isSelected ? Colors.black : Colors.white70,
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            selected: isSelected,
                            onSelected: (_) => _onCategorySelected(cat),
                            backgroundColor: AppColors.cardBg,
                            selectedColor: AppColors.cyan,
                            checkmarkColor: Colors.black,
                            side: BorderSide(
                              color: isSelected ? AppColors.cyan : Colors.white10,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                PopupMenuButton<SortOption>(
                  icon: const Icon(Icons.sort_rounded, color: Colors.white70, size: 20),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  color: AppColors.cardBg,
                  onSelected: _onSortChanged,
                  itemBuilder: (context) => [
                    PopupMenuItem(
                      value: SortOption.nameAsc,
                      child: Text('Name A-Z', style: GoogleFonts.poppins(fontSize: 13)),
                    ),
                    PopupMenuItem(
                      value: SortOption.priceAsc,
                      child: Text('Price: Low to High', style: GoogleFonts.poppins(fontSize: 13)),
                    ),
                    PopupMenuItem(
                      value: SortOption.priceDesc,
                      child: Text('Price: High to Low', style: GoogleFonts.poppins(fontSize: 13)),
                    ),
                    PopupMenuItem(
                      value: SortOption.newest,
                      child: Text('Newest First', style: GoogleFonts.poppins(fontSize: 13)),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          Expanded(
            child: RefreshIndicator(
              color: AppColors.cyan,
              backgroundColor: AppColors.cardBg,
              onRefresh: () async {
                final notifier = ref.read(bikesListProvider.notifier);
                if (_availableOnly) {
                  await notifier.loadAvailableBikes();
                } else {
                  await notifier.loadAllBikes();
                }
              },
              child: _buildBody(state),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBody(BikesListState state) {
    final bikes = switch (state) {
      BikesListLoaded(:final bikes) => _applySort(bikes),
      _ => const <BikeEntity>[],
    };

    final filtered = _selectedCategory == 'All'
        ? bikes
        : bikes.where((b) => b.model.toLowerCase() == _selectedCategory.toLowerCase()).toList();

    return switch (state) {
      BikesListInitial() || BikesListLoading() => const Center(
        child: CircularProgressIndicator(color: AppColors.cyan),
      ),
      BikesListFailure(:final message) => Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Text(
            message,
            textAlign: TextAlign.center,
            style: GoogleFonts.poppins(color: Colors.white54, fontSize: 13),
          ),
        ),
      ),
      BikesListLoaded() when filtered.isEmpty => Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Text(
            _hasActiveFilters ? 'No bikes match your filters' : 'No bikes found',
            textAlign: TextAlign.center,
            style: GoogleFonts.poppins(color: Colors.white54, fontSize: 13),
          ),
        ),
      ),
      BikesListLoaded() => GridView.builder(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 100),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          mainAxisSpacing: 14,
          crossAxisSpacing: 14,
          childAspectRatio: 0.72,
        ),
        itemCount: filtered.length,
        itemBuilder: (context, i) => _BikeGridCard(bike: filtered[i]),
      ),
    };
  }
}

class _BikeGridCard extends StatelessWidget {
  final BikeEntity bike;
  const _BikeGridCard({required this.bike});

  @override
  Widget build(BuildContext context) {
    final statusColor = bike.isAvailable ? AppColors.success : Colors.white24;

    return InkWell(
      onTap: bike.isAvailable
          ? () => AppRoutes.push(
                context,
                BikeDetailView(
                  id: bike.id,
                  name: bike.name,
                  model: bike.model,
                  pricePerHour: bike.pricePerHour,
                  imageUrl: bike.imageUrl,
                  location: bike.location,
                ),
              )
          : null,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.cardBg,
          borderRadius: BorderRadius.circular(16),
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Stack(
                fit: StackFit.expand,
                children: [
                  BikeImage(
                    imageUrl: bike.imageUrl,
                    fit: BoxFit.cover,
                  ),
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: statusColor,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${bike.name} ${bike.model}',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.poppins(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Rs. ${bike.pricePerHour.toStringAsFixed(0)}/hr',
                    style: GoogleFonts.poppins(
                      color: AppColors.cyan,
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      const Icon(
                        Icons.location_on_outlined,
                        size: 11,
                        color: Colors.white38,
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          bike.location,
                          style: GoogleFonts.poppins(
                            color: Colors.white54,
                            fontSize: 10,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
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
}
