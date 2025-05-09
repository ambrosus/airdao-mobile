export const MULTICALL_ABI = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'target',
            type: 'address'
          },
          {
            internalType: 'bytes',
            name: 'callData',
            type: 'bytes'
          }
        ],
        internalType: 'struct Multicall.Call[]',
        name: 'calls',
        type: 'tuple[]'
      }
    ],
    name: 'aggregate',
    outputs: [
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256'
      },
      {
        internalType: 'bytes[]',
        name: 'returnData',
        type: 'bytes[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

export const MULTICALL_ADDRESSES = {
  testnet: '0xBE6CA1814Bdb27CDDd040bc1db8294Af5E76e0E0',
  prod: '0x2F52348a707ede8Dbcf2BF79cbd65406E92522BD'
};
