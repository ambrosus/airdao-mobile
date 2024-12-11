import { CryptoCurrencyCode } from '@appTypes';

export interface PreviewDataModel {
  amount: string;
  token: CryptoCurrencyCode;
  receiveAmount: string;
  receiveToken: CryptoCurrencyCode;
  fromAddress: string;
  apy: string;
}

export interface BottomSheetHarborPreViewProps {
  previewData: PreviewDataModel;
  type?: 'stake' | 'withdraw';
}
