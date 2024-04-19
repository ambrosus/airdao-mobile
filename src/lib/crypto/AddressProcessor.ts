import Web3 from 'web3';
import Config from '@constants/config';

class AddressProcessor {
  private web3: Web3;

  constructor() {
    this.web3 = new Web3(new Web3.providers.HttpProvider(Config.NETWORK_URL));
  }

  async getAddressByPrivateKey(privateKey: string | Buffer) {
    privateKey = '0x' + privateKey.toString('hex');
    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    return { address: account.address, privateKey, addedData: false };
  }

  // returns balance in wei
  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.web3.eth.getBalance(address);
      return balance;
    } catch (error) {
      throw error;
    }
  }
}

export default new AddressProcessor();
