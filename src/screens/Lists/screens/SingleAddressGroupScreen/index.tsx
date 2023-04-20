import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Button, Spacer, Text } from '@components/base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { OptionsIcon } from '@components/svg/icons/Options';
import { BackIcon } from '@components/svg/icons';
import { RootStackParamsList } from '@navigation/stacks/RootStack';
import { FloatButton } from '@components/base/FloatButton';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { BottomSheetRef } from '@components/composite';
import { useLists } from '@contexts/ListsContext';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { styles } from '@screens/Lists/screens/SingleAddressGroupScreen/styles';
import { BottomSheetGroupAction } from '@screens/Lists/components/BottomSheetGroupAction';
import { BottomSheetAddNewGroup } from './modals/BottomSheetAddNewGroup';
import { BottomSheetSingleAddressOptions } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetSingleAddressOptions';
import { BottomSheetListSelection } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetListSelection';
import { ExplorerAccount } from '@models/Explorer';
import { NumberUtils } from '@utils/number';
import { WalletItem } from '@components/templates';

export const SingleAddressGroupScreen = () => {
  const {
    params: {
      group: { id: groupId }
    }
  } = useRoute<RouteProp<RootStackParamsList, 'SingleAddressGroup'>>();

  const [pressedAddress, setPressedAddress] = useState<ExplorerAccount>();
  const addNewGroupRef = useRef<BottomSheetRef>(null);
  const groupActionRef = useRef<BottomSheetRef>(null);
  const groupRenameRef = useRef<BottomSheetRef>(null);
  const optionsRef = useRef<BottomSheetRef>(null);
  const listSelectionRef = useRef<BottomSheetRef>(null);

  const navigation = useNavigation();

  const {
    handleOnDelete,
    handleOnRename,
    listsOfAddressGroup,
    setListsOfAddressGroup
  } = useLists((v) => v);

  const handleDeleteGroupPress = useCallback(
    (selectedGroupId: string) => {
      handleOnDelete(selectedGroupId);
      navigation.goBack();
    },
    [handleOnDelete, navigation]
  );

  const selectedList = useMemo(
    () => listsOfAddressGroup.filter((group) => group.id === groupId)[0] || {},
    [groupId, listsOfAddressGroup]
  );

  const { accounts, name } = selectedList;
  const groupTokens = selectedList.totalBalance;
  const addressCount = selectedList.accountCount;

  const handleOpenRenameModal = useCallback(() => {
    groupActionRef.current?.dismiss();
    setTimeout(() => {
      groupRenameRef.current?.show();
    }, 900);
  }, []);

  const handleOnOpenAddNewGroup = useCallback(() => {
    addNewGroupRef.current?.show();
  }, []);

  const handleOpenGroupAction = useCallback(() => {
    groupActionRef.current?.show();
  }, []);

  const handleOnOpenOptions = useCallback(() => {
    optionsRef.current?.show();
  }, []);

  const handleOnLongPress = useCallback(
    (address: React.SetStateAction<ExplorerAccount | undefined>) => {
      listSelectionRef.current?.show();
      setPressedAddress(address);
    },
    []
  );

  const customHeader = useMemo(() => {
    return (
      <View style={styles.container}>
        <View style={styles.itemInfo}>
          <Button onPress={navigation.goBack}>
            <BackIcon />
          </Button>
          <View style={{ paddingLeft: 20 }}>
            <Text title style={styles.itemTitle}>
              {name}
            </Text>
            <Spacer value={4} />
            <View style={styles.itemSubInfo}>
              <Text style={styles.idCount}>{addressCount} Addresses</Text>
              <Text style={styles.tokensCount}>
                {NumberUtils.formatNumber(groupTokens, 2)}
              </Text>
            </View>
          </View>
        </View>
        <Button
          onPress={handleOpenGroupAction}
          type="base"
          style={styles.optionsButton}
        >
          <OptionsIcon />
        </Button>
      </View>
    );
  }, [
    navigation.goBack,
    name,
    addressCount,
    groupTokens,
    handleOpenGroupAction
  ]);

  return (
    <SafeAreaView style={styles.header}>
      {customHeader}
      <Spacer value={29} />
      <FlatList
        contentContainerStyle={{
          paddingBottom: 150
        }}
        data={accounts}
        renderItem={({ item }) => {
          console.log(item.name);
          return (
            <View style={styles.addressItemContainer}>
              <TouchableOpacity
                onLongPress={() => handleOnLongPress(item)}
                style={styles.touchableAreaContainer}
              >
                <WalletItem item={item} isWatchlist />
              </TouchableOpacity>
              <View style={styles.buttonContainer}>
                <Button
                  style={styles.actionButton}
                  type="base"
                  onPress={handleOnOpenOptions}
                >
                  <OptionsIcon />
                </Button>
              </View>
              <BottomSheetSingleAddressOptions
                ref={optionsRef}
                item={item}
                groupId={selectedList.id}
                setListsOfAddressGroup={setListsOfAddressGroup}
              />
            </View>
          );
        }}
      />
      <FloatButton
        title="Add Address"
        icon={<AddIcon />}
        bottomPadding={0}
        onPress={handleOnOpenAddNewGroup}
      />
      <BottomSheetAddNewGroup ref={addNewGroupRef} groupId={groupId} />
      <BottomSheetGroupAction
        item={selectedList}
        ref={groupActionRef}
        handleOnDeleteItem={handleDeleteGroupPress}
        handleOnRenameButtonPress={handleOpenRenameModal}
      />
      <BottomSheetCreateRenameGroup
        type="rename"
        groupId={groupId}
        groupTitle={name}
        handleOnRenameGroup={handleOnRename}
        ref={groupRenameRef}
      />
      <BottomSheetListSelection
        ref={listSelectionRef}
        address={pressedAddress}
      />
    </SafeAreaView>
  );
};
