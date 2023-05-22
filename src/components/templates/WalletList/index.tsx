import React, { useReducer, useRef } from 'react';
import { FlatList, View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { NumberUtils } from '@utils/number';
import { scale, verticalScale } from '@utils/scaling';
import {
  RotationAnimation,
  RotationAnimationRef
} from '@components/animations';
import {
  ChevronDownIcon,
  EmptyWalletListPlaceholderIcon,
  PlusIcon
} from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { useNavigation } from '@react-navigation/native';
import { ExplorerAccount } from '@models/Explorer';
import { TabsParamsList } from '@appTypes/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RenderItem } from '@components/templates/WalletList/components/RenderItem';
import { styles } from '@components/templates/WalletList/styles';

interface EmptyWalletListProps {
  emptyText: string;
}

interface WalletListProps extends EmptyWalletListProps {
  title?: string;
  totalAmount: number;
  data: ExplorerAccount[];
  isListOpened?: boolean;
  isPortfolioFlow?: boolean;
  groupId?: string;
}

export function WalletList(props: WalletListProps): JSX.Element {
  const {
    title,
    totalAmount,
    data,
    emptyText,
    isListOpened = false,
    isPortfolioFlow = false,
    groupId
  } = props;
  const [listOpened, toggleList] = useReducer(
    (opened) => !opened,
    isListOpened
  );

  const rotationAnimation = useRef<RotationAnimationRef>(null);

  const navigationToExplore =
    useNavigation<NativeStackNavigationProp<TabsParamsList>>();

  const onTogglePress = () => {
    rotationAnimation.current?.rotate();
    toggleList();
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
        {!!title ? (
          <>
            <Row alignItems="center">
              <Text title fontWeight="500">
                {title}
              </Text>
              <Text subtitle fontSize={13} fontWeight="600">
                ~ ${NumberUtils.formatNumber(totalAmount, 0)}
              </Text>
            </Row>
            <Button
              testID={`ToggleButton_${
                title === 'My Wallets' ? 'Wallets' : 'WatchList'
              }`}
              type="circular"
              style={styles.toggleBtn}
              onPress={onTogglePress}
            >
              <RotationAnimation ref={rotationAnimation}>
                <ChevronDownIcon color={COLORS.smokyBlack} />
              </RotationAnimation>
            </Button>
          </>
        ) : null}
      </Row>
      {listOpened &&
        (data.length > 0 ? (
          <View>
            <FlatList
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    flex: 1,
                    height: 2,
                    backgroundColor: COLORS.charcoal
                  }}
                />
              )}
              style={{ height: '100%' }}
              data={data}
              renderItem={(item) => (
                <RenderItem
                  item={item.item}
                  idx={item.index}
                  isPortfolioFlow={isPortfolioFlow}
                  groupId={groupId}
                />
              )}
            />
          </View>
        ) : (
          renderEmpty()
        ))}
    </>
  );
}
