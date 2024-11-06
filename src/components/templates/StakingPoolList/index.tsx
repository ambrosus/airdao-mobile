import React from 'react';
import { FlatList, FlatListProps, ListRenderItemInfo } from 'react-native';
import { StakingPoolItem } from '@components/modular';
import { StakingPool } from '@models';
import { Button } from '@components/base';

interface StakingPoolListProps
  extends Omit<
    FlatListProps<StakingPool>,
    'showsVerticalScrollIndicator' | 'data' | 'renderItem' | 'keyExtractor'
  > {
  stakingPools: StakingPool[];
  onPressItem?: (stakingPool: StakingPool) => unknown;
}

const HPT_ADDRESS = '0x322269e52800e5094c008f3b01A3FD97BB3C8f5D';

export const StakingPoolList = (props: StakingPoolListProps) => {
  const { stakingPools, onPressItem, ...restProps } = props;

  const renderStakingPool = (args: ListRenderItemInfo<StakingPool>) => {
    const onPress = () => {
      if (typeof onPressItem === 'function') onPressItem(args.item);
    };
    const isHPTToken = args.item.token.address === HPT_ADDRESS;
    const disabledPools = !args.item.isActive && !isHPTToken;

    return (
      <Button
        onPress={onPress}
        disabled={typeof onPressItem !== 'function' || disabledPools}
      >
        <StakingPoolItem stakingPool={args.item} />
      </Button>
    );
  };
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={stakingPools}
      renderItem={renderStakingPool}
      keyExtractor={(stakingPool, idx) => `${stakingPool.token.name}-${idx}`}
      {...restProps}
    />
  );
};
