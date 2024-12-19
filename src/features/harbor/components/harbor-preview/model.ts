import { TextStyle } from 'react-native';
import { CryptoCurrencyCode } from '@appTypes';

export type ModalTypes = 'stake' | 'withdraw-stake' | 'withdraw-reward';
export interface HarborPreViewData {
  name: string;
  value: string;
  symbol?: CryptoCurrencyCode;
  textStyle?: TextStyle;
  timeSymbol?: string;
  title?: boolean;
}
export interface StakePreviewDataModel {
  amount: string;
  token: CryptoCurrencyCode;
  receiveAmount: string;
  receiveToken: CryptoCurrencyCode;
  fromAddress: string;
  apy: string;
}

export interface WithdrawPreviewDataModel {
  withdrawAmount: string;
  rewardAmb: string;
  rewardBond: string;
  delay: string;
}

export interface FormTemplateProps {
  data: HarborPreViewData[] | undefined;
  buttonTitle: string;
  onAcceptPress: () => void;
  loading: boolean;
}

export interface SuccessTemplateDataProps {
  onPreviewClose: () => void;
  data: HarborPreViewData[] | [] | undefined;
  modalType: ModalTypes;
  transactionHash: string;
}

export type HarborPreView = StakePreviewDataModel | WithdrawPreviewDataModel;

export interface BottomSheetHarborPreViewProps {
  modalType: ModalTypes;
  previewData: HarborPreView;
  amountSetter?: (payload: string) => void;
}
