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
import { BackIcon, EditIcon } from '@components/svg/icons';
import { BottomSheetRef, PercentChange } from '@components/composite';
import { useLists } from '@contexts/ListsContext';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { styles } from '@screens/List/styles';
import { BottomSheetAddNewAddressToGroup } from './modals/BottomSheetAddNewAddressToGroup';
import { BottomSheetSingleAddressOptions } from '@screens/List/modals/BottomSheetSingleAddressOptions';
import { ExplorerAccount } from '@models/Explorer';
import { NumberUtils } from '@utils/number';
import { WalletItem } from '@components/templates';
import { COLORS } from '@constants/colors';
import {
  PortfolioNavigationProp,
  PortfolioParamsPortfolio
} from '@appTypes/navigation';
import { Badge } from '@components/base/Badge';
import { scale } from '@utils/scaling';
import { AddIcon } from '@components/svg/icons/AddIcon';

export const SingleAddressGroupScreen = () => {
  const {
    params: {
      group: { id: groupId, name: groupName }
    }
  } = useRoute<RouteProp<PortfolioParamsPortfolio, 'SingleAddressGroup'>>();

  const [pressedAddress, setPressedAddress] = useState<ExplorerAccount>();
  const addNewAddressToGroupRef = useRef<BottomSheetRef>(null);
  const groupRenameRef = useRef<BottomSheetRef>(null);
  const singleAddressOptionsRef = useRef<BottomSheetRef>(null);

  const navigation = useNavigation<PortfolioNavigationProp>();

  const { handleOnRename, listsOfAddressGroup } = useLists((v) => v);

  const selectedList = useMemo(
    () => listsOfAddressGroup.filter((group) => group.id === groupId)[0] || {},
    [groupId, listsOfAddressGroup]
  );

  const { accounts, name } = selectedList;
  const groupTokens = selectedList.totalBalance;

  const handleOpenRenameModal = useCallback(() => {
    setTimeout(() => {
      groupRenameRef.current?.show();
    }, 900);
  }, []);

  const handleAddNewAddressToGroup = useCallback(() => {
    setTimeout(() => {
      addNewAddressToGroupRef.current?.show();
    }, 900);
  }, []);

  const handleOnLongPress = useCallback(
    (address: React.SetStateAction<ExplorerAccount | undefined>) => {
      singleAddressOptionsRef.current?.show();
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
          <Spacer horizontal value={scale(16)} />
          <Text title style={styles.itemTitle}>
            {name}
          </Text>
        </View>
        <Row>
          <Button
            onPress={handleAddNewAddressToGroup}
            type="circular"
            style={styles.addButton}
          >
            <AddIcon color={COLORS.white} scale={0.8} />
          </Button>
          <Spacer horizontal value={scale(32)} />
          <Button
            onPress={handleOpenRenameModal}
            type="circular"
            style={styles.optionsButton}
          >
            <EditIcon color={COLORS.smokyBlack} />
          </Button>
        </Row>
      </View>
    );
  }, [
    navigation.goBack,
    name,
    handleAddNewAddressToGroup,
    handleOpenRenameModal
  ]);

  const navigateToAddressDetails = (item: ExplorerAccount) => {
    navigation.navigate('Address', { address: item.address });
  };

  return (
    <SafeAreaView style={styles.header}>
      {Platform.OS === 'android' && <Spacer value={30} />}
      {customHeader}
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
            borderColor: COLORS.thinGrey,
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
      <BottomSheetAddNewAddressToGroup
        ref={addNewAddressToGroupRef}
        groupId={groupId}
        groupName={groupName}
      />
      <BottomSheetSingleAddressOptions
        ref={singleAddressOptionsRef}
        item={pressedAddress}
        groupId={selectedList.id}
      />
      <BottomSheetCreateRenameGroup
        type="rename"
        groupId={groupId}
        groupTitle={name}
        handleOnRenameGroup={handleOnRename}
        ref={groupRenameRef}
      />
    </SafeAreaView>
  );
};
