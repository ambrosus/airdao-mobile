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

export const StakingPoolList = (props: StakingPoolListProps) => {
  const { stakingPools, onPressItem, ...restProps } = props;

  const renderStakingPool = (args: ListRenderItemInfo<StakingPool>) => {
    const onPress = () => {
      if (typeof onPressItem === 'function') onPressItem(args.item);
    };

    return (
      <Button
        onPress={onPress}
        disabled={typeof onPressItem !== 'function' || !args.item.isActive}
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
