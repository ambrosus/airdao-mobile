import React, { useCallback, useMemo, useRef } from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { OptionsIcon } from '@components/svg/icons/Options';
import { ProgressArrowIcon } from '@components/svg/icons/ProgressArrow';
import { BackIcon } from '@components/svg/icons';
import { RootStackParamsList } from '@navigation/stacks/RootStack';
import { FloatButton } from '@components/base/FloatButton';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { BottomSheetRef } from '@components/composite';
import { useLists } from '@contexts/ListsContext';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { styles } from '@screens/Lists/screens/SingleAddressGroupScreen/styles';
import { BottomSheetGroupAction } from '@screens/Lists/components/BottomSheetGroupAction';
import { BottomSheetSingleAddressAction } from '@screens/Lists/screens/SingleAddressGroupScreen/components/BottomSheetSingleAddressAction';
import { BottomSheetAddNewGroup } from '@screens/Lists/screens/SingleAddressGroupScreen/components/BottomSheetAddNewGroup';

export const SingleAddressGroupScreen = () => {
  const {
    params: {
      group: { groupId }
    }
  } = useRoute<RouteProp<RootStackParamsList, 'SingleAddressGroup'>>();

  const addNewGroupRef = useRef<BottomSheetRef>(null);
  const groupActionRef = useRef<BottomSheetRef>(null);
  const groupRenameRef = useRef<BottomSheetRef>(null);
  const addressActionRef = useRef<BottomSheetRef>(null);

  const navigation = useNavigation();

  const { handleOnDelete, handleOnRename, listsOfAddressGroup } = useLists(
    (v) => v
  );

  const handleOpenSingleAddressAction = useCallback(() => {
    addressActionRef.current?.show();
  }, []);

  const handleDeleteGroupPress = useCallback(
    (selectedGroupId: string) => {
      handleOnDelete(selectedGroupId);
      navigation.goBack();
    },
    [handleOnDelete, navigation]
  );

  const selectedList = useMemo(
    () => listsOfAddressGroup.filter((group) => group.groupId === groupId)[0],
    [groupId, listsOfAddressGroup]
  );
  const { groupTokens, listOfAddresses, addressesCount, groupTitle } =
    selectedList;

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

  const customHeader = useMemo(() => {
    return (
      <View style={styles.container}>
        <View style={styles.itemInfo}>
          <Button onPress={navigation.goBack}>
            <BackIcon />
          </Button>
          <View style={{ paddingLeft: 20 }}>
            <Text title style={styles.itemTitle}>
              {groupTitle}
            </Text>
            <Spacer value={4} />
            <View style={styles.itemSubInfo}>
              <Text style={styles.idCount}>{addressesCount}</Text>
              <Text style={styles.tokensCount}>{groupTokens}</Text>
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
    groupTitle,
    addressesCount,
    groupTokens,
    handleOpenGroupAction
  ]);

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 17 }}>
      {customHeader}
      <Spacer value={29} />
      <FlatList
        contentContainerStyle={{
          paddingBottom: 150
        }}
        data={listOfAddresses}
        renderItem={({ item }) => {
          return (
            <View style={styles.flatListContainer}>
              <View style={styles.whalesTokenContainer}>
                <View style={styles.infoContainer}>
                  <Row>
                    <Text
                      fontFamily="Inter_600SemiBold"
                      fontSize={13}
                      color={COLORS.black}
                    >
                      {item.addressTitle}
                    </Text>
                  </Row>
                  <Spacer value={4} />
                  <Text
                    fontFamily="Mersad_600SemiBold"
                    fontSize={13}
                    color={COLORS.thinGrey}
                  >
                    {item.addressToken}
                  </Text>
                </View>
              </View>
              <View style={styles.priceProgressContainer}>
                <View style={styles.infoContainer}>
                  <Text
                    fontFamily="Mersad_600SemiBold"
                    fontSize={13}
                    color={COLORS.black}
                  >
                    {item.addressPrice}
                  </Text>
                  <Spacer value={4} />
                  <Row justifyContent="space-between" alignItems="center">
                    <ProgressArrowIcon />
                    <Text
                      fontFamily="Mersad_600SemiBold"
                      fontSize={12}
                      color={COLORS.thinGrey}
                      style={styles.progressIcon}
                    >
                      {item.addressProgress}
                    </Text>
                  </Row>
                </View>
                <View style={styles.buttonContainer}>
                  <Button type="base" onPress={handleOpenSingleAddressAction}>
                    <OptionsIcon />
                  </Button>
                </View>
              </View>
              <BottomSheetSingleAddressAction
                ref={addressActionRef}
                addressGroupId={groupId}
                addressTitle={item.addressTitle}
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
        groupTitle={groupTitle}
        handleOnRenameGroup={handleOnRename}
        ref={groupRenameRef}
      />
    </SafeAreaView>
  );
};
