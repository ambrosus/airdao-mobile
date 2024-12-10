import React, { useState } from 'react';
import { View } from 'react-native';
import { scale } from '@utils/scaling';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { InputWithoutTokenSelect } from '@components/templates';
import { formatEther } from 'ethers/lib/utils';

export const WithdrawStakeRewardTab = () => {
  // const { wallet } = useWalletStore();
  const [amountToWithdraw, setAmountToWithdraw] = useState('');

  const { token, data: harborData } = useHarborStore();
  const { userStaked } = harborData;
  return (
    <View style={{ paddingHorizontal: scale(16) }}>
      <InputWithoutTokenSelect
        value={amountToWithdraw}
        token={token}
        onChangeText={setAmountToWithdraw}
        onPressMaxAmount={() => {
          setAmountToWithdraw(formatEther(userStaked));
        }}
      />
    </View>
  );
};
