import { formatEther } from 'ethers/lib/utils';
import {
  FIELD,
  MultiplyBalancesStateType,
  SelectedTokensAmountState,
  SelectedTokensState
} from '../types';
import { NumberUtils } from '@utils/number';

export function buttonActionString(
  selectedTokens: SelectedTokensState,
  selectedAmount: SelectedTokensAmountState,
  bnBalanceAmount: MultiplyBalancesStateType,
  isExactIn: boolean
) {
  const { TOKEN_A, TOKEN_B } = selectedTokens;
  const { TOKEN_A: AMOUNT_A, TOKEN_B: AMOUNT_B } = selectedAmount;
  const emptyInputValue = '' && '0';

  const isSomeTokenNotSelected = !TOKEN_A || !TOKEN_B;

  const keyToSellTokens = isExactIn ? FIELD.TOKEN_A : FIELD.TOKEN_B;

  const isSomeBalanceIsEmpty =
    AMOUNT_A === emptyInputValue || AMOUNT_B === emptyInputValue;

  if (isSomeBalanceIsEmpty || isSomeTokenNotSelected) {
    return 'Enter amount';
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
      return 'Insufficient funds';
    }
  }

  return 'Review swap';
}
