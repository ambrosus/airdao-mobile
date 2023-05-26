import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { RenderItem } from './RenderItem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExplorerAccountType } from '@appTypes';

jest.mock('victory-native', () => {
  return {
    VictoryChart: jest.fn(),
    VictoryTheme: {},
    VictoryLine: jest.fn(),
    VictoryAxis: jest.fn()
  };
});

const mockItem = {
  _id: '6458d664d186ad9c72f3779c',
  address: '0x19690E7267Adf28c11494248C3d5561bb7aeDBbA',
  ambBalance: 100000000000000000,
  transactionCount: 17,
  type: ExplorerAccountType.Account,
  name: '',
  calculatePercentHoldings: () => 0
};

const mockAllAddressesReducer = jest.fn(() => ({
  address: mockItem
}));

jest.mock('@contexts/AllAddresses', () => ({
  useAllAddressesReducer: jest.fn(() => ({
    mockAllAddressesReducer
  })),
  useAllAddresses: jest.fn(() => {
    return [];
  })
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn()
  })
}));

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <RenderItem item={mockItem} idx={0} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('RenderItem', () => {
  it('renders correctly', () => {
    const { getByTestId, findByText, getByText } = render(<Component />);
    expect(getByTestId('Swipeable_Element')).toBeDefined();
    expect(getByTestId('Rename_Address_Button')).toBeDefined();
    expect(getByTestId('Confirm_Remove_Address_Button')).toBeDefined();
    expect(getByTestId(`WalletItem_0`)).toBeTruthy();
    expect(getByText('0x1969...7aeDBbA')).toBeTruthy();
    expect(findByText('100,000,000,000,000,000')).toBeTruthy();
    expect(findByText('AMB')).toBeTruthy();
    expect(getByTestId('percent-change-text')).toBeTruthy();
  });

  it('opens the rename address modal', async () => {
    const { getByTestId, findByText } = render(<Component />);
    const renameAddressButton = getByTestId('Rename_Address_Button');
    const renameAddressModal = getByTestId('BottomSheet_Rename_Address');
    await act(async () => {
      await fireEvent.press(renameAddressButton);
    });
    await waitFor(async () => {
      await expect(renameAddressModal).toBeDefined();
    });
    expect(findByText('Rename address')).toBeTruthy();
    expect(findByText('Save')).toBeTruthy();
    expect(findByText('Cancel')).toBeTruthy();
  });

  it('renames the address', async () => {
    const { getByTestId, findByTestId } = render(<Component />);
    const renameAddressButton = getByTestId('Rename_Address_Button');
    const renameAddressModal = getByTestId('BottomSheet_Rename_Address');
    const renameAddressInput = findByTestId('Rename_Address_Input');
    const saveRenamedAddress = findByTestId('Save_Renamed_Address');
    await act(async () => {
      await fireEvent.press(renameAddressButton);
    });
    await waitFor(async () => {
      await expect(renameAddressModal).toBeDefined();
    });
    expect(renameAddressInput).toBeDefined();

    console.log(await renameAddressInput);
    await act(async () => {
      // await fireEvent.press(renameAddressInput);
      await fireEvent.changeText(
        await renameAddressInput,
        'My Personal Address'
      );
      // await fireEvent.press(renameAddressInput, 'submitEditing', {
      //   nativeEvent: { text: 'My Personal Address' }
      // });
    });
    await act(async () => {
      await fireEvent.press(saveRenamedAddress);
    });
    await waitFor(async () => {
      await expect(mockAllAddressesReducer).toBeCalled();
    });
    // await waitFor(async () => {
    //   await expect(
    //     getByTestId(`WalletItem_0`).props.children.props.item.name
    //   ).toBe('My Personal Address');
    // });
  });

  it('opens the confirm remove address modal', async () => {
    const { getByTestId, findByText } = render(<Component />);
    const removeFromWatchlistButton = getByTestId(
      'Confirm_Remove_Address_Button'
    );
    const removeFromWatchlistModal = getByTestId(
      'Bottom_Sheet_Remove_Address_From_Watchlist'
    );
    await act(async () => {
      await fireEvent.press(removeFromWatchlistButton);
    });
    await waitFor(async () => {
      await expect(removeFromWatchlistModal).toBeDefined();
    });
    expect(findByText('Remove this address from watchlist?')).toBeTruthy();
    expect(findByText('Remove')).toBeTruthy();
    expect(findByText('Cancel')).toBeTruthy();
  });
});

// TODO test whether address name was changed or not
