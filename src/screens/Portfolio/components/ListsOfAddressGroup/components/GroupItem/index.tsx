import React, { FC, useCallback, useMemo, useRef } from 'react';
import { View, ViewStyle } from 'react-native';
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

type Props = {
  group: AccountList;
  isFirstItem: boolean;
  wrapperStyles?: ViewStyle;
  swipeable?: boolean;
};

export const GroupItem: FC<Props> = ({
  group,
  isFirstItem,
  wrapperStyles = {},
  swipeable
}) => {
  const { handleOnDelete, handleOnRename } = useLists((v) => v);
  const groupRenameRef = useRef<BottomSheetRef>(null);
  const groupDeleteRef = useRef<BottomSheetRef>(null);

  const navigation = useNavigation<PortfolioNavigationProp>();
  const swipeableRef = useRef<Swipeable>(null);

  const tokensFormatted = useMemo(() => {
    const formattedNumber = NumberUtils.formatNumber(group.totalBalance, 0);
    return `$${formattedNumber}`;
  }, [group.totalBalance]);

  const handleOpenRenameModal = useCallback(() => {
    groupRenameRef.current?.show();
    swipeableRef.current?.close();
  }, []);

  const handleItemPress = () => {
    navigation.navigate('SingleGroup', { group });
  };

  const handleRemoveConfirm = (groupId: string) => {
    handleOnDelete(groupId);
    groupDeleteRef.current?.dismiss();
  };

  const handleConfirmRemove = useCallback(() => {
    groupDeleteRef.current?.show();
    swipeableRef.current?.close();
  }, []);

  const renderRightActions = () => {
    return (
      <>
        <View
          style={{
            backgroundColor: COLORS.charcoal,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            width: scale(130)
          }}
        >
          <Button onPress={handleOpenRenameModal}>
            <EditIcon scale={1.5} color={COLORS.electricBlue} />
          </Button>
          <Spacer horizontal value={scale(52)} />
          <Button onPress={handleConfirmRemove}>
            <RemoveIcon />
          </Button>
        </View>
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
      ref={swipeableRef}
      enabled={swipeable}
      renderRightActions={() => renderRightActions()}
    >
      <Button type="base" onPress={handleItemPress} style={containerStyles}>
        <View style={{ justifyContent: 'space-between' }}>
          <Row justifyContent="space-between">
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={13}
              color={COLORS.smokyBlack}
            >
              <Text style={styles.itemTitle}>{group.name}</Text>
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
            <Row alignItems="center">
              <PercentChange change={123 || 0} />
            </Row>
          </Row>
        </View>
      </Button>
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
};
