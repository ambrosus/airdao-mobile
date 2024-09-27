import { ethers } from 'ethers';
import { TFunction } from 'i18next';
import {
  FIELD,
  MultiplyBalancesStateType,
  SelectedTokensAmountState,
  SelectedTokensState
} from '../types';
import { dexValidators } from './validators';
import { CryptoCurrencyCode } from '@appTypes';

export function buttonActionString(
  selectedTokens: SelectedTokensState,
  selectedAmount: SelectedTokensAmountState,
  bnBalanceAmount: MultiplyBalancesStateType,
  t: TFunction<'translation', undefined>,
  multihops: boolean
) {
  const { TOKEN_A, TOKEN_B } = selectedTokens;
  const { TOKEN_A: AMOUNT_A, TOKEN_B: AMOUNT_B } = selectedAmount;

  const isSomeTokenNotSelected = !TOKEN_A || !TOKEN_B;

  const isAdoge =
    TOKEN_A?.symbol === CryptoCurrencyCode.ADOGE ||
    TOKEN_B?.symbol === CryptoCurrencyCode.ADOGE;
  const isAmbOrSamb = [TOKEN_A?.symbol, TOKEN_B?.symbol].some(
    (symbol) =>
      symbol === CryptoCurrencyCode.AMB || symbol === CryptoCurrencyCode.SAMB
  );

  if (isAdoge && !isAmbOrSamb && !multihops) {
    return ' Enable multi-hop trades';
  }

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

  return t('swap.button.review');
}
