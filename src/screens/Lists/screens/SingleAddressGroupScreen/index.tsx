import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View
} from 'react-native';
import { Button, Spacer, Text } from '@components/base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { OptionsIcon } from '@components/svg/icons/Options';
import { BackIcon, PlusIcon } from '@components/svg/icons';
import { RootStackParamsList } from '@navigation/stacks/RootStack';
import { FloatButton } from '@components/base/FloatButton';
import { BottomSheetRef } from '@components/composite';
import { useLists } from '@contexts/ListsContext';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { styles } from '@screens/Lists/screens/SingleAddressGroupScreen/styles';
import { BottomSheetSingleGroupOption } from '@screens/Lists/components/BottomSheetGroupAction';
import { BottomSheetAddNewAddressToGroup } from './modals/BottomSheetAddNewAddressToGroup';
import { BottomSheetSingleAddressOptions } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetSingleAddressOptions';
import { BottomSheetLongPressAddressSelection } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetLongPressAddressSelection';
import { ExplorerAccount } from '@models/Explorer';
import { NumberUtils } from '@utils/number';
import { WalletItem } from '@components/templates';
import { COLORS } from '@constants/colors';

export const SingleAddressGroupScreen = () => {
  const {
    params: {
      group: { id: groupId }
    }
  } = useRoute<RouteProp<RootStackParamsList, 'SingleAddressGroup'>>();

  const [pressedAddress, setPressedAddress] = useState<ExplorerAccount>();
  const addNewAddressToGroupRef = useRef<BottomSheetRef>(null);
  const singleGroupOptionRef = useRef<BottomSheetRef>(null);
  const groupRenameRef = useRef<BottomSheetRef>(null);
  const singleAddressOptionsRef = useRef<BottomSheetRef>(null);
  const longPressAddressSelectionRef = useRef<BottomSheetRef>(null);
  const groupDeleteRef = useRef<BottomSheetRef>(null);

  const navigation = useNavigation();

  const { handleOnRename, listsOfAddressGroup } = useLists((v) => v);

  const selectedList = useMemo(
    () => listsOfAddressGroup.filter((group) => group.id === groupId)[0] || {},
    [groupId, listsOfAddressGroup]
  );

  const { accounts, name } = selectedList;
  const groupTokens = selectedList.totalBalance;
  const addressCount = selectedList.accountCount;

  const handleOpenRenameModal = useCallback(() => {
    singleGroupOptionRef.current?.dismiss();
    setTimeout(() => {
      groupRenameRef.current?.show();
    }, 900);
  }, []);

  const handleOpenDeleteModal = useCallback(() => {
    singleGroupOptionRef.current?.dismiss();
    setTimeout(() => {
      groupDeleteRef.current?.show();
    }, 900);
  }, []);

  const handleAddNewAddressToGroup = useCallback(() => {
    addNewAddressToGroupRef.current?.show();
  }, []);

  const handleOpenGroupAction = useCallback(() => {
    singleGroupOptionRef.current?.show();
  }, []);

  const handleOnOpenOptions = useCallback(() => {
    singleAddressOptionsRef.current?.show();
  }, []);

  const handleOnLongPress = useCallback(
    (address: React.SetStateAction<ExplorerAccount | undefined>) => {
      longPressAddressSelectionRef.current?.show();
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
      {Platform.OS === 'android' && <Spacer value={30} />}
      {customHeader}
      <Spacer value={29} />
      <FlatList
        contentContainerStyle={{
          paddingBottom: 150
        }}
        data={accounts}
        renderItem={({ item }) => {
          return (
            <View style={styles.addressItemContainer}>
              <TouchableOpacity
                onLongPress={() => handleOnLongPress(item)}
                style={styles.touchableAreaContainer}
              >
                <WalletItem item={item} />
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
                ref={singleAddressOptionsRef}
                item={item}
                groupId={selectedList.id}
              />
            </View>
          );
        }}
      />
      <FloatButton
        titleStyle={styles.floatButtonTitle}
        title="Add Address"
        icon={<PlusIcon color={COLORS.white} />}
        bottomPadding={0}
        onPress={handleAddNewAddressToGroup}
      />
      <BottomSheetAddNewAddressToGroup
        ref={addNewAddressToGroupRef}
        groupId={groupId}
      />
      <BottomSheetSingleGroupOption
        type="rename"
        item={selectedList}
        ref={singleGroupOptionRef}
        handleOnDeleteButtonPress={handleOpenDeleteModal}
        handleOnRenameButtonPress={handleOpenRenameModal}
      />
      <BottomSheetCreateRenameGroup
        type="rename"
        groupId={groupId}
        groupTitle={name}
        handleOnRenameGroup={handleOnRename}
        ref={groupRenameRef}
      />
      <BottomSheetLongPressAddressSelection
        ref={longPressAddressSelectionRef}
        address={pressedAddress}
      />
    </SafeAreaView>
  );
};
