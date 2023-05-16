import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetEditWallet } from '@components/templates/BottomSheetEditWallet/index';
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ExplorerAccountType } from '@appTypes';
import { ExplorerAccount } from '@models';

const queryClient = new QueryClient();

jest.mock('react-native-modal', () => {
  return ({ children }: { children: React.ReactNode }) => <>{children}</>;
});

jest.mock('@contexts/AllAddresses', () => ({
  useAllAddressesReducer: () => jest.fn(),
  useAllAddresses: jest.fn(() => {
    return [];
  })
}));

const mockedListsOfAddressGroup = [
  {
    id: '1223123',
    name: '333',
    accounts: [
      {
        _id: '6200de3b523162b8b87baff1',
        address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
        ambBalance: 1154670697.424454,
        transactionCount: 17,
        type: ExplorerAccountType.Account,
        name: '',
        calculatePercentHoldings: () => 0
      }
    ]
  }
];

const mockedWallet: ExplorerAccount = {
  _id: '6200de3b523162b8b87baff1',
  address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
  ambBalance: 1154670697.424454,
  transactionCount: 17,
  type: ExplorerAccountType.Account,
  name: '',
  calculatePercentHoldings: () => 0
};

jest.mock('@contexts/ListsContext', () => ({
  useLists: jest.fn(() => ({
    listsOfAddressGroup: mockedListsOfAddressGroup,
    createGroupRef: jest.fn()
  }))
}));

jest.mock('@contexts/OnBoardingContext', () => ({
  useOnboardingStatus: jest.fn(() => ({
    status: 'none',
    back: jest.fn(),
    skip: jest.fn()
  }))
}));

Object.defineProperty(Array.prototype, 'indexOfItem', {
  value: jest.fn()
});

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios'
}));

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <BottomSheetEditWallet wallet={mockedWallet} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('BottomSheetEditWallet', () => {
  it('renders correctly when editing wallet', () => {
    const { getByTestId, getByText } = render(<Component />);
    expect(getByTestId('BottomSheetEditWallet')).toBeDefined();
    expect(getByTestId('EditWallet_Container')).toBeDefined();
    expect(getByText('Address name')).toBeDefined();
    expect(getByText('This is my personal Address')).toBeDefined();
    expect(getByText('Add to Lists')).toBeDefined();
    expect(getByText('Create new list')).toBeDefined();
    expect(getByTestId('BottomSheetCreateRename')).toBeDefined();
    expect(getByTestId('BottomSheetCreateRename_Title')).toBeDefined();
    expect(getByTestId('BottomSheetCreateRename_Input')).toBeDefined();
    expect(getByTestId('BottomSheetCreateRename_Button')).toBeDefined();
  });

  it('should not render float button if Platform = IOS', () => {
    const { queryByTestId } = render(<Component />);
    const bottomSheetEditWallet = queryByTestId(
      'BottomSheet_Edit_Wallet_FloatButton'
    );
    expect(bottomSheetEditWallet).toBeNull();
  });

  it('buttons and inputs works correctly', () => {
    const { getByTestId } = render(<Component />);
    const addressNameInput = getByTestId('Edit_Wallet_Input');
    const switchButton = getByTestId('EditWallet_Personal_Address_Switch');
    const checkbox = getByTestId('EditWallet_Checkbox');
    fireEvent.changeText(addressNameInput, '20');
    expect(addressNameInput.props.value).toBe('20');
    expect(switchButton).toBeDefined();
    expect(checkbox).toBeDefined();
    expect(checkbox.props.style).toMatchObject({
      backgroundColor: 'transparent',
      borderWidth: 1
    });
    fireEvent.press(switchButton);
    expect(checkbox.props.style).toMatchObject({
      backgroundColor: '#2563eb',
      borderWidth: 0
    });
  });
});
