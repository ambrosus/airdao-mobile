export const PAIR = [
  {
    name: 'getReserves',
    type: 'function',
    inputs: [],
    outputs: [
      {
        name: '_reserve0',
        type: 'uint112',
        internalType: 'uint112'
      },
      {
        name: '_reserve1',
        type: 'uint112',
        internalType: 'uint112'
      },
      {
        name: '_blockTimestampLast',
        type: 'uint32',
        internalType: 'uint32'
      }
    ],
    payable: false,
    constant: true,
    stateMutability: 'view'
  },
  {
    name: 'token0',
    type: 'function',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address'
      }
    ],
    payable: false,
    constant: true,
    stateMutability: 'view'
  },
  {
    name: 'token1',
    type: 'function',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address'
      }
    ],
    payable: false,
    constant: true,
    stateMutability: 'view'
  }
];
