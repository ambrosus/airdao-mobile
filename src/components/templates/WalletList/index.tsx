import React, { useReducer, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Row, Text } from '@components/base';
import { NumberUtils } from '../../../utils/number';
import { scale, verticalScale } from '../../../utils/scaling';
import {
  RotationAnimation,
  RotationAnimationRef
} from '@components/animations';
import { WalletItem, Wallet } from '../WalletItem';
import { ChevronDownIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

interface WalletListProps {
  title: string;
  totalAmount: number;
  data: Wallet[];
}

export function WalletList(props: WalletListProps): JSX.Element {
  const { title, totalAmount, data } = props;
  const [listOpened, toggleList] = useReducer((opened) => !opened, false);
  const rotationAnimation = useRef<RotationAnimationRef>(null);

  const onTogglePress = () => {
    rotationAnimation.current?.rotate();
    toggleList();
  };

  const renderWalletItem = (item: Wallet, idx: number) => {
    return (
      <View key={idx} style={styles.item}>
        <WalletItem item={item} />
      </View>
    );
  };

  return (
    <>
      <Row alignItems="center" justifyContent="space-between">
        <Row alignItems="center">
          <Text title fontWeight="500">
            {title} {'   '}
          </Text>
          <Text subtitle fontSize={13} fontWeight="600">
            ~ ${NumberUtils.formatNumber(totalAmount, 0)}
          </Text>
        </Row>
        <Button
          type="circular"
          style={styles.toggleBtn}
          onPress={onTogglePress}
        >
          <RotationAnimation ref={rotationAnimation}>
            <ChevronDownIcon color={COLORS.black} />
          </RotationAnimation>
        </Button>
      </Row>
      {listOpened && (
        <View style={styles.list}>{data.map(renderWalletItem)}</View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  toggleBtn: {
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    padding: 12
  },
  chevronIcon: {
    width: scale(12),
    height: scale(12)
  },
  list: {
    paddingTop: verticalScale(1)
  },
  item: {
    marginTop: verticalScale(20)
  }
});
