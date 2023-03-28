import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface BottomSheetProps {
  backdropColor?: string;
  height: number;
  borderRadius?: ViewStyle['borderRadius'];
  children?: ReactNode;
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
