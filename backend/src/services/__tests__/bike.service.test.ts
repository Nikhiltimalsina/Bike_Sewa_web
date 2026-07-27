import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../repositories/bike.repository', () => ({
  default: {
    findAll: vi.fn(),
    findAvailable: vi.fn(),
    findById: vi.fn(),
    search: vi.fn(),
    findByLocation: vi.fn(),
    setAvailability: vi.fn(),
    create: vi.fn(),
    updateById: vi.fn(),
    deleteById: vi.fn(),
    countAll: vi.fn(),
  },
}));

import bikeService from '../bike.service';
import bikeRepository from '../../repositories/bike.repository';

const mockBike = {
  _id: 'bike1',
  name: 'Yamaha MT-15',
  modelName: 'MT-15',
  location: 'Kathmandu',
  latitude: 27.7,
  longitude: 85.3,
  pricePerHour: 500,
  imageUrl: '/images/mt15.jpeg',
  isAvailable: true,
};

describe('BikeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllBikes', () => {
    it('should return all bikes', async () => {
      vi.mocked(bikeRepository.findAll).mockResolvedValue([mockBike] as any);
      const bikes = await bikeService.getAllBikes();
      expect(bikes).toHaveLength(1);
    });
  });

  describe('getAvailableBikes', () => {
    it('should return available bikes only', async () => {
      vi.mocked(bikeRepository.findAvailable).mockResolvedValue([mockBike] as any);
      const bikes = await bikeService.getAvailableBikes();
      expect(bikes).toHaveLength(1);
    });
  });

  describe('getBikeById', () => {
    it('should return bike by id', async () => {
      vi.mocked(bikeRepository.findById).mockResolvedValue(mockBike as any);
      const bike = await bikeService.getBikeById('bike1');
      expect(bike.name).toBe('Yamaha MT-15');
    });

    it('should throw if bike not found', async () => {
      vi.mocked(bikeRepository.findById).mockResolvedValue(null);
      await expect(bikeService.getBikeById('nonexistent')).rejects.toThrow('Bike not found');
    });
  });

  describe('searchBikes', () => {
    it('should search bikes by query', async () => {
      vi.mocked(bikeRepository.search).mockResolvedValue([mockBike] as any);
      const bikes = await bikeService.searchBikes('Yamaha');
      expect(bikes).toHaveLength(1);
    });

    it('should return all bikes for empty query', async () => {
      vi.mocked(bikeRepository.findAll).mockResolvedValue([mockBike] as any);
      const bikes = await bikeService.searchBikes('');
      expect(bikes).toHaveLength(1);
    });
  });

  describe('getBikesByLocation', () => {
    it('should return bikes by location', async () => {
      vi.mocked(bikeRepository.findByLocation).mockResolvedValue([mockBike] as any);
      const bikes = await bikeService.getBikesByLocation('Kathmandu');
      expect(bikes).toHaveLength(1);
    });

    it('should throw if location is empty', async () => {
      await expect(bikeService.getBikesByLocation('')).rejects.toThrow('Location is required');
    });
  });

  describe('rentBike', () => {
    it('should rent an available bike', async () => {
      vi.mocked(bikeRepository.findById).mockResolvedValue(mockBike as any);
      vi.mocked(bikeRepository.setAvailability).mockResolvedValue({ ...mockBike, isAvailable: false } as any);
      const bike = await bikeService.rentBike('bike1');
      expect(bikeRepository.setAvailability).toHaveBeenCalledWith('bike1', false);
    });

    it('should throw if bike not found', async () => {
      vi.mocked(bikeRepository.findById).mockResolvedValue(null);
      await expect(bikeService.rentBike('nonexistent')).rejects.toThrow('Bike not found');
    });

    it('should throw if bike is already rented', async () => {
      vi.mocked(bikeRepository.findById).mockResolvedValue({ ...mockBike, isAvailable: false } as any);
      await expect(bikeService.rentBike('bike1')).rejects.toThrow('Bike is already rented');
    });
  });

  describe('returnBike', () => {
    it('should return a rented bike', async () => {
      vi.mocked(bikeRepository.findById).mockResolvedValue(mockBike as any);
      vi.mocked(bikeRepository.setAvailability).mockResolvedValue({ ...mockBike, isAvailable: true } as any);
      const bike = await bikeService.returnBike('bike1');
      expect(bikeRepository.setAvailability).toHaveBeenCalledWith('bike1', true);
    });
  });

  describe('admin: createBike', () => {
    it('should create a new bike', async () => {
      vi.mocked(bikeRepository.create).mockResolvedValue(mockBike as any);
      const bike = await bikeService.createBike({
        name: 'Yamaha MT-15',
        modelName: 'MT-15',
        location: 'Kathmandu',
        latitude: 27.7,
        longitude: 85.3,
        pricePerHour: 500,
      });
      expect(bike.name).toBe('Yamaha MT-15');
    });
  });

  describe('admin: updateBike', () => {
    it('should update a bike', async () => {
      vi.mocked(bikeRepository.updateById).mockResolvedValue({ ...mockBike, pricePerHour: 600 } as any);
      const bike = await bikeService.updateBike('bike1', { pricePerHour: 600 });
      expect(bike.pricePerHour).toBe(600);
    });

    it('should throw if bike not found', async () => {
      vi.mocked(bikeRepository.updateById).mockResolvedValue(null);
      await expect(bikeService.updateBike('nonexistent', { name: 'Test' })).rejects.toThrow('Bike not found');
    });
  });

  describe('admin: deleteBike', () => {
    it('should delete a bike', async () => {
      vi.mocked(bikeRepository.deleteById).mockResolvedValue(mockBike as any);
      await expect(bikeService.deleteBike('bike1')).resolves.not.toThrow();
    });

    it('should throw if bike not found', async () => {
      vi.mocked(bikeRepository.deleteById).mockResolvedValue(null);
      await expect(bikeService.deleteBike('nonexistent')).rejects.toThrow('Bike not found');
    });
  });
});

