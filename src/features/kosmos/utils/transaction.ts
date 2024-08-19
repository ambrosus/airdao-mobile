import { utils, BigNumber } from 'ethers';

function safeParseUnits(value: string, decimals: number): BigNumber | null {
  try {
    if (value === '') {
      return null;
    }

    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      throw new Error('Invalid value');
    }

    const [, fractionalPart] = value.split('.');
    if (fractionalPart && fractionalPart.length > decimals) {
      throw new Error('Fractional component exceeds decimals');
    }

    return utils.parseUnits(value, decimals);
  } catch (error) {
    console.error('Failed to parse units');
    return null;
  }
}

export function _willGetSubFee(
  amount: string,
  protocolFee: number,
  slippage: number,
  bondMarketPrice: number
): BigNumber | null {
  try {
    if (amount === '') {
      return null;
    }

    const parsedAmount = parseFloat(amount);

    if (
      isNaN(parsedAmount) ||
      isNaN(protocolFee) ||
      isNaN(slippage) ||
      isNaN(bondMarketPrice)
    ) {
      throw new Error('Invalid input values');
    }

    const fee = calculatedProtocolFee(parsedAmount, protocolFee);
    const result = ((parsedAmount - fee - slippage) * bondMarketPrice).toFixed(
      18
    );

    return safeParseUnits(result, 18);
  } catch (error) {
    console.error('Failed to parse units in _willGetSubFee');
    return null;
  }
}

export function _willGet(
  amount: string,
  bondMarketPrice: number
): BigNumber | null {
  try {
    if (amount === '') {
      return null;
    }

    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || isNaN(bondMarketPrice)) {
      throw new Error('Invalid input values');
    }

    const result = (parsedAmount * bondMarketPrice).toFixed(18);
    return safeParseUnits(result, 18);
  } catch (error) {
    console.error('Failed to parse units in _willGet');
    return null;
  }
}

// Assuming this function is defined and returns a number
function calculatedProtocolFee(amount: number, protocolFee: number): number {
  return amount * (protocolFee / 100);
}
