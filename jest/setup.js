import 'react-native-gesture-handler/jestSetup';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

const ETH_ADDRESS = '0x0000000000000000000000000000000000000000';

jest.mock('@walletconnect/react-native-compat', () => ({}));
jest.mock('@reown/walletkit', () => ({
  WalletKit: jest.fn(),
  IWalletKit: jest.fn()
}));

jest.mock('@walletconnect/core', () => ({
  Core: jest.fn()
}));

const mockIsPackageInstalled = jest.fn((value) => ({
  value,
  isInstalled: true
}));
jest.mock('react-native-share', () => ({
  isPackageInstalled: (value) => mockIsPackageInstalled(value),
  Social: { InstagramStories: 'instagramstories' }
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(),
    useRoute: jest.fn()
  };
});

jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Reanimated = require('react-native-reanimated/mock');
  const ReanimatedLayoutAnimation = {
    stiffness: jest.fn(() => ReanimatedLayoutAnimation),
    springify: jest.fn(() => ReanimatedLayoutAnimation),
    damping: jest.fn(() => ReanimatedLayoutAnimation),
    mass: jest.fn(() => ReanimatedLayoutAnimation),
    overshootClamping: jest.fn(() => ReanimatedLayoutAnimation),
    restDisplacementThreshold: jest.fn(() => ReanimatedLayoutAnimation),
    restSpeedThreshold: jest.fn(() => ReanimatedLayoutAnimation),
    duration: jest.fn(() => ReanimatedLayoutAnimation)
  };
  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.FadeIn = ReanimatedLayoutAnimation;
  Reanimated.FadeOut = ReanimatedLayoutAnimation;
  Reanimated.Layout = ReanimatedLayoutAnimation;
  Reanimated.FadeInRight = ReanimatedLayoutAnimation;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  Reanimated.default.call = () => {};
  Reanimated.__reanimatedWorkletInit = jest.fn();
  return Reanimated;
});

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.mock('@utils/createContextSelector', () => ({
  createContextSelector: () => [{}, jest.fn()]
}));

jest.mock('@neverdull-agency/expo-unlimited-secure-store', () => {
  return jest.fn();
});

jest.mock('@nozbe/watermelondb/adapters/sqlite', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        batch: jest.fn()
      };
    })
  };
});

jest.mock('@nozbe/watermelondb', () => {
  class MockModel {
    _raw = null;
    constructor(raw) {
      this._raw = raw;
    }
  }
  class MockDatabase {
    constructor() {
      // mock methods
    }
  }
  const tableSchema = jest.fn().mockImplementation(() => {
    return {
      name: '',
      columns: []
    };
  });
  const appSchema = jest.fn().mockImplementation(() => {
    return {
      version: 1,
      tables: []
    };
  });
  return {
    __esModule: true,
    Model: MockModel,
    Database: MockDatabase,
    tableSchema: tableSchema,
    appSchema: appSchema
  };
});

jest.mock('@nozbe/watermelondb/hooks', () => ({
  useDatabase: jest.fn()
}));

jest.mock('react-native-graph', () => ({
  LineGraph: 'LineGraph',
  GraphPoint: 'GraphPoint'
}));

jest.mock('@shopify/react-native-skia', () => ({
  runSpring: jest.fn(),
  useValue: jest.fn(),
  Circle: 'Circle',
  Group: 'Group'
}));

jest.mock('ethers', () => {
  const MockContract = jest.fn().mockImplementation(() => {
    return {
      address: ETH_ADDRESS,
      abi: [],
      getSigner: jest.fn().mockReturnValue({}),
      call: jest.fn().mockResolvedValue(true)
    };
  });

  const MockWallet = jest.fn().mockImplementation((privateKey, provider) => {
    return {
      privateKey,
      provider,
      connect: jest.fn().mockReturnValue({
        getAddress: jest.fn().mockResolvedValue(ETH_ADDRESS)
      })
    };
  });

  const MockJsonRpcProvider = jest.fn().mockImplementation((url) => {
    return {
      url,
      getBlockNumber: jest.fn().mockResolvedValue(12345),
      getNetwork: jest.fn().mockResolvedValue({ chainId: 1 }), // Mock network
      getGasPrice: jest.fn().mockResolvedValue('10000000000'),
      sendTransaction: jest.fn().mockResolvedValue('0xTransactionHash')
    };
  });

  const MockStaticJsonRpcProvider = jest.fn().mockImplementation((url) => {
    return {
      url,
      getBlockNumber: jest.fn().mockResolvedValue(12345),
      getGasPrice: jest.fn().mockResolvedValue('10000000000')
    };
  });

  const MockWeb3Provider = jest.fn().mockImplementation((provider) => {
    return {
      provider,
      getSigner: jest.fn().mockReturnValue({
        getAddress: jest.fn().mockResolvedValue(ETH_ADDRESS)
      }),
      getNetwork: jest.fn().mockResolvedValue({ chainId: 1 }),
      getBlockNumber: jest.fn().mockResolvedValue(12345)
    };
  });

  return {
    __esModule: true,
    ethers: {
      providers: {
        Provider: jest.fn(),
        JsonRpcProvider: MockJsonRpcProvider,
        StaticJsonRpcProvider: MockStaticJsonRpcProvider,
        Web3Provider: MockWeb3Provider
      },
      lib: {
        utils: {
          isAddress: jest.fn()
        }
      },
      constants: {
        AddressZero: ETH_ADDRESS
      },
      Contract: MockContract,
      Wallet: MockWallet
    }
  };
});
