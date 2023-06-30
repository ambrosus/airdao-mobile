import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { Camera, PermissionResponse } from 'expo-camera';
import { BarcodeScanner } from '@components/templates';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import clearAllMocks = jest.clearAllMocks;

let mockOnScanned: any;
let mockOnClose: any;
let cameraPermissionMock: any;

const queryClient = new QueryClient();

const Component = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <BarcodeScanner onScanned={mockOnScanned} onClose={mockOnClose} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

describe('BarcodeScanner', () => {
  beforeAll(() => {
    cameraPermissionMock = jest
      .spyOn(Camera, 'getCameraPermissionsAsync')
      .mockResolvedValue({ status: 'granted' } as PermissionResponse);
  });

  afterAll(() => {
    cameraPermissionMock.mockRestore();
  });
  // export type PermissionStatus = 'granted' | 'denied' | 'never_ask_again';

  beforeEach(() => {
    clearAllMocks();
    mockOnScanned = jest.fn();
    mockOnClose = jest.fn();
  });

  it('renders Camera component when camera permission is granted', async () => {
    cameraPermissionMock = jest
      .spyOn(Camera, 'getCameraPermissionsAsync')
      .mockResolvedValue({ status: 'granted' } as PermissionResponse);
    const { getByTestId } = render(<Component />);
    await waitFor(async () => {
      await getByTestId('BarcodeScanner_Container');
    });
  });

  it('does not render Camera component when camera permission is not granted', async () => {
    cameraPermissionMock = jest
      .spyOn(Camera, 'getCameraPermissionsAsync')
      .mockResolvedValue({ status: 'denied' } as PermissionResponse);
    const { getByText } = render(<Component />);
    await waitFor(async () => {
      expect(getByText('No access to camera')).toBeTruthy();
    });
  });

  it('calls onClose when Close button is pressed', async () => {
    cameraPermissionMock = jest
      .spyOn(Camera, 'getCameraPermissionsAsync')
      .mockResolvedValue({ status: 'granted' } as PermissionResponse);
    const { getByTestId } = render(<Component />);
    await waitFor(async () => {
      await getByTestId('BarcodeScanner_Container');
      await getByTestId('BarcodeScanner_Close_Button');
    });
    await act(async () => {
      await fireEvent.press(getByTestId('BarcodeScanner_Close_Button'));
    });
    expect(mockOnClose).toHaveBeenCalled();
  });
});
