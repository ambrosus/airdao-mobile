import { ethers } from 'ethers';
import { TFunction } from 'i18next';
import {
  FIELD,
  MultiplyBalancesStateType,
  SelectedTokensAmountState,
  SelectedTokensState
} from '../types';
import { dexValidators } from './validators';

export function buttonActionString(
  selectedTokens: SelectedTokensState,
  selectedAmount: SelectedTokensAmountState,
  bnBalanceAmount: MultiplyBalancesStateType,
  t: TFunction<'translation', undefined>
) {
  const { TOKEN_A, TOKEN_B } = selectedTokens;
  const { TOKEN_A: AMOUNT_A, TOKEN_B: AMOUNT_B } = selectedAmount;

  const isSomeTokenNotSelected = !TOKEN_A || !TOKEN_B;

  const isSomeBalanceIsEmpty =
    dexValidators.isEmptyAmount(AMOUNT_A) ||
    dexValidators.isEmptyAmount(AMOUNT_B);

  if (isSomeBalanceIsEmpty || isSomeTokenNotSelected) {
    return t('button.enter.amount');
  }

  const bnInputABalance = bnBalanceAmount[FIELD.TOKEN_A]?._hex;
  const bnSelectedAmount = ethers.utils.parseEther(
    selectedAmount[FIELD.TOKEN_A]
  );

  if (bnInputABalance) {
    if (bnSelectedAmount.gt(bnInputABalance)) {
      return t('swap.button.insufficient');
    }
  }

  return t('common.review');
}
