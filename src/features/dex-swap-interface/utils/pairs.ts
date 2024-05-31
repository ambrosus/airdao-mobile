export const supportedSwapPairs = [
  // AMB
  { from: 'AMB', to: 'SAMB', label: 'Swap' },
  { from: 'AMB', to: 'USDC', label: 'Swap' },
  { from: 'AMB', to: 'BOND', label: 'Swap' },

  // SAMB
  { from: 'SAMB', to: 'AMB', label: 'Unwrap' },
  { from: 'SAMB', to: 'USDC', label: 'Approve' },
  { from: 'SAMB', to: 'BOND', label: 'Approve' },

  // USDC
  { from: 'USDC', to: 'AMB', label: 'Swap' },
  { from: 'USDC', to: 'SAMB', label: 'Swap' },
  { from: 'USDC', to: 'BOND', label: 'Swap' },

  // BOND
  { from: 'BOND', to: 'AMB', label: 'Swap' },
  { from: 'BOND', to: 'SAMB', label: 'Swap' },
  { from: 'BOND', to: 'USDC', label: 'Swap' }
];
