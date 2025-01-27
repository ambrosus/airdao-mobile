export interface StakeHBRActionsStore {
  amount: string;
  onChangeHBRAmountToStake: (payload: string) => void;

  ambAmount: string;
  onChangeAMBAmountToStake: (payload: string) => void;
}
