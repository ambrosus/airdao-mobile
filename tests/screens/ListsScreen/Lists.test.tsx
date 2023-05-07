import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ListsScreen } from '@screens/Lists';
import { SettingsBlock } from '@screens/Settings/components/SettingsBlock';
import { SafeAreaProvider } from 'react-native-safe-area-context';
jest.mock('@helpers/createContextSelector', () => ({
  createContextSelector: () => [{}, jest.fn()]
}));

jest.mock('@contexts/ListsContext', () => ({
  useLists: () => ({
    listsOfAddressGroup: [{}, {}]
  })
}));

jest.mock('victory-native', () => ({}));

jest.mock('react-native-share', () => ({}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(),
    useRoute: jest.fn()
  };
});

// jest.mock(
//   'react-native-safe-area-context',
//   () => require('react-native-safe-area-context/jest/mock').default
// );

// jest.mock('react-native-safe-area-context', () => {
//   // require('react-native-safe-area-context/jest/mock').default;
//   const inset = { top: 0, right: 0, bottom: 0, left: 0 };
//   return {
//     SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
//     useSafeAreaInsets: jest.fn().mockImplementation(() => inset)
//   };
// });

jest.mock('react-native-safe-area-context');
jest.mock('react-native', () => ({
  SafeAreaView: jest.fn().mockImplementation(({ children }) => children),
  Dimensions: {
    get: jest.fn(() => ({ width: 320, height: 480 }))
  },
  StyleSheet: {
    create: jest.fn()
  }
  // useSafeAreaInsets: () => ({
  //   top: 0,
  //   right: 0,
  //   bottom: 0,
  //   left: 0
  // })
}));

// jest.mock('expo-unimodules', () => ({
//   NativeUnimoduleProxy: {
//     addListener: jest.fn(),
//     removeListeners: jest.fn(),
//     getModule: jest.fn()
//   }
// }));

jest.mock('@helpers/createContextSelector', () => ({
  createContextSelector: () => [{}, jest.fn()]
}));

jest.mock('@hooks', () => ({
  useForwardedRef: jest.fn(),
  useFullscreenModalHeight: () => [],
  useAMBPrice: jest.fn(() => ({
    data: 123123,
    loading: false,
    error: undefined
  }))
}));

const mockFocus = jest.fn();
jest.spyOn(React, 'useRef').mockImplementation(() => ({
  current: {
    focus: mockFocus
  }
}));

const queryClient = new QueryClient();

jest.mock('@components/templates', () => {
  return {
    BottomSheetCreateRenameGroup: () => null,
    BottomSheetListsFilters: () => null,
    BottomSheetListsSettings: () => null,
    BottomSheetSelectList: () => null,
    BottomSheetSingleGroupOption: () => null,
    BottomSheetConfirmRemoveGroup: () => null,
    BottomSheetSingleAddressOptions: () => null,
    BottomSheetAddNewAddressToGroup: () => null,
    BottomSheetLongPressAddressSelection: () => null,
    BottomSheetSingleAddressMove: () => null,
    BottomSheetConfirmRemove: () => null,
    BottomSheetRenameAddress: () => null
  };
});

jest.mock('@utils/string', () => ({
  __esModule: true,
  StringUtils: {
    formatAddress: jest.fn().mockReturnValue('mocked address')
  }
}));

// jest.mock('react-native-gesture-handler');

describe('ListsScreen', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders without crashing', async () => {
    const { getByTestId } = render(
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ListsScreen />
        </QueryClientProvider>
      </SafeAreaProvider>
    );
    expect(getByTestId('lists-screen')).toBeTruthy();
  });

  // it('should open the create new list modal on press', async () => {
  //   const { getByText, getByTestId } = render(<ListsScreen />);
  //   fireEvent.press(getByText('Create new list'));
  //   expect(getByTestId('bottom-sheet-123')).not.toBeNull();
  // });

  // it('displays the "Create new list" button', () => {
  //   const { getByTestId } = render(<ListsScreen />);
  //   const floatButton = getByTestId('float-button');
  //   const createNewListButton = queryByTestId(
  //     floatButton,
  //     'create-new-list-button'
  //   );
  //
  //   expect(createNewListButton).not.toBeNull();
  // });

  // it('displays the "Create new list" button', () => {
  //   const { getByTestId } = render(<ListsScreen />);
  //   const button = getByTestId('123');
  //   expect(button).toBeTruthy();
  // });

  // it('displays the "Create new list" button', async () => {
  //   const { getByTestId } = render(<ListsScreen />);
  //
  //   expect(getByTestId('lists-screen'));
  //   expect(getByTestId('lists-screen-separator'));
  //   await waitFor(async () => {
  //     await expect(getByTestId('123')).toBeTruthy();
  //   });
  // });
  //
  // it('opens the create group bottom sheet when the "Create new list" button is pressed', () => {
  //   const { getByText, getByTestId } = render(<ListsScreen />);
  //   const button = getByText('Create new list');
  //   fireEvent.press(button);
  //   const bottomSheet = getByTestId('bottom-sheet-create-rename-group');
  //   expect(bottomSheet.props.visible).toBe(true);
  // });
  //
  // it('displays the "EmptyListsOfGroups" component when there are no lists of address groups', () => {
  //   const { getByTestId } = render(<ListsScreen />);
  //   const emptyComponent = getByTestId('empty-lists-of-groups');
  //   expect(emptyComponent).toBeTruthy();
  // });
  //
  // it('displays the "ListsGroups" component when there are lists of address groups', () => {
  //   const { getByTestId } = render(<ListsScreen />);
  //   const groupsComponent = getByTestId('lists-groups');
  //   expect(groupsComponent).toBeTruthy();
  // });
});
