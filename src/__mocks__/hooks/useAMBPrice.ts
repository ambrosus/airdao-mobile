export const MockAMBPrice = {
  _id: '123123',
  id: 123,
  name: '123123',
  symbol: '123',
  circulatingSupply: 123123,
  maxSupply: null,
  totalSupply: 123123,
  rank: 123,
  percentChange1H: 123,
  percentChange24H: 123,
  percentChange7D: 123,
  priceUSD: 123,
  volumeUSD: 3333,
  marketCapUSD: 111
};
export const mockUseAMBPrice = jest.fn(() => ({
  data: MockAMBPrice,
  loading: false,
  error: undefined
}));
