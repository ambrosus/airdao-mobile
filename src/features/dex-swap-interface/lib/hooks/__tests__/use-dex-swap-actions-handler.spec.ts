import { renderHook } from '@testing-library/react-native';
import { useDEXSwapActionsHandler } from '../use-dex-swap-actions-handler';
import { useDEXSwapContextSelector } from '@features/dex-swap-interface/model/dex-swap.context';

jest.mock('@features/dex-swap-interface/model/dex-swap.context', () => ({
  useDEXSwapContextSelector: jest.fn()
}));

describe('useDEXSwapActionsHandler hook unit test', () => {
  beforeEach(() => {
    (useDEXSwapContextSelector as jest.Mock).mockReturnValue({
      selectedTokens: {
        INPUT: null,
        OUTPUT: null
      },
      setSelectedTokens: jest.fn()
    });
  });

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
    (useDEXSwapContextSelector as jest.Mock).mockReturnValue({
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
      },
      setSelectedTokens: jest.fn()
    });

    const { result } = renderHook(() => useDEXSwapActionsHandler());
    const { isSomeTokenNotSelected } = result.current;

    expect(isSomeTokenNotSelected).toBeTruthy();
  });
  it('Return correct Boolean value, when paired tokens are selected', () => {
    (useDEXSwapContextSelector as jest.Mock).mockReturnValue({
      selectedTokens: {
        INPUT: {
          address: '0xd78AB887A33EaC829B0DDE8714f79276E1255028',
          chainId: 22040,
          decimals: 18,
          logoURI: '',
          name: 'AirDAO',
          symbol: 'AMB'
        },
        OUTPUT: {
          address: '0xFF9F502976E7bD2b4901aD7Dd1131Bb81E5567de',
          chainId: 22040,
          decimals: 18,
          logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
          name: 'USDC',
          symbol: 'USDC'
        }
      },
      setSelectedTokens: jest.fn()
    });

    const { result } = renderHook(() => useDEXSwapActionsHandler());
    const { isSomeTokenNotSelected } = result.current;

    expect(isSomeTokenNotSelected).toBeFalsy();
  });
});
