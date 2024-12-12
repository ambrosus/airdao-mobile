import { CryptoCurrencyCode } from '@appTypes';

export interface StakePreviewDataModel {
  amount: string;
  token: CryptoCurrencyCode;
  receiveAmount: string;
  receiveToken: CryptoCurrencyCode;
  fromAddress: string;
  apy: string;
}

export interface BottomSheetHarborStakePreViewProps {
  previewData: StakePreviewDataModel;
}

export interface WithdrawPreviewModel {
  amount: string;
  delay: number;
  rewardAmb: string;
  rewardBond: string;
}

export interface BottomSheetHarborWithdrawPreViewProps {
  previewData: WithdrawPreviewModel;
}
