import React, { FC, useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { Spacer } from '@components/base/Spacer';
import { Button, Text } from '@components/base';
import { OptionsIcon } from '@components/svg/icons/Options';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@navigation/stacks/RootStack';
import { useLists } from '@contexts/ListsContext';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { styles } from './styles';
import { BottomSheetGroupAction } from '@screens/Lists/components/BottomSheetGroupAction';
import { AccountList } from '@models/AccountList';

type Props = {
  group: AccountList;
};

export const GroupItem: FC<Props> = ({ group }) => {
  const { handleOnDelete, handleOnRename } = useLists((v) => v);

  const groupItemActionRef = useRef<BottomSheetRef>(null);
  const groupRenameRef = useRef<BottomSheetRef>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  const handleOpenGroupAction = useCallback(() => {
    groupItemActionRef.current?.show();
  }, []);

  const handleOpenRenameModal = useCallback(() => {
    groupItemActionRef.current?.dismiss();
    setTimeout(() => {
      groupRenameRef.current?.show();
    }, 900);
  }, []);

  const handleItemPress = () => {
    navigation.navigate('SingleAddressGroup', {
      group
    });
  };

  const tokensFormatted = useMemo(() => {
    const formattedNumber = group.totalBalance
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `$${formattedNumber} (${formattedNumber} AMB)`;
  }, [group.totalBalance]);

  return (
    <>
      <Button type="base" onPress={handleItemPress}>
        <View style={styles.container}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{group.name}</Text>
            <Spacer value={4} />
            <View style={styles.itemSubInfo}>
              <Text style={styles.walletsCount}>
                {group.accountCount + ' addresses'}
              </Text>
              <Text style={styles.tokensCount}>{tokensFormatted}</Text>
            </View>
          </View>
          <Button
            style={styles.optionButton}
            type="base"
            onPress={handleOpenGroupAction}
          >
            <OptionsIcon />
          </Button>
          <BottomSheetGroupAction
            item={group}
            ref={groupItemActionRef}
            handleOnDeleteItem={handleOnDelete}
            handleOnRenameButtonPress={handleOpenRenameModal}
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
