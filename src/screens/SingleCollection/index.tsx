import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View
} from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { EditIcon } from '@components/svg/icons';
import { BottomSheetRef, Header, PercentChange } from '@components/composite';
import { useLists } from '@contexts/ListsContext';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { styles } from '@screens/SingleCollection/styles';
import { BottomSheetAddNewAddressToGroup } from './modals/BottomSheetAddNewAddressToGroup';
import { BottomSheetSingleAddressOptions } from '@screens/SingleCollection/modals/BottomSheetSingleAddressOptions';
import { ExplorerAccount } from '@models/Explorer';
import { NumberUtils } from '@utils/number';
import { BottomSheetEditCollection, WalletItem } from '@components/templates';
import { COLORS } from '@constants/colors';
import { Badge } from '@components/base/Badge';
import { scale } from '@utils/scaling';
import { AddIcon } from '@components/svg/icons/AddIcon';
import {
  CommonStackNavigationProp,
  CommonStackParamsList
} from '@appTypes/navigation/common';
import { FloatButton } from '@components/base/FloatButton';

export const SingleGroupScreen = () => {
  const {
    params: {
      group: { id: groupId, name: groupName }
    }
  } = useRoute<RouteProp<CommonStackParamsList, 'Collection'>>();
  const navigation = useNavigation<CommonStackNavigationProp>();

  const [pressedAddress, setPressedAddress] = useState<ExplorerAccount>();
  const addNewAddressToGroupRef = useRef<BottomSheetRef>(null);
  const groupRenameRef = useRef<BottomSheetRef>(null);
  const singleAddressOptionsRef = useRef<BottomSheetRef>(null);
  const editCollectionModalRef = useRef<BottomSheetRef>(null);
  const { handleOnRename, listsOfAddressGroup } = useLists((v) => v);

  const selectedList = useMemo(
    () => listsOfAddressGroup.filter((group) => group.id === groupId)[0] || {},
    [groupId, listsOfAddressGroup]
  );

  const { accounts, name } = selectedList;
  const groupTokens = selectedList.totalBalance;

  const navigateToAddressDetails = (item: ExplorerAccount) => {
    navigation.navigate('Address', { address: item.address });
  };

  const handleOnLongPress = useCallback(
    (address: React.SetStateAction<ExplorerAccount | undefined>) => {
      setPressedAddress(address);
      singleAddressOptionsRef.current?.show();
    },
    []
  );

  const showAddAddress = () => {
    addNewAddressToGroupRef.current?.show();
  };

  const showEditCollection = () => {
    editCollectionModalRef.current?.show();
  };

  return (
    <SafeAreaView style={styles.header}>
      {Platform.OS === 'android' && <Spacer value={30} />}
      <Header
        title={selectedList.name}
        titlePosition="left"
        style={{ shadowColor: COLORS.transparent }}
        contentRight={
          <>
            {Platform.OS === 'ios' && (
              <>
                <Button
                  onPress={showAddAddress}
                  type="circular"
                  style={styles.addButton}
                >
                  <AddIcon color={COLORS.white} scale={0.8} />
                </Button>
                <Spacer horizontal value={scale(32)} />
              </>
            )}
            <Button
              onPress={showEditCollection}
              type="circular"
              style={styles.optionsButton}
            >
              <EditIcon color={COLORS.smokyBlack} />
            </Button>
          </>
        }
      />
      <Spacer value={32} />
      <View style={{ alignItems: 'center' }}>
        <Text color={COLORS.slateGrey} fontFamily="Inter_600SemiBold">
          TOTAL BALANCE
        </Text>
        <Spacer value={10} />
        <Text title fontFamily="Inter_700Bold">
          ${NumberUtils.formatNumber(groupTokens, 2)}
        </Text>
        <Spacer value={10} />
        <Badge
          icon={
            <Row>
              <PercentChange fontSize={14} change={123 || 0} />
              <Text>(24hr)</Text>
            </Row>
          }
        />
      </View>
      <Spacer value={35} />
      <FlatList
        contentContainerStyle={{
          paddingBottom: 150
        }}
        data={accounts}
        renderItem={({ item, index }) => {
          const borderStyles = {
            paddingVertical: 31,
            borderColor: COLORS.separator,
            borderBottomWidth: 0.5,
            borderTopWidth: index === 0 ? 0.5 : 0
          };
          return (
            <TouchableOpacity
              onPress={() => navigateToAddressDetails(item)}
              onLongPress={() => handleOnLongPress(item)}
              style={[styles.touchableAreaContainer, { ...borderStyles }]}
            >
              <WalletItem item={item} />
            </TouchableOpacity>
          );
        }}
      />
      {Platform.OS === 'android' && (
        <FloatButton
          type="circular"
          onPress={showAddAddress}
          icon={<AddIcon color={COLORS.white} scale={1.5} />}
        />
      )}
      <BottomSheetAddNewAddressToGroup
        ref={addNewAddressToGroupRef}
        groupId={groupId}
        groupName={groupName}
      />
      {pressedAddress && (
        <BottomSheetSingleAddressOptions
          ref={singleAddressOptionsRef}
          item={pressedAddress}
          groupId={selectedList.id}
        />
      )}
      <BottomSheetCreateRenameGroup
        type="rename"
        groupId={groupId}
        groupTitle={name}
        handleOnRenameGroup={handleOnRename}
        ref={groupRenameRef}
      />
      <BottomSheetEditCollection
        ref={editCollectionModalRef}
        collection={selectedList}
        onDelete={navigation.goBack}
      />
    </SafeAreaView>
  );
};
