import { ReactNode } from 'react';
import { ViewProps, ViewStyle } from 'react-native';
import { ModalProps } from 'react-native-modal';

export interface BottomSheetProps {
  backdropColor?: string;
  height?: ViewStyle['height'];
  borderRadius?: ViewStyle['borderRadius'];
  children?: ReactNode;
  isNestedSheet?: boolean;
  containerStyle?: ViewProps['style'];
  avoidKeyboard?: ModalProps['avoidKeyboard'];
  fullscreen?: boolean;
  swiperIconVisible?: boolean;
  onClose?: () => unknown;
  testID?: string;
  swipingEnabled?: boolean;
}

export type BottomSheetRef = {
  /**
   * Shows modal
   */
  show: () => void;

  /**
   * Hides modal
   */
  dismiss: () => void;

  /**
   * true if modal is visible
   */
  isVisible: boolean;
};
