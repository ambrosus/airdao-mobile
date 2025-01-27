import { ReactNode } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import {
  BinanceIcon,
  ProbitIcon,
  KucoinIcon,
  MexcIcon
} from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

interface MarketItem {
  title: string;
  icon: ReactNode;
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
    icon: <KucoinIcon />
  },
  {
    title: 'ProBit Global',
    url: 'https://www.probit.com/app/exchange/AMB-USDT',
    icon: <ProbitIcon />
  },
  {
    title: 'MEXC',
    url: 'https://www.mexc.com/exchange/AMB_USDT',
    icon: <MexcIcon />
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
        <Row alignItems="center">
          {item.icon}
          <Spacer value={scale(8)} horizontal />
          <Text
            fontSize={14}
            fontFamily="Inter_600SemiBold"
            color={COLORS.brand600}
          >
            {item.title}
          </Text>
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
