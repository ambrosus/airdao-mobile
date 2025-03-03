import { Dispatch, ReactNode, SetStateAction } from 'react';
import { ViewProps, ViewStyle } from 'react-native';
import { ModalProps } from 'react-native-modal';

export enum ModalActionTypes {
  PERMISSIONS = 'permissions',
  PERSONAL_SIGN = 'personalSign',
  SEND_TRANSACTION = 'sendTransaction',
  DISCONNECT = 'disconnect'
}

export interface BottomSheetOutsideDataProps {
  modalType?: ModalActionTypes;
  title?: string;
  subTitle?: string;
  buttonsLabels?: string[];
  onReject?: () => void;
  onApprove?: () => void;
  selectedAddress?: string;
  onWalletSelect?: (address: string) => Promise<string>;
}

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
  closeOnBackPress?: boolean;
  onBackdropPress?: () => void;
  onCustomCrossPress?: () => void;
  title?: string;
  setOutsideModalData?: Dispatch<SetStateAction<BottomSheetOutsideDataProps>>;
}

export type BottomSheetRef = {
  /**
   * Shows modal
   */
  show: (props?: BottomSheetOutsideDataProps) => void;

  /**
   * Hides modal
   */
  dismiss: () => void;

  /**
   * true if modal is visible
   */
  isVisible: boolean;
};
