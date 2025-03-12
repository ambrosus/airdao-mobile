import AsyncStorage from '@react-native-async-storage/async-storage';
import { CHAIN_NAMESPACES } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { Web3Auth } from '@web3auth/single-factor-auth';
import Constants from 'expo-constants';
import Config from '@constants/config';

const chainConfig = {
  chainId: '0x5618', //22040
  displayName: 'AirDAO Testnet',
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  tickerName: 'Amber',
  ticker: 'AMB',
  decimals: 18,
  rpcTarget: Config.NETWORK_URL,
  blockExplorer: Config.EXPLORER_URL
};

alert(JSON.stringify(Constants.expoConfig?.extra?.eas));

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig }
});

const clientId = Constants.expoConfig?.extra?.eas.W3A_CLIENT_ID ?? '';

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: 'sapphire_devnet',
  privateKeyProvider,
  usePnPKey: false,
  storage: AsyncStorage
});

export { web3auth };
