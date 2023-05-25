import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { BottomSheetConfirmRemove } from '@components/templates/BottomSheetConfirmRemove/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const mockHandleOnDeleteAddressFromGroup = jest.fn();

jest.mock('@contexts/ListsContext', () => ({
  useLists: jest.fn(() => ({
    handleOnDeleteAddressFromGroup: mockHandleOnDeleteAddressFromGroup
  }))
}));

jest.mock('@hooks', () => ({
  useFullscreenModalHeight: () => [],
  useForwardedRef: jest.fn(() => ({
    current: {
      dismiss: jest.fn(),
      show: jest.fn()
    }
  })),
  useRef: jest.fn()
}));

const ref = { current: { dismiss: jest.fn() } };
const item = { address: '0xF977814e90dA44bFA03b6295A0616a897441aceC' };
const groupId = '76a352bd433ad8';

const queryClient = new QueryClient();

jest.mock('react-native-modal', () => {
  return ({ children }: { children: React.ReactNode }) => <>{children}</>;
});

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <BottomSheetConfirmRemove item={item} groupId={groupId} ref={ref} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('BottomSheetConfirmRemove', () => {
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

  it('calls handleOnDeleteAddressFromGroup when Remove button is pressed', async () => {
    const { getByTestId } = render(<Component />);
    const removeButton = getByTestId('BottomSheetConfirmRemove_Button');
    fireEvent.press(removeButton);
    expect(mockHandleOnDeleteAddressFromGroup).toHaveBeenCalledWith(groupId, [
      item.address
    ]);
  });
});
