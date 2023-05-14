import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SharePortfolio } from '@components/templates';
import React from 'react';
import { ShareUtils } from '@utils/share';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';

jest.mock('victory-native', () => {
  return {
    VictoryChart: jest.fn(),
    VictoryTheme: {},
    VictoryLine: jest.fn(),
    VictoryAxis: jest.fn()
  };
});

jest.mock('react-native-view-shot', () => ({
  captureRef: jest.fn()
}));

const mockedShareUtils = jest.fn();

jest.mock('@utils/share', () => ({
  ShareUtils: {
    shareImage: mockedShareUtils,
    socialShareImage: mockedShareUtils
  }
}));

jest.mock('react-native-modal', () => {
  return ({ children }: { children: React.ReactNode }) => <>{children}</>;
});

const mockedBottomSheetTitle = 'Test Title';
const mockedTimestamp = new Date('2023-05-12T10:00:00Z');

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SharePortfolio
          balance="8987987879879"
          bottomSheetTitle={mockedBottomSheetTitle}
          currency="USD"
          currencyPosition="left"
          timestamp={mockedTimestamp}
          title="Test"
        />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('SharePortfolio', () => {
  it('Bottom Sheet and its components inside renders correctly', () => {
    const { getByTestId, getByText } = render(<Component />);
    const shareBottomSheet = getByTestId('share-bottom-sheet');
    const title = getByText(mockedBottomSheetTitle);
    const twitterButton = getByTestId('SharePortfolio_Twitter_Button');
    const messagesButton = getByTestId('SharePortfolio_Message_Button');
    const clipboardButton = getByTestId('SharePortfolio_Clipboard_Button');
    const moreButton = getByTestId('SharePortfolio_More_Button');
    expect(shareBottomSheet).toBeDefined();
    expect(twitterButton).toBeDefined();
    expect(messagesButton).toBeDefined();
    expect(clipboardButton).toBeDefined();
    expect(moreButton).toBeDefined();
    expect(title).toBeDefined();
  });

  it.skip('calls onSharePress with Twitter option when Twitter button is pressed', async () => {
    ShareUtils.socialShareImage = jest.fn();
    const { getByTestId } = render(<Component />);
    const twitterButton = getByTestId('SharePortfolio_Twitter_Button');
    act(() => {
      fireEvent.press(twitterButton);
    });
    await waitFor(() => {
      expect(mockedShareUtils).toHaveBeenCalled();
    });
  });

  it.skip('calls onSharePress with Messages option when Messages button is pressed', async () => {
    ShareUtils.socialShareImage = jest.fn();
    const { getByTestId } = render(<Component />);
    const messagesButton = getByTestId('SharePortfolio_Message_Button');
    act(() => {
      fireEvent.press(messagesButton);
    });
    expect(mockedShareUtils).toHaveBeenCalled();
  });
});

// TODO button tests
