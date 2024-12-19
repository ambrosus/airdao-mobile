import { wrapTokenIcon } from '@utils/token';

const MockWithNameWithDB = {
  address: '0x24f3811961685888c7a1966cAec194e5444bfC0D',
  balance: {
    ether: 100,
    formattedBalance: '100.0',
    symbol: 'AST',
    wei: '100000000000000000000'
  },
  decimals: 18,
  isNativeCoin: '',
  name: 'Astra Token',
  symbol: 'AST',
  tokenNameFromDatabase: 'Astra'
};

describe('tokens util test', () => {
  it('wrap token icon with token name from db', () => {
    const key = wrapTokenIcon(MockWithNameWithDB);

    expect(key).toBe('Astra');
  });

  it('wrap token icon amb', () => {
    const key = wrapTokenIcon({ ...MockWithNameWithDB, symbol: 'AMB' });

    expect(key).toBe('AirDAO');
  });

  it('wrap token icon amb', () => {
    const key = wrapTokenIcon({
      ...MockWithNameWithDB,
      symbol: 'AMB',
      tokenNameFromDatabase: 'unknown'
    });

    expect(key).toBe('AirDAO');
  });
});
