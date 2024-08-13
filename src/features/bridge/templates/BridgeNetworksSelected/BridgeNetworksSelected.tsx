import React, { useMemo } from 'react';
import { styles } from './styles';
import { Row, Spacer, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { NETWORK, SHORTEN_NETWORK } from '@utils/bridge';
import { RightArrowIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

interface BridgeNetworksSelectedProps {
  type?: 'preview';
  networkFrom: string;
  networkTo: string;
}

export const BridgeNetworksSelected = ({
  type,
  networkFrom,
  networkTo
}: BridgeNetworksSelectedProps) => {
  const { t } = useTranslation();

  const transformedNetworkName = useMemo(() => {
    return {
      from: SHORTEN_NETWORK[networkFrom as keyof typeof NETWORK],
      to: SHORTEN_NETWORK[networkTo as keyof typeof NETWORK]
    };
  }, [networkFrom, networkTo]);

  const isPreview = type === 'preview';

  return (
    <View>
      {isPreview && (
        <>
          <Row justifyContent={'space-between'}>
            <Text>{t('common.transaction.from')}</Text>
            <Spacer value={scale(10)} />
            <Text>{t('common.transaction.to')}</Text>
            <Spacer value={scale(10)} />
          </Row>
          <Spacer value={10} />
        </>
      )}
      <Row justifyContent={'space-between'} alignItems="center" width={'100%'}>
        <Row
          justifyContent={'center'}
          alignItems={'center'}
          style={styles.previewWrapper}
        >
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
        <Row
          justifyContent={'center'}
          alignItems={'center'}
          style={styles.previewWrapper}
        >
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
    </View>
  );
};
