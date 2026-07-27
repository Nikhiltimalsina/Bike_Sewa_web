import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../services/bike.service', () => ({
  default: {
    getAllBikes: vi.fn(),
    getAvailableBikes: vi.fn(),
    getBikeById: vi.fn(),
    searchBikes: vi.fn(),
    getBikesByLocation: vi.fn(),
    rentBike: vi.fn(),
    returnBike: vi.fn(),
    createBike: vi.fn(),
    updateBike: vi.fn(),
    deleteBike: vi.fn(),
  },
}));

import bikeController from '../bike.controller';
import bikeService from '../../services/bike.service';

describe('bikeController', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReq = { params: {}, query: {}, body: {} };
    mockRes = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    mockNext = vi.fn();
  });

  it('getAllBikes should return bikes', async () => {
    vi.mocked(bikeService.getAllBikes).mockResolvedValue([] as any);
    await bikeController.getAllBikes(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('getBikeById should return a bike', async () => {
    mockReq.params = { id: 'bike1' };
    vi.mocked(bikeService.getBikeById).mockResolvedValue({} as any);
    await bikeController.getBikeById(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('searchBikes should search', async () => {
    mockReq.query = { q: 'Yamaha' };
    vi.mocked(bikeService.searchBikes).mockResolvedValue([] as any);
    await bikeController.searchBikes(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('adminCreateBike should create', async () => {
    vi.mocked(bikeService.createBike).mockResolvedValue({ _id: 'b1', name: 'Test Bike', modelName: 'M1', location: 'Loc', latitude: 1, longitude: 2, pricePerHour: 100 } as any);
    mockReq.body = { name: 'Test Bike', modelName: 'M1', location: 'Loc', latitude: '1', longitude: '2', pricePerHour: '100' };
    await bikeController.adminCreateBike(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(201);
  });

  it('adminUpdateBike should update', async () => {
    mockReq.params = { id: 'bike1' };
    vi.mocked(bikeService.updateBike).mockResolvedValue({} as any);
    await bikeController.adminUpdateBike(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('adminDeleteBike should delete', async () => {
    mockReq.params = { id: 'bike1' };
    vi.mocked(bikeService.deleteBike).mockResolvedValue({} as any);
    await bikeController.adminDeleteBike(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});
