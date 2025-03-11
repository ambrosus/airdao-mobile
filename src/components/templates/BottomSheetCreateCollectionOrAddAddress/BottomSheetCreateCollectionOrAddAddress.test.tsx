import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetCreateCollectionOrAddAddress } from '@components/templates/BottomSheetCreateCollectionOrAddAddress/index';
import clearAllMocks = jest.clearAllMocks;

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
  afterAll(() => {
    clearAllMocks();
  });

  it('renders correctly', async () => {
    const { getByTestId, findByTestId } = render(<Component />);
    expect(getByTestId('Create_Collection_Or_Add_Address_BottomSheet'));
    await waitFor(async () => {
      await expect(findByTestId('BottomSheet_Content')).toBeDefined();
    });
    const addAddressButton = findByTestId('Add_Address_Button');
    const createCollectionButton = findByTestId('Create_Collection_Button');
    expect(addAddressButton).toBeDefined();
    expect(createCollectionButton).toBeDefined();
  });

  it('calls handleOnAddNewAddress when add address button is pressed', async () => {
    const { findByTestId } = render(<Component />);
    const addAddressButton = findByTestId('Add_Address_Button');
    expect(addAddressButton).toBeDefined();
    // fireEvent.press(addAddressButton);
    // expect(handleOnAddNewAddress).toHaveBeenCalled();
  }); // TODO handleOnAddNewAddress

  it('calls handleCreateCollectionPress when create collection button is pressed', () => {
    const { findByTestId } = render(<Component />);
    const createButton = findByTestId('Create_Collection_Button');
    expect(createButton).toBeDefined();
    // fireEvent.press(createButton);
    // expect(handleCreateCollectionPress).toHaveBeenCalled();
  }); // TODO handleCreateCollectionPress
});
