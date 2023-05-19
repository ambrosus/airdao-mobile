import React, { FC, useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { Spacer } from '@components/base/Spacer';
import { Button, Row, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useNavigation } from '@react-navigation/native';
import { useLists } from '@contexts/ListsContext';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { styles } from './styles';
import { BottomSheetSingleGroupOption } from '@screens/Portfolio/components/BottomSheetGroupAction';
import { AccountList } from '@models/AccountList';
import { NumberUtils } from '@utils/number';
import { BottomSheetConfirmRemoveGroup } from '@screens/Portfolio/components/BottomSheetConfirmRemoveGroup';
import { PortfolioNavigationProp } from '@appTypes/navigation';
import { COLORS } from '@constants/colors';
import { PercentChange } from '@components/composite';
import { verticalScale } from '@utils/scaling';

type Props = {
  group: AccountList;
  balanceAndProgressVisible?: boolean;
  isFirstItem: boolean;
};

export const GroupItem: FC<Props> = ({ group, isFirstItem }) => {
  const { handleOnDelete, handleOnRename } = useLists((v) => v);
  const groupItemActionRef = useRef<BottomSheetRef>(null);
  const groupRenameRef = useRef<BottomSheetRef>(null);
  const groupDeleteRef = useRef<BottomSheetRef>(null);

  const navigation = useNavigation<PortfolioNavigationProp>();

  const handleOpenRenameModal = useCallback(() => {
    groupItemActionRef.current?.dismiss();
    setTimeout(() => {
      groupRenameRef.current?.show();
    }, 900);
  }, []);

  const handleOpenDeleteModal = useCallback(() => {
    groupItemActionRef.current?.dismiss();
    setTimeout(() => {
      groupDeleteRef.current?.show();
    }, 900);
  }, []);

  const handleItemPress = () => {
    navigation.navigate('SingleAddressGroup', {
      group
    });
  };

  const tokensFormatted = useMemo(() => {
    const formattedNumber = NumberUtils.formatNumber(group.totalBalance, 0);
    return `$${formattedNumber}`;
  }, [group.totalBalance]);

  const handleRemoveConfirm = (groupId: string) => {
    handleOnDelete(groupId);
    groupDeleteRef.current?.dismiss();
  };

  const stylesForFirstItem = useMemo(() => {
    return { marginTop: verticalScale(20), borderBottomWidth: 0 };
  }, []);

  return (
    <>
      <Button
        type="base"
        onPress={handleItemPress}
        style={[
          {
            paddingVertical: 31,
            borderColor: COLORS.charcoal,
            borderBottomWidth: 1,
            borderTopWidth: 1
          },
          isFirstItem && stylesForFirstItem
        ]}
      >
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
          <BottomSheetSingleGroupOption
            handleOnDeleteButtonPress={handleOpenDeleteModal}
            item={group}
            ref={groupItemActionRef}
            handleOnRenameButtonPress={handleOpenRenameModal}
            type="rename"
          />
          <BottomSheetConfirmRemoveGroup
            handleOnDeleteConfirm={handleRemoveConfirm}
            item={group}
            groupId={group.id}
            ref={groupDeleteRef}
          />
        </View>
      </Button>
      <BottomSheetCreateRenameGroup
        type="rename"
        groupId={group.id}
        groupTitle={group.name}
        handleOnRenameGroup={handleOnRename}
        ref={groupRenameRef}
      />
    </>
  );
};
