import React, { useReducer, useRef } from 'react';
import { FlatList, View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { NumberUtils } from '@utils/number';
import { verticalScale } from '@utils/scaling';
import {
  RotationAnimation,
  RotationAnimationRef
} from '@components/animations';
import {
  ChevronDownIcon,
  EmptyWalletListPlaceholderIcon
} from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { ExplorerAccount } from '@models/Explorer';
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
    isPortfolioFlow = false
  } = props;
  const [listOpened, toggleList] = useReducer(
    (opened) => !opened,
    isListOpened
  );

  const rotationAnimation = useRef<RotationAnimationRef>(null);

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
        <Text fontFamily="Inter_400Regular" fontSize={15} color="#51545a">
          No addresses yet
        </Text>
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
          <FlatList
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: verticalScale(22)
            }}
            data={data}
            renderItem={(item) => (
              <RenderItem
                item={item.item}
                idx={item.index}
                isPortfolioFlow={isPortfolioFlow}
              />
            )}
          />
        ) : (
          renderEmpty()
        ))}
    </>
  );
}
