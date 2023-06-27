import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { RightArrowIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { BinanceIcon } from '@components/svg/icons/Binance';
import { KuCoinIcon } from '@components/svg/icons/KuCoin';
import { ProBitGlobalIcon } from '@components/svg/icons/ProBitGlobal';
import { MEXCIcon } from '@components/svg/icons/MEXC';

interface MarketItem {
  title: string;
  icon: React.ReactNode;
  url: string;
}

const marketItems: MarketItem[] = [
  {
    title: 'Binance',
    url: 'https://www.binance.com/en/trade/AMB_USDT',
    icon: <BinanceIcon />
  },
  {
    title: 'KuCoin',
    url: 'https://www.kucoin.com/trade/AMB-USDT',
    icon: <KuCoinIcon />
  },
  {
    title: 'ProBit Global',
    url: 'https://www.probit.com/app/exchange/AMB-USDT',
    icon: <ProBitGlobalIcon />
  },
  {
    title: 'MEXC',
    url: 'https://www.mexc.com/exchange/AMB_USDT',
    icon: <MEXCIcon />
  }
];

export function AMBMarket(): JSX.Element {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };
  const renderItem = (item: MarketItem) => {
    return (
      <Button
        key={item.title}
        onPress={() => openLink(item.url)}
        style={styles.item}
      >
        <Row alignItems="center" justifyContent="space-between">
          <Row alignItems="center">
            {item.icon}
            <Spacer value={scale(8)} horizontal />
            <Text
              fontSize={14}
              fontFamily="Inter_600SemiBold"
              color={COLORS.jetBlack}
            >
              {item.title}
            </Text>
          </Row>
          <View style={{ transform: [{ rotate: '315deg' }] }}>
            <RightArrowIcon color={COLORS.frenchSkyBlue} scale={1.25} />
          </View>
        </Row>
      </Button>
    );
  };

  return <View>{marketItems.map(renderItem)}</View>;
}

const styles = StyleSheet.create({
  item: {
    marginBottom: verticalScale(24)
  }
});
