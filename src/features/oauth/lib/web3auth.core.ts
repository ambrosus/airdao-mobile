import AsyncStorage from '@react-native-async-storage/async-storage';
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK_TYPE } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { SDK_MODE, Web3Auth } from '@web3auth/single-factor-auth';
import Config from '@constants/config';
import { AUTH_ENVIRONMENT } from '@entities/oauth/utils';

const clientId = AUTH_ENVIRONMENT.clientId;
const web3AuthNetwork: WEB3AUTH_NETWORK_TYPE = 'sapphire_devnet';

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

alert(JSON.stringify(AUTH_ENVIRONMENT));

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig }
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork,
  privateKeyProvider,
  storage: AsyncStorage,
  mode: SDK_MODE.REACT_NATIVE
});

web3auth.init();

export { web3auth };
