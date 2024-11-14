import React, { useMemo } from 'react';
import { styles } from './styles';
import { Row, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { NETWORK, SHORTEN_NETWORK } from '@utils/bridge';
import { RightArrowIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { View } from 'react-native';

interface BridgeNetworksSelectedProps {
  type?: 'preview';
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
    <View>
      <Row justifyContent={'space-between'} alignItems="center" width={'100%'}>
        <Row
          justifyContent={'flex-start'}
          alignItems={'center'}
          style={styles.previewWrapper}
        >
          <TokenLogo
            scale={0.7}
            token={networkFrom}
            overrideIconVariants={{ eth: 'blue' }}
          />
          <Text fontSize={14} fontFamily="Inter_600SemiBold" color="#1D1D1D">
            {transformedNetworkName.from}
          </Text>
        </Row>
        <RightArrowIcon color={COLORS.neutral400} scale={1.35} />
        <Row
          justifyContent={'flex-start'}
          alignItems={'center'}
          style={styles.previewWrapper}
        >
          <TokenLogo
            scale={0.7}
            token={networkTo}
            overrideIconVariants={{ eth: 'blue' }}
          />
          <Text fontSize={14} fontFamily="Inter_600SemiBold" color="#1D1D1D">
            {transformedNetworkName.to}
          </Text>
        </Row>
      </Row>
    </View>
  );
};
