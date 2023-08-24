import TransactionController from './estimateGas/index.js';

export default async function (
  provider: any,
  gasPrice: string | number,
  from: any,
  to: any,
  value: string | number
) {
  if (from === to) return '21000';

  const gasPriceHex = '0x' + (+gasPrice).toString(16);
  const valueHex = '0x' + (+value).toString(16);

  const txController = new TransactionController({
    provider,
    getGasPrice: gasPriceHex
  });

  const res = await txController.addTxGasDefaults({
    txParams: {
      from,
      to,
      value: valueHex
    },
    history: [{}]
  });

  // @ts-ignore
  return parseInt(res.txParams.gas, 16);
}
