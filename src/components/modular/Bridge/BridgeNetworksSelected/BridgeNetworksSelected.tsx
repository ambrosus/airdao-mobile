import React, { useMemo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Row, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { NETWORK, SHORTEN_NETWORK } from '@utils/bridge';
import { RightArrowIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

interface BridgeNetworksSelectedProps {
  networkFrom: string;
  networkTo: string;
}

export const BridgeNetworksSelected = ({
  networkFrom,
  networkTo
}: BridgeNetworksSelectedProps) => {
  const transformedNetworkName = useMemo(() => {
    return {
      from: SHORTEN_NETWORK[networkFrom as keyof typeof NETWORK],
      to: SHORTEN_NETWORK[networkTo as keyof typeof NETWORK]
    };
  }, [networkFrom, networkTo]);

  return (
    <Row alignItems="center" justifyContent="space-evenly">
      <Row style={styles.rowGap}>
        <TokenLogo
          scale={networkFrom === 'amb' ? 0.6 : 0.65}
          token={networkFrom}
          overrideIconVariants={{ eth: 'blue' }}
        />

        <Text fontSize={14} fontFamily="Inter_600SemiBold" color="#1D1D1D">
          {transformedNetworkName.from}
        </Text>
      </Row>

      <View style={styles.reorder}>
        <RightArrowIcon color={COLORS.black} />
      </View>

      <Row style={styles.rowGap}>
        <TokenLogo
          scale={networkTo === 'amb' ? 0.6 : 0.65}
          token={networkTo}
          overrideIconVariants={{ eth: 'blue' }}
        />

        <Text fontSize={14} fontFamily="Inter_600SemiBold" color="#1D1D1D">
          {transformedNetworkName.to}
        </Text>
      </Row>
    </Row>
  );
};
