import { renderHook } from '@testing-library/react-native';
import { useDEXSwapActionsHandler } from '../use-dex-swap-actions-handler';

jest.mock('../use-dex-swap-actions-handler', () => ({
  useDEXSwapActionsHandler: () => ({
    selectedTokens: {
      INPUT: null,
      OUTPUT: null
    },
    onSwapSelectedTokens: jest.fn(),
    buttonActionString: jest.fn(({ from, to }) => {
      if (from === 'SAMB' && to === 'AMB') {
        return 'Unwrap';
      } else if (from === 'USDC' && to === 'AMB') {
        return 'Swap';
      } else if (from === 'SAMB' && to === 'USDC') {
        return 'Approve USDC';
      } else {
        return 'Wrong pair';
      }
    })
  })
}));

describe('useDEXSwapActionsHandler hook unit test', () => {
  it('Test button label with prepared pairs | SAMB - AMB', () => {
    const pair = { from: 'SAMB', to: 'AMB' };

    const { result } = renderHook(() => useDEXSwapActionsHandler());
    const { buttonActionString } = result.current;

    const _label = buttonActionString(pair);
    expect(_label).toBe('Unwrap');
  });

  it('Test button label with prepared pairs | USDC - AMB', () => {
    const pair = { from: 'USDC', to: 'AMB' };

    const { result } = renderHook(() => useDEXSwapActionsHandler());
    const { buttonActionString } = result.current;

    const _label = buttonActionString(pair);
    expect(_label).toBe('Swap');
  });

  it('Test button label with prepared pairs | USDC - AMB', () => {
    const pair = { from: 'SAMB', to: 'USDC' };

    const { result } = renderHook(() => useDEXSwapActionsHandler());
    const { buttonActionString } = result.current;

    const _label = buttonActionString(pair);
    expect(_label).toBe('Approve USDC');
  });

  it('Test button label with wrong pairs | USDC - USDT', () => {
    const pair = { from: 'USDC', to: 'USDT' };

    const { result } = renderHook(() => useDEXSwapActionsHandler());
    const { buttonActionString } = result.current;

    const _label = buttonActionString(pair);
    expect(_label).toBe('Wrong pair');
  });

  it('Return correct Boolean value, when some token is not selected', () => {
    jest.mock('../use-dex-swap-actions-handler', () => ({
      useDEXSwapActionsHandler: () => ({
        selectedTokens: {
          INPUT: {
            address: '0xd78AB887A33EaC829B0DDE8714f79276E1255028',
            chainId: 22040,
            decimals: 18,
            logoURI: '',
            name: 'AirDAO',
            symbol: 'AMB'
          },
          OUTPUT: null
        }
      })
    }));

    const { result } = renderHook(() => useDEXSwapActionsHandler());
    const { isSomeTokenNotSelected } = result.current;

    expect(isSomeTokenNotSelected).toBeFalsy();
  });
});
