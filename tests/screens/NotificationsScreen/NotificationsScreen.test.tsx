import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Notifications } from '@screens/Notifications';
import { fireEvent, render } from '@testing-library/react-native';
import clearAllMocks = jest.clearAllMocks;

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Notifications />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('Notifications Screen', () => {
  afterAll(() => {
    clearAllMocks();
  });

  it('renders correctly', async () => {
    const { getByTestId, getByText } = render(<Component />);
    expect(getByTestId('NotificationScreen')).toBeTruthy();
    expect(getByTestId('Notifications_List')).toBeDefined();
    expect(
      getByText('You have no notifications right now. \n Come back later.')
    ).toBeTruthy();
  });

  it.skip('displays notification sections', () => {
    const { getByText } = render(<Component />);
    expect(getByText('TODAY')).toBeTruthy();
    expect(getByText('YESTERDAY')).toBeTruthy();
  });

  it('opens settings modal when settings button is pressed', async () => {
    const { getByTestId } = render(<Component />);
    const filterButton = getByTestId('settings-button');
    fireEvent.press(filterButton);
    expect(getByTestId('BottomSheetNotiSettings_Container')).toBeDefined();
  });
});
