import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SharePortfolio } from '@components/templates';
import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import clearAllMocks = jest.clearAllMocks;
import { Social } from '@appTypes';

jest.mock('@utils/share', () => ({
  ShareUtils: {
    shareImage: jest.fn(),
    socialShareImage: jest.fn()
  }
}));

jest.mock('@appTypes/Sharing', () => ({ Social: { Twitter: 'twitter' } }));

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SharePortfolio
          balance="100000"
          title="Test Title"
          bottomSheetTitle=""
          currency=""
          currencyPosition="right"
          timestamp={new Date('10.07.2023')}
        />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('SharePortfolio', () => {
  afterAll(() => {
    clearAllMocks();
  });

  it('BottomSheet and its components inside renders correctly', () => {
    const { getByTestId, findByTestId, findByText } = render(<Component />);
    const shareBottomSheet = getByTestId('Share_Portfolio_BottomSheet');
    const title = findByText('Test Title');
    const twitterButton = findByTestId('SharePortfolio_Twitter_Button');
    const messagesButton = findByTestId('SharePortfolio_Message_Button');
    const moreButton = findByTestId('SharePortfolio_More_Button');
    expect(findByTestId('BottomSheet_Container')).toBeDefined();
    expect(shareBottomSheet).toBeDefined();
    expect(title).toBeDefined();
    expect(twitterButton).toBeDefined();
    expect(messagesButton).toBeDefined();
    expect(moreButton).toBeDefined();
  });

  it.skip('twitter button is pressable', async () => {
    const onSharePressMock = jest.fn();
    const { findByTestId } = render(<Component />);
    const twitterButton = findByTestId('SharePortfolio_Twitter_Button');
    expect(twitterButton).toBeDefined();
    await act(async () => {
      await fireEvent.press(twitterButton);
    });
    await waitFor(async () => {
      await expect(onSharePressMock).toHaveBeenCalledWith(Social.Twitter);
    });
    // TODO rework this test
  });

  it.skip('message button is pressable', async () => {
    const onSharePressMock = jest.fn();
    const { findByTestId } = render(<Component />);
    const messagesButton = findByTestId('SharePortfolio_Message_Button');
    expect(messagesButton).toBeDefined();
    await act(async () => {
      await fireEvent.press(messagesButton);
    });
    await waitFor(async () => {
      await expect(onSharePressMock).toHaveBeenCalledWith(Social.Sms);
    });
    // TODO rework this test
  });
});
