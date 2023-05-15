import React, { useReducer, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { NumberUtils } from '@utils/number';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import {
  RotationAnimation,
  RotationAnimationRef
} from '@components/animations';
import { WalletItem } from '../WalletItem';
import {
  ChevronDownIcon,
  EmptyWalletListPlaceholderIcon,
  PlusIcon
} from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { useNavigation } from '@react-navigation/native';
import { ExplorerAccount } from '@models/Explorer';
import { TabsParamsList, WalletsNavigationProp } from '@appTypes/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface EmptyWalletListProps {
  emptyText: string;
}

interface WalletListProps extends EmptyWalletListProps {
  title: string;
  totalAmount: number;
  data: ExplorerAccount[];
}

export function WalletList(props: WalletListProps): JSX.Element {
  const { title, totalAmount, data, emptyText } = props;
  const [listOpened, toggleList] = useReducer((opened) => !opened, false);
  const rotationAnimation = useRef<RotationAnimationRef>(null);
  const navigation = useNavigation<WalletsNavigationProp>();
  const navigationToExplore =
    useNavigation<NativeStackNavigationProp<TabsParamsList>>();
  const onTogglePress = () => {
    rotationAnimation.current?.rotate();
    toggleList();
  };

  const renderWalletItem = (item: ExplorerAccount, idx: number) => {
    const navigateToAddressDetails = () => {
      navigation.navigate('Address', { address: item.address });
    };
    return (
      <Button
        key={idx}
        style={styles.item}
        onPress={navigateToAddressDetails}
        testID={`WalletItem_${idx}`}
      >
        <WalletItem item={item} />
      </Button>
    );
  };

  const renderEmpty = () => {
    return (
      <View testID="empty-list" style={styles.emptyContainer}>
        <EmptyWalletListPlaceholderIcon />
        <Spacer value={verticalScale(16)} />
        <Text
          color="#51545A"
          fontWeight="400"
          fontSize={15}
          align="center"
          fontFamily="Inter_400Regular"
        >
          {emptyText}
        </Text>
        <Spacer value={verticalScale(16)} />
        <Button
          onPress={() =>
            navigationToExplore.navigate('Explore', { screen: 'ExploreScreen' })
          }
          style={styles.addBtn}
        >
          <Row alignItems="center">
            <PlusIcon color={COLORS.white} scale={0.86} />
            <Spacer horizontal value={scale(10.5)} />
            <Text
              fontSize={16}
              fontFamily="Inter_500Medium"
              color={COLORS.white}
            >
              Add an address
            </Text>
          </Row>
        </Button>
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
          testID="ToggleButton"
          type="circular"
          style={styles.toggleBtn}
          onPress={onTogglePress}
        >
          <RotationAnimation ref={rotationAnimation}>
            <ChevronDownIcon color={COLORS.smokyBlack} />
          </RotationAnimation>
        </Button>
      </Row>
      {listOpened &&
        (data.length > 0 ? (
          <View style={styles.list}>{data.map(renderWalletItem)}</View>
        ) : (
          renderEmpty()
        ))}
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
  },
  emptyContainer: {
    paddingTop: verticalScale(20),
    alignItems: 'center',
    alignSelf: 'center',
    width: scale(200)
  },
  addBtn: {
    backgroundColor: COLORS.mainBlue,
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(200)
  }
});
