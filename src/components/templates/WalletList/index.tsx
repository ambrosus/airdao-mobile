import React, { useReducer, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Row, Text } from '@components/base';
import { NumberUtils } from '@utils/number';
import { scale, verticalScale } from '@utils/scaling';
import {
  RotationAnimation,
  RotationAnimationRef
} from '@components/animations';
import { WalletItem } from '../WalletItem';
import { ChevronDownIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { useNavigation } from '@react-navigation/native';
import { ExplorerAccount } from '@models/Explorer';
import { WalletsNavigationProp } from '@appTypes/navigation';

interface WalletListProps {
  title: string;
  totalAmount: number;
  data: ExplorerAccount[];
}

export function WalletList(props: WalletListProps): JSX.Element {
  const { title, totalAmount, data } = props;
  const [listOpened, toggleList] = useReducer((opened) => !opened, false);
  const rotationAnimation = useRef<RotationAnimationRef>(null);
  // TODO set navigation prop
  const navigation = useNavigation<WalletsNavigationProp>();

  const onTogglePress = () => {
    rotationAnimation.current?.rotate();
    toggleList();
  };

  const renderWalletItem = (item: ExplorerAccount, idx: number) => {
    const navigateToAddressDetails = () => {
      navigation.navigate('Address', { address: item.address });
    };
    return (
      <Button key={idx} style={styles.item} onPress={navigateToAddressDetails}>
        <WalletItem item={item} />
      </Button>
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
    borderRadius: scale(36),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    padding: scale(12)
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
