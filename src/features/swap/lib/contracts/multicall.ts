import { ethers } from 'ethers';
import Config from '@constants/config';
import {
  MULTICALL_ABI,
  MULTICALL_ADDRESSES
} from '@features/swap/lib/abi/MULTICALL';
import { SwapToken } from '@features/swap/types';
import { ERC20_ABI } from '@lib/erc20/abi/ERC20_ABI';
import { environment } from '@utils';

/**
 * PERFORMANCE OPTIMIZATION:
 *
 * This multicall implementation optimizes token balance loading in the application by:
 *
 * 1. REDUCED RPC CALLS: Instead of making an individual RPC call for each token's balance,
 *    we batch multiple queries into a single contract call
 *
 * 2. NETWORK EFFICIENCY: Significantly reduces network overhead and latency by reducing
 *    the number of separate HTTP requests
 *
 * 3. TRANSACTION BUNDLING: Allows for efficient querying of many token balances in a single transaction
 *
 * 4. ERROR HANDLING: Isolates failures to specific batches rather than failing the entire balance loading process
 *
 * The implementation is used in the useSwapAllBalances hook to improve loading performance.
 */

// Interface for multicall results
interface MulticallResult {
  blockNumber: ethers.BigNumber;
  returnData: string[];
}

/**
 * Creates a provider for querying the blockchain
 */
const createProvider = () => {
  return new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
};

/**
 * Creates a multicall contract instance for batch queries
 */
const createMulticallContract = () => {
  try {
    const provider = createProvider();

    const multicall =
      environment === 'testnet'
        ? MULTICALL_ADDRESSES.testnet
        : MULTICALL_ADDRESSES.prod;

    const multicallAddress = ethers.utils.getAddress(multicall);
    return new ethers.Contract(multicallAddress, MULTICALL_ABI, provider);
  } catch (error) {
    console.warn('Failed to create multicall contract:', error);
    return null;
  }
};

/**
 * Fetches a single token balance using standard RPC call
 * Used as fallback when multicall fails for a specific token
 */
const fetchSingleTokenBalance = async (
  token: SwapToken,
  ownerAddress: string
): Promise<ethers.BigNumber | null> => {
  try {
    const provider = createProvider();

    // Special handling for native token (address 0)
    if (token.address === ethers.constants.AddressZero) {
      return await provider.getBalance(ownerAddress);
    } else {
      // For ERC20 tokens
      const erc20Contract = new ethers.Contract(
        token.address,
        ERC20_ABI,
        provider
      );
      return await erc20Contract.balanceOf(ownerAddress);
    }
  } catch (error) {
    console.warn(`Failed to fetch balance for token ${token.address}:`, error);
    return null;
  }
};

/**
 * Batches multiple token balance queries into a single call
 * with fallback to individual queries if multicall fails
 * @param tokens List of tokens to query balances for
 * @param ownerAddress The address to check balances for
 * @returns An object mapping token addresses to their balances
 */
export const batchFetchTokenBalances = async (
  tokens: SwapToken[],
  ownerAddress: string
): Promise<Record<string, ethers.BigNumber>> => {
  const balances: Record<string, ethers.BigNumber> = {};

  try {
    const multicall = createMulticallContract();

    if (!multicall) {
      throw new Error('Multicall contract not available');
    }

    // Filter out native tokens (address zero) since they need special handling
    const erc20Tokens = tokens.filter(
      (token) => token.address !== ethers.constants.AddressZero
    );

    const nativeTokens = tokens.filter(
      (token) => token.address === ethers.constants.AddressZero
    );

    // Fetch native token balances individually
    for (const nativeToken of nativeTokens) {
      const balance = await fetchSingleTokenBalance(nativeToken, ownerAddress);
      if (balance) {
        balances[nativeToken.address] = balance;
      }
    }

    // Skip multicall if there are no ERC20 tokens to process
    if (erc20Tokens.length === 0) {
      return balances;
    }

    const balanceInterface = new ethers.utils.Interface(ERC20_ABI);

    // Create calls array for each ERC20 token
    const calls = erc20Tokens.map((token) => {
      const callData = balanceInterface.encodeFunctionData('balanceOf', [
        ownerAddress
      ]);
      return {
        target: token.address,
        callData
      };
    });

    // Make the multicall request
    const { returnData } = (await multicall.aggregate(
      calls
    )) as MulticallResult;

    // Process the results
    erc20Tokens.forEach((token, i) => {
      try {
        const decodedResult = balanceInterface.decodeFunctionResult(
          'balanceOf',
          returnData[i]
        );
        balances[token.address] = decodedResult[0];
      } catch (error) {
        console.warn(
          `Failed to decode balance for token ${token.address}`,
          error
        );
        // Try to fetch this token individually if decoding failed
        fetchSingleTokenBalance(token, ownerAddress)
          .then((balance) => {
            if (balance) {
              balances[token.address] = balance;
            }
          })
          .catch(() => {
            console.warn(
              `Failed to fetch balance for token ${token.address}`,
              error
            );
          });
      }
    });

    return balances;
  } catch (error) {
    console.warn(
      'Multicall failed, falling back to individual queries:',
      error
    );

    // Fall back to individual token balance queries
    const fallbackPromises = tokens.map(async (token) => {
      const balance = await fetchSingleTokenBalance(token, ownerAddress);
      if (balance) {
        balances[token.address] = balance;
      }
    });

    await Promise.all(fallbackPromises);
    return balances;
  }
};
