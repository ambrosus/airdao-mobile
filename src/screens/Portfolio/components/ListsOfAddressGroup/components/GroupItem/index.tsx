import React, { forwardRef, memo, useCallback, useMemo, useRef } from 'react';
import { Animated, Pressable, View, ViewStyle } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Spacer } from '@components/base/Spacer';
import { Button, Row, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useNavigation } from '@react-navigation/native';
import { useLists } from '@contexts/ListsContext';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { styles } from './styles';
import { AccountList } from '@models/AccountList';
import { NumberUtils } from '@utils/number';
import { BottomSheetConfirmRemoveGroup } from '@screens/Portfolio/components/BottomSheetConfirmRemoveGroup';
import { PortfolioNavigationProp } from '@appTypes/navigation';
import { COLORS } from '@constants/colors';
import { PercentChange } from '@components/composite';
import { scale } from '@utils/scaling';
import { EditIcon, RemoveIcon } from '@components/svg/icons';
import { useAMBPrice } from '@hooks';

type Props = {
  group: AccountList;
  isFirstItem: boolean;
  wrapperStyles?: ViewStyle;
  swipeable?: boolean;
};

interface SwipeActionsProps {
  dragX: Animated.AnimatedInterpolation<number>;
  onPress?: () => void;
}

export const GroupItem = memo(
  forwardRef<Swipeable, Props>(
    ({ group, isFirstItem, wrapperStyles }, previousRef) => {
      const { handleOnDelete, handleOnRename } = useLists((v) => v);
      const { data: ambPriceData } = useAMBPrice();
      const groupRenameRef = useRef<BottomSheetRef>(null);
      const groupDeleteRef = useRef<BottomSheetRef>(null);
      const timeoutRef = useRef<NodeJS.Timeout | null>(null);

      const navigation = useNavigation<PortfolioNavigationProp>();
      const swipeableRef = useRef<Swipeable>(null);
      const tokensFormatted = useMemo(() => {
        const formattedNumber = NumberUtils.formatNumber(
          group.totalBalance * (ambPriceData?.priceUSD || 0),
          0
        );
        return ambPriceData?.priceUSD
          ? `$${formattedNumber}`
          : `${NumberUtils.formatNumber(group.totalBalance, 0)} AMB`;
      }, [ambPriceData?.priceUSD, group.totalBalance]);

      const handleOpenRenameModal = useCallback(() => {
        groupRenameRef.current?.show();
        swipeableRef.current?.close();
      }, []);

      const handleItemPress = useCallback(() => {
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          navigation.navigate('Collection', { group });
        }, 200);
      }, [group, navigation, timeoutRef]);

      const handleRemoveConfirm = (groupId: string) => {
        handleOnDelete(groupId);
        groupDeleteRef.current?.dismiss();
      };

      const handleConfirmRemove = useCallback(() => {
        groupDeleteRef.current?.show();
        swipeableRef.current?.close();
      }, []);

      const handleSwipeableOpen = useCallback(() => {
        clearTimeout(timeoutRef.current ?? undefined);
        if (previousRef && typeof previousRef !== 'function') {
          previousRef.current = swipeableRef.current;
        }
      }, [previousRef, timeoutRef]);

      const handleSwipeableWillOpen = useCallback(() => {
        clearTimeout(timeoutRef.current ?? undefined);
        if (
          previousRef &&
          typeof previousRef !== 'function' &&
          previousRef.current !== null
        ) {
          if (previousRef.current !== swipeableRef.current) {
            previousRef.current?.close();
          }
        }
      }, [previousRef, timeoutRef]);

      const SwipeAction: React.FC<SwipeActionsProps> = ({ dragX, onPress }) => {
        const trans = dragX.interpolate({
          inputRange: [-100, 0],
          outputRange: [0, 20],
          extrapolate: 'clamp'
        });

        return (
          <>
            <Pressable style={styles.rightActions} onPress={onPress}>
              <Animated.View
                style={[
                  styles.rightActions,
                  { backgroundColor: 'transparent' },
                  { transform: [{ translateX: trans }] }
                ]}
              >
                <Button onPress={handleOpenRenameModal}>
                  <EditIcon scale={1.5} color={COLORS.deepBlue} />
                </Button>
                <Spacer horizontal value={scale(52)} />
                <Button onPress={handleConfirmRemove}>
                  <RemoveIcon color={COLORS.lightPink} />
                </Button>
              </Animated.View>
            </Pressable>
          </>
        );
      };

      const stylesForFirstItem = useMemo(() => {
        return {
          borderTopWidth: 1
        };
      }, []);

      const containerStyles = useMemo(() => {
        const mainStyle = isFirstItem
          ? { ...styles.container, ...stylesForFirstItem, ...wrapperStyles }
          : { ...styles.container, ...wrapperStyles };
        return mainStyle;
      }, [isFirstItem, stylesForFirstItem, wrapperStyles]);

      return (
        <Swipeable
          renderRightActions={(_, dragX) => <SwipeAction dragX={dragX} />}
          ref={swipeableRef}
          onSwipeableOpen={handleSwipeableOpen}
          onSwipeableWillOpen={handleSwipeableWillOpen}
        >
          <Pressable onPress={handleItemPress} style={containerStyles}>
            <View style={{ justifyContent: 'space-between' }}>
              <Row justifyContent="space-between">
                <Text
                  fontFamily="Inter_600SemiBold"
                  fontSize={17}
                  color={COLORS.smokyBlack}
                  style={{ width: '70%' }}
                  numberOfLines={1}
                >
                  {group.name}
                </Text>
                <Text
                  fontFamily="Mersad_600SemiBold"
                  fontSize={13}
                  color={COLORS.smokyBlack}
                >
                  {tokensFormatted}
                </Text>
              </Row>
              <Spacer value={5} />
              <Row justifyContent="space-between">
                <Text
                  fontFamily="Mersad_600SemiBold"
                  color="#0e0e0e80"
                  fontSize={13}
                >
                  {group.accountCount + ' addresses'}
                </Text>
                {group.accountCount > 0 && (
                  <Row alignItems="center">
                    <PercentChange
                      change={ambPriceData?.percentChange24H || 0}
                    />
                  </Row>
                )}
              </Row>
            </View>
          </Pressable>
          <BottomSheetConfirmRemoveGroup
            handleOnDeleteConfirm={handleRemoveConfirm}
            item={group}
            groupId={group.id}
            ref={groupDeleteRef}
          />
          <BottomSheetCreateRenameGroup
            type="rename"
            groupId={group.id}
            groupTitle={group.name}
            handleOnRenameGroup={handleOnRename}
            ref={groupRenameRef}
          />
        </Swipeable>
      );
    }
  )
);
