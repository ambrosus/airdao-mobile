import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { EditWallet } from '@components/templates/EditWallet/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExplorerAccountType } from '@appTypes';

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

const onNameChangeMock = jest.fn();
const onIsPersonalAddressChangeMock = jest.fn();

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <EditWallet
          wallet={mockedListsOfAddressGroup[0].accounts[0]}
          name="My Wallet"
          isPersonalAddress={false}
          onNameChange={onNameChangeMock}
          onIsPersonalAddressChange={onIsPersonalAddressChangeMock}
        />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('EditWallet', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Component />);
    expect(getByTestId('EditWallet_Container')).toBeDefined();
  });

  it('calls the onIsPersonalAddressChange function when the personal address switch is toggled', async () => {
    const { getByTestId } = render(<Component />);
    const personalAddressSwitch = getByTestId(
      'EditWallet_Personal_Address_Switch'
    );
    await act(() => {
      fireEvent.press(personalAddressSwitch, 'onValueChange', true);
    });
    expect(onIsPersonalAddressChangeMock).toHaveBeenCalledWith(true);
  });
});
