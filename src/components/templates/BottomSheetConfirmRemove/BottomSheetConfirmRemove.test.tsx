import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { BottomSheetConfirmRemove } from '@components/templates/BottomSheetConfirmRemove/index';
import { useLists } from '@contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.mock('@contexts/ListsContext');
jest.mock('@react-navigation/native');

jest.mock('@hooks', () => ({
  useForwardedRef: jest.fn(() => ({
    current: {
      dismiss: jest.fn(),
      show: jest.fn()
    }
  })),
  useFullscreenModalHeight: () => []
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    params: {
      group: { id: '76a352bd433ad8' }
    }
  })
}));

const mockHandleOnDeleteAddressFromGroup = jest.fn();
const ref = { current: { dismiss: jest.fn() } };
const item = { address: '0xF977814e90dA44bFA03b6295A0616a897441aceC' };
const groupId = '76a352bd433ad8';

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <BottomSheetConfirmRemove groupId={groupId} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('BottomSheetConfirmRemove', () => {
  beforeEach(() => {
    useLists.mockReturnValue({
      handleOnDeleteAddressFromGroup: mockHandleOnDeleteAddressFromGroup
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<Component />);
    const bottomSheetConfirmRemove = getByTestId(
      'BottomSheetConfirmRemove_Container'
    );
    expect(bottomSheetConfirmRemove).toBeDefined();
    expect(
      getByText(
        `Are you sure want to remove selected ${item.address} from Whales?`
      )
    ).toBeTruthy();
    expect(getByText('Remove')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('calls handleOnDeleteAddressFromGroup when Remove button is pressed', () => {
    const { getByTestId } = render(<Component />);
    const removeButton = getByTestId('BottomSheetConfirmRemove_Button');
    fireEvent.press(removeButton);
    expect(mockHandleOnDeleteAddressFromGroup).toHaveBeenCalledWith(groupId, [
      item.address
    ]);
  });

  it('dismisses the bottom sheet when Cancel button is pressed', () => {
    const { getByText } = render(<Component />);
    const cancelButton = getByText('Cancel');
    fireEvent.press(cancelButton);
    expect(ref.current.dismiss).toHaveBeenCalled();
  });
});
