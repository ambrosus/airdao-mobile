export const HBR_POOL = [
  {
    anonymous: false,
    inputs: [],
    name: 'Activated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'Claim',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [],
    name: 'Deactivated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'Deposited',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8'
      }
    ],
    name: 'Initialized',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'Interest',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'rewardTokenPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'interest',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'interestRate',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'minDepositValue',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'minStakeValue',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'fastUnstakePenalty',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'unstakeLockPeriod',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'stakeLockPeriod',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'maxTotalStakeValue',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'maxStakePerUserValue',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'stakeLimitsMultiplier',
            type: 'uint256'
          }
        ],
        indexed: false,
        internalType: 'struct LimitedTokenPool.LimitsConfig',
        name: 'config',
        type: 'tuple'
      }
    ],
    name: 'LimitsConfigChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32'
      }
    ],
    name: 'RoleAdminChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      }
    ],
    name: 'RoleGranted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      }
    ],
    name: 'RoleRevoked',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'Staked',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'unlockTime',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'creationTime',
        type: 'uint256'
      }
    ],
    name: 'UnstakeLocked',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'Withdrawn',
    type: 'event'
  },
  {
    inputs: [],
    name: 'BILLION',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'activate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'active',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'deactivate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'getDeposit',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'getMaxUserStakeValue',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getName',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      }
    ],
    name: 'getRoleAdmin',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'getStake',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'getUserRewards',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'hasRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'info',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalStake',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'totalDeposit',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'totalRewards',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'lastInterestUpdate',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'totalRewardsDebt',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract RewardsBank',
        name: 'rewardsBank_',
        type: 'address'
      },
      {
        internalType: 'contract LockKeeper',
        name: 'lockkeeper_',
        type: 'address'
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string'
          },
          {
            internalType: 'address',
            name: 'limitsMultiplierToken',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'profitableToken',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'rewardToken',
            type: 'address'
          }
        ],
        internalType: 'struct LimitedTokenPool.MainConfig',
        name: 'config_',
        type: 'tuple'
      }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'limitsConfig',
    outputs: [
      {
        internalType: 'uint256',
        name: 'rewardTokenPrice',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'interest',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'interestRate',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'minDepositValue',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'minStakeValue',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'fastUnstakePenalty',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'unstakeLockPeriod',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'stakeLockPeriod',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'maxTotalStakeValue',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'maxStakePerUserValue',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'stakeLimitsMultiplier',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lockKeeper',
    outputs: [
      {
        internalType: 'contract LockKeeper',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'mainConfig',
    outputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string'
      },
      {
        internalType: 'address',
        name: 'limitsMultiplierToken',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'profitableToken',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'rewardToken',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'onBlock',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'receive',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'rewardsBank',
    outputs: [
      {
        internalType: 'contract RewardsBank',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'rewardTokenPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'interest',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'interestRate',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'minDepositValue',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'minStakeValue',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'fastUnstakePenalty',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'unstakeLockPeriod',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'stakeLockPeriod',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'maxTotalStakeValue',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'maxStakePerUserValue',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'stakeLimitsMultiplier',
            type: 'uint256'
          }
        ],
        internalType: 'struct LimitedTokenPool.LimitsConfig',
        name: 'config',
        type: 'tuple'
      }
    ],
    name: 'setLimitsConfig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4'
      }
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'unstakeFast',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
