import React from 'react';
import { render } from '@testing-library/react-native';
import { Camera, PermissionResponse } from 'expo-camera';
import { BarcodeScanner } from '@components/templates';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import clearAllMocks = jest.clearAllMocks;

jest.mock('victory-native', () => {
  return {
    VictoryChart: jest.fn(),
    VictoryTheme: {},
    VictoryLine: jest.fn(),
    VictoryAxis: jest.fn()
  };
});

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

  beforeEach(() => {
    clearAllMocks();
    mockOnScanned = jest.fn();
    mockOnClose = jest.fn();
  });

  it('renders Camera component when camera permission is granted', async () => {
    cameraPermissionMock = jest
      .spyOn(Camera, 'getCameraPermissionsAsync')
      .mockResolvedValue({ status: 'granted' } as PermissionResponse);
    const { queryByTestId } = render(<Component />);
    const camera = queryByTestId('BarcodeScanner_Container');
    expect(camera).toBeDefined();
  });

  it('does not render Camera component when camera permission is not granted', async () => {
    cameraPermissionMock = jest
      .spyOn(Camera, 'getCameraPermissionsAsync')
      .mockResolvedValue({ status: 'denied' } as PermissionResponse);
    const { queryByTestId } = render(<Component />);
    const camera = queryByTestId('BarcodeScanner_Container');
    expect(camera).toBeNull();
  });

  // TODO onClose
  // it('calls onClose when Close button is pressed', async () => {
  //   cameraPermissionMock = jest
  //     .spyOn(Camera, 'getCameraPermissionsAsync')
  //     .mockImplementation(() => {
  //       return { status: 'granted' };
  //     });
  //   const { queryByTestId } = render(<Component />);
  //   const closeButton = queryByTestId('BarcodeScanner_Close_Button');
  //   act(() => {
  //     fireEvent.press(closeButton);
  //   });
  //   expect(mockOnClose).toHaveBeenCalled();
  // });
});
