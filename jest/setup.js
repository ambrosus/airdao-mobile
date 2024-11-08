import 'react-native-gesture-handler/jestSetup';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

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

//     () => {
//   const inset = { top: 0, right: 0, bottom: 0, left: 0 };
//   return {
//     SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
//     SafeAreaView: jest.fn().mockImplementation(({ children }) => children),
//     useSafeAreaInsets: jest.fn().mockImplementation(() => inset)
//   };
// });

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
  return {
    ethers: {
      Contract: jest.fn().mockImplementation(() => {
        return {
          unknown: jest.fn() // Example method
        };
      }),
      constants: {
        AddressZero: '0x0000000000000000000000000000000000000000'
      }
    }
  };
});
