import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { SingleGroupScreen } from '@screens/SingleCollection';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import clearAllMocks = jest.clearAllMocks;

Object.defineProperty(Array.prototype, 'indexOfItem', {
  value: jest.fn()
});

const mockedCollection = [
  {
    id: '1223123',
    name: 'Test Collection',
    accounts: [
      {
        _id: '6200de3b523162b8b87baff1',
        address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
        ambBalance: 9999999.444,
        transactionCount: 17,
        type: 'account',
        name: '',
        calculatePercentHoldings: () => 0
      }
    ]
  }
];

jest.mock('@contexts/ListsContext', () => ({
  useLists: jest.fn(() => ({
    listsOfAddressGroup: mockedCollection,
    createGroupRef: jest.fn()
  }))
}));

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    params: {
      group: { id: '1223123' }
    }
  })
}));

jest.mock('@contexts/AllAddresses', () => ({
  useAllAddresses: jest.fn(() => {
    return [];
  }),
  useAllAddressesReducer: jest.fn()
}));

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <SingleGroupScreen />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('SingleGroupScreen', () => {
  afterAll(() => {
    clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByTestId, getByText } = render(<Component />);
    expect(getByTestId('Single_Collection')).toBeDefined();
    expect(getByTestId('Add_Address_Button')).toBeDefined();
    expect(getByTestId('Edit_Collection_Button')).toBeDefined();
    expect(getByText('TOTAL BALANCE')).toBeDefined();
    expect(getByText('Test Collection')).toBeDefined();
    expect(getByTestId('List_Of_Addresses')).toBeDefined();
    expect(getByText('9,999,999 AMB')).toBeTruthy();
  });

  it('opens the "Add New Address" modal when the "Add Address" button is pressed', () => {
    const { getByTestId } = render(<Component />);
    const addButton = getByTestId('Add_Address_Button');
    fireEvent.press(addButton);
    const addNewAddressModal = getByTestId('bottom-sheet-add-new-address');
    expect(addNewAddressModal).toBeDefined();
  });

  it('opens the "Edit Collection" modal when the "Edit Collection" button is pressed', () => {
    const { getByTestId } = render(<Component />);
    const editButton = getByTestId('Edit_Collection_Button');
    fireEvent.press(editButton);
    const editCollectionModal = getByTestId('bottom-sheet-edit-collection');
    expect(editCollectionModal).toBeDefined();
  });

  it('opens the "BottomSheetCreateRename" modal when the "Edit Collection" button is pressed', () => {
    const { getByTestId } = render(<Component />);
    const editButton = getByTestId('Edit_Collection_Button');
    fireEvent.press(editButton);
    const editCollectionModal = getByTestId('bottom-sheet-edit-collection');
    expect(editCollectionModal).toBeDefined();
    const renameButton = getByTestId('Rename_Collection_Button');
    fireEvent.press(renameButton);
    const renameCollectionModal = getByTestId('BottomSheetCreateRename');
    expect(renameCollectionModal).toBeDefined();
  });
});
