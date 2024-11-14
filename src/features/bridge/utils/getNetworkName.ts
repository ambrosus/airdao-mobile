export const getNetworkNames = (name: string) => {
  switch (name) {
    case 'eth':
      return 'Ethereum';
    case 'bsc':
      return 'BNB Chain';
    default:
      return 'AirDAO';
  }
};
