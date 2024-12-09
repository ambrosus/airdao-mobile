import { CryptoCurrencyCode } from '@appTypes';

export interface PreviewDataModel {
  stakeAmount: string;
  stakeToken: CryptoCurrencyCode;
  receiveAmount: string;
  receiveToken: CryptoCurrencyCode;
  fromAddress: string;
  apy: string;
}

export interface BottomSheetHarborPreViewProps {
  previewData: PreviewDataModel;
}
