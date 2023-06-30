import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BottomSheetCreateCollectionOrAddAddress } from '@components/templates/BottomSheetCreateCollectionOrAddAddress/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();
const handleCreateCollectionPress = jest.fn();
const handleOnAddNewAddress = jest.fn();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <BottomSheetCreateCollectionOrAddAddress
          handleCreateCollectionPress={handleCreateCollectionPress}
          handleOnAddNewAddress={handleOnAddNewAddress}
        />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('BottomSheetCreateCollectionOrAddAddress', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Component />);
    const bottomSheet = getByTestId(
      'BottomSheet_Create_Collection_Or_Add_Address'
    );
    expect(bottomSheet).toBeTruthy();
  });

  it('calls handleOnAddNewAddress when add address button is pressed', () => {
    const { getByText } = render(<Component />);
    const addButton = getByText('Add Address');
    fireEvent.press(addButton);
    expect(handleOnAddNewAddress).toHaveBeenCalled();
  });

  it('calls handleCreateCollectionPress when create collection button is pressed', () => {
    const { getByText } = render(<Component />);
    const createButton = getByText('Create Collection');
    fireEvent.press(createButton);
    expect(handleCreateCollectionPress).toHaveBeenCalled();
  });
});
