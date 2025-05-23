import { TouchableOpacity, View } from 'react-native';
import { Row, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import {
  RewardTokenNamesModel,
  TierRewardItem
} from '@entities/harbor/model/types';
import { NumberUtils } from '@utils';
import { TierItem } from '../tier-item';
import { styles } from './styles';

interface TokenRewardProps {
  rewardTokenName: RewardTokenNamesModel;
  selectedTokenReward: TierRewardItem;
  amount: string;
  onItemPress: (payload: TierRewardItem) => void;
  rewardTiers: TierRewardItem[];
  userTier: number;
}
export const TokenReward = ({
  rewardTokenName,
  selectedTokenReward,
  amount,
  onItemPress,
  rewardTiers,
  userTier
}: TokenRewardProps) => {
  const onRewardPress = (item: TierRewardItem) => {
    return;
    onItemPress(item);
  };
  return (
    <Row justifyContent={'space-between'}>
      <View style={styles.rewardWrapper}>
        <TokenLogo token={rewardTokenName} scale={0.8} />
        <Text style={styles.valueText}>
          {NumberUtils.abbreviateNumber(+amount)}
        </Text>
      </View>
      <View style={styles.tierWrapper}>
        {rewardTiers.map((item) => {
          return (
            <TouchableOpacity key={item.id} onPress={() => onRewardPress(item)}>
              <TierItem
                isActive={selectedTokenReward?.id === item?.id || false}
                key={item.id}
                userTier={userTier}
                rewardValue={item}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </Row>
  );
};
