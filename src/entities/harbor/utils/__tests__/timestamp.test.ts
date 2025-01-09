import { ethers } from 'ethers';
import { getTimestampFromBlockHash } from '../timestamp';

// Mocking ethers
jest.mock('ethers');

describe('getTimestampFromBlockHash', () => {
  it('should return the timestamp from the block', async () => {
    const mockBlock = { timestamp: 1633072800 }; // Example timestamp
    const mockProvider = {
      getBlock: jest.fn().mockResolvedValue(mockBlock)
    };
    (
      ethers.providers.JsonRpcProvider as unknown as jest.Mock
    ).mockImplementation(() => mockProvider);

    const transaction = { blockNumber: 12345 };
    // @ts-ignore
    const timestamp = await getTimestampFromBlockHash(transaction);

    expect(timestamp).toBe(mockBlock.timestamp);
    expect(mockProvider.getBlock).toHaveBeenCalledWith(transaction.blockNumber);
  });

  it('should return undefined if transaction is null', async () => {
    const timestamp = await getTimestampFromBlockHash(null);
    expect(timestamp).toBeUndefined();
  });
});
