import {
  processStake,
  processWithdraw,
  processWithdrawReward
} from './processHelpers';
import {
  HarborPreView,
  ModalTypes
} from '@features/harbor/components/modular/harbor-preview/model';
import { IsNullableAccount } from '@entities/wallet/model/types';

export const processFunction = async (
  modalType: ModalTypes,
  wallet: IsNullableAccount,
  previewData: HarborPreView,
  activeAmbTier: { value: number }
) => {
  switch (modalType) {
    case 'stake': {
      return await processStake(
        wallet,
        'amount' in previewData ? previewData?.amount : ''
      );
    }
    case 'withdraw-stake': {
      return await processWithdraw(
        wallet,
        'withdrawAmount' in previewData ? previewData.withdrawAmount : '',
        activeAmbTier.value
      );
    }
    case 'withdraw-reward': {
      return await processWithdrawReward(wallet, activeAmbTier.value);
    }
  }
};
