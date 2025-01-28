import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { Row, Spacer, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { RewardsIcon } from '@components/svg/icons/v2/harbor';
import { COLORS } from '@constants/colors';
import { useStakeHBRStore } from '@entities/harbor/model';
import { NumberUtils } from '@utils';
import { styles } from './styles';

export const Rewards = () => {
  const { t } = useTranslation();
  const { rewards } = useStakeHBRStore();

  return (
    <Row
      width="100%"
      alignItems="center"
      justifyContent="space-between"
      style={styles.container}
    >
      <Row alignItems="center">
        <RewardsIcon />
        <Spacer horizontal value={4} />
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
        >
          {t('harbor.rewards.label')}
        </Text>
      </Row>
      <Row style={styles.rightRowContainer} alignItems="center">
        <TokenLogo scale={0.75} address={ethers.constants.AddressZero} />
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
        >
          {NumberUtils.formatDecimal(ethers.utils.formatEther(rewards), 2)}{' '}
          {CryptoCurrencyCode.AMB}
        </Text>
      </Row>
    </Row>
  );
};
