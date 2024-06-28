import { formatEther } from 'ethers/lib/utils';
import {
  FIELD,
  MultiplyBalancesStateType,
  SelectedTokensAmountState,
  SelectedTokensState
} from '../types';
import { NumberUtils } from '@utils/number';
import { TFunction } from 'i18next';

export function buttonActionString(
  selectedTokens: SelectedTokensState,
  selectedAmount: SelectedTokensAmountState,
  bnBalanceAmount: MultiplyBalancesStateType,
  isExactIn: boolean,
  t: TFunction<'translation', undefined>
) {
  const { TOKEN_A, TOKEN_B } = selectedTokens;
  const { TOKEN_A: AMOUNT_A, TOKEN_B: AMOUNT_B } = selectedAmount;

  const emptyInputValue = '' && '0';

  const isSomeTokenNotSelected = !TOKEN_A || !TOKEN_B;

  const keyToSellTokens = FIELD.TOKEN_A;

  const isSomeBalanceIsEmpty =
    AMOUNT_A === emptyInputValue || AMOUNT_B === emptyInputValue;

  if (isSomeBalanceIsEmpty || isSomeTokenNotSelected) {
    return t('button.enter.amount');
  }

  const lastChangedInputBalance = bnBalanceAmount[keyToSellTokens]?._hex;

  if (lastChangedInputBalance) {
    const normalizedBalanceAmount = NumberUtils.limitDecimalCount(
      formatEther(lastChangedInputBalance),
      18
    );

    if (
      Number(selectedAmount[keyToSellTokens]) > Number(normalizedBalanceAmount)
    ) {
      return t('swap.button.insufficient');
    }
  }

  return t('swap.button.review');
}
