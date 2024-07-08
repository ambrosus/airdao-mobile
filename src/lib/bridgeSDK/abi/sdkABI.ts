import { ethers } from 'ethers';

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)'
];

const BRIDGE_ABI = [
  'function withdraw(address token, address to, uint256 amount, bool needUnwrap, bytes signature, uint256 transferFee, uint256 bridgeFee) payable',
  'function wrapWithdraw(address to, bytes signature, uint256 transferFee, uint256 bridgeFee) payable'
];

export const erc20Contract = new ethers.Contract(
  ethers.constants.AddressZero,
  ERC20_ABI
);
export const bridgeContract = new ethers.Contract(
  ethers.constants.AddressZero,
  BRIDGE_ABI
);
