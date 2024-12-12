import { CryptoCurrencyCode } from '@appTypes';

export interface PreviewDataModel {
  amount: string;
  token: CryptoCurrencyCode;
  receiveAmount: string;
  receiveToken: CryptoCurrencyCode;
  fromAddress: string;
  apy: string;
}

export interface BottomSheetHarborStakePreViewProps {
  previewData: PreviewDataModel;
  type?: 'stake' | 'withdraw';
}
