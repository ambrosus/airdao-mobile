import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface BottomSheetProps {
  backdropColor?: string;
  height?: ViewStyle['height'];
  borderRadius?: ViewStyle['borderRadius'];
  children?: ReactNode;
  isNestedSheet?: boolean;
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
