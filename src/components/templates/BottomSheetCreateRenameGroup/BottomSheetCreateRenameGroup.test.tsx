import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup/index';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';

const queryClient = new QueryClient();

jest.mock('react-native-modal', () => {
  return ({ children }: { children: React.ReactNode }) => <>{children}</>;
});

jest.mock('@contexts/OnBoardingContext', () => ({
  useOnboardingStatus: jest.fn(() => ({
    status: '0',
    back: jest.fn(),
    skip: jest.fn()
  }))
}));

describe('BottomSheetCreateRenameGroup', () => {
  it('renders correctly when creating a new group', async () => {
    const handleOnCreateGroup = jest.fn();
    const { getByTestId, getByText } = render(
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetCreateRenameGroup
            type="create"
            handleOnCreateGroup={handleOnCreateGroup}
          />
        </QueryClientProvider>
      </SafeAreaProvider>
    );
    const bottomSheetCreateRenameGroup = getByTestId('BottomSheetCreateRename');
    expect(bottomSheetCreateRenameGroup).toBeDefined();
    const input = getByTestId('BottomSheetCreateRename_Input');
    const cancelButton = getByTestId('BottomSheetCreateRename_Cancel_Button');
    const createButton = getByTestId('BottomSheetCreateRename_Button');
    expect(input).toBeDefined();
    expect(cancelButton).toBeDefined();
    expect(createButton).toBeDefined();
    expect(getByText('Create')).toBeTruthy();
    await act(async () => {
      await fireEvent.press(input);
      await fireEvent.changeText(input, 'My Personal Group');
      await fireEvent.press(input, 'submitEditing', {
        nativeEvent: { text: 'My Personal Group' }
      });
    });
    await act(async () => {
      await fireEvent.press(createButton);
    });
    await waitFor(async () => {
      await expect(handleOnCreateGroup).toHaveBeenCalled();
    });
  });

  it('renders correctly when renaming a group', () => {
    const handleOnRenameGroup = jest.fn();
    const { getByTestId, getByText } = render(
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetCreateRenameGroup
            type="rename"
            handleOnRenameGroup={handleOnRenameGroup}
            groupTitle="My List"
            groupId="1"
          />
        </QueryClientProvider>
      </SafeAreaProvider>
    );
    const renameButton = getByTestId('BottomSheetCreateRename_Button');
    expect(renameButton).toBeDefined();
    expect(getByText('Rename')).toBeTruthy();
  });
});
