import { ethers } from 'ethers';
import { createAMBProvider } from '@features/swap/utils/contracts/instances';

export class RpcMiddlewareMethods {
  private wallet: ethers.Wallet | null = null;
  private initPromise: Promise<void> | null = null;

  constructor(private privateKey: string) {
    const provider = createAMBProvider();
    this.wallet = new ethers.Wallet(privateKey, provider);
  }

  /**
   * Ensures the wallet is initialized before executing any method
   */
  private async ensureWallet(): Promise<ethers.Wallet> {
    if (this.initPromise) {
      await this.initPromise;
      this.initPromise = null;
    }

    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }

    return this.wallet;
  }

  /**
   * Gets the current wallet address
   */
  async getAddress(): Promise<string> {
    const wallet = await this.ensureWallet();
    return wallet.address;
  }

  /**
   * Signs a transaction
   */
  async signTransaction(
    transaction: ethers.providers.TransactionRequest
  ): Promise<string> {
    const wallet = await this.ensureWallet();
    return wallet.signTransaction(transaction);
  }

  /**
   * Signs a message
   */
  async signMessage(message: string): Promise<string> {
    const wallet = await this.ensureWallet();
    return wallet.signMessage(message);
  }

  /**
   * Sends a transaction
   */
  async sendTransaction(
    transaction: ethers.providers.TransactionRequest
  ): Promise<ethers.providers.TransactionResponse> {
    const wallet = await this.ensureWallet();
    return wallet.sendTransaction(transaction);
  }

  /**
   * Gets the balance for an address
   */
  async getBalance(address: string, blockTag = 'latest'): Promise<string> {
    const wallet = await this.ensureWallet();
    const balance = await wallet.provider.getBalance(address, blockTag);
    return balance.toHexString();
  }

  /**
   * Gets the chain ID
   */
  async getChainId(): Promise<string> {
    const wallet = await this.ensureWallet();
    const network = await wallet.provider.getNetwork();
    return `0x${network.chainId.toString(16)}`;
  }
}

// Example usage:
/*
const rpcMethods = new RpcMiddlewareMethods(async () => {
  // Your logic to get private key
  return privateKey;
});

// Methods will automatically ensure wallet is initialized
const address = await rpcMethods.getAddress();
*/
