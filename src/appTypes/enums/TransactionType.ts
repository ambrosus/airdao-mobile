export enum TransactionType {
  Transfer = 'Transfer',
  ERC20 = '/ERC-20_Tx',
  TokenTransfer = 'TokenTransfer',
  BlockReward = 'BlockReward',
  ShelteringTransferResolve = 'ShelteringTransfers::resolve',
  ShelteringTransferSheltering = 'Sheltering::transferSheltering',
  ShelteringRemoveShelterer = 'Sheltering::removeShelterer',
  ERC1155 = 'ERC-1155',
  ContractCall = 'ContractCall',
  Transaction = 'Transaction'
}
