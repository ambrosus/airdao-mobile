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
import { OptionsIcon } from '@components/svg/icons/Options';
import { BackIcon, EditIcon, PlusIcon } from '@components/svg/icons';
import { FloatButton } from '@components/base/FloatButton';
import { BottomSheetRef, PercentChange } from '@components/composite';
import { useLists } from '@contexts/ListsContext';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { styles } from '@screens/List/styles';
import { BottomSheetSingleGroupOption } from '@screens/Portfolio/components/BottomSheetGroupAction';
import { BottomSheetAddNewAddressToGroup } from './modals/BottomSheetAddNewAddressToGroup';
import { BottomSheetSingleAddressOptions } from '@screens/List/modals/BottomSheetSingleAddressOptions';
import { BottomSheetLongPressAddressSelection } from '@screens/List/modals/BottomSheetLongPressAddressSelection';
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
  const singleGroupOptionRef = useRef<BottomSheetRef>(null);
  const groupRenameRef = useRef<BottomSheetRef>(null);
  const singleAddressOptionsRef = useRef<BottomSheetRef>(null);
  const longPressAddressSelectionRef = useRef<BottomSheetRef>(null);
  const groupDeleteRef = useRef<BottomSheetRef>(null);

  const navigation = useNavigation<PortfolioNavigationProp>();

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
            onPress={handleOpenGroupAction}
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
    handleOpenGroupAction
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
      {/*<FloatButton*/}
      {/*  titleStyle={styles.floatButtonTitle}*/}
      {/*  title="Add Address"*/}
      {/*  icon={<PlusIcon color={COLORS.white} />}*/}
      {/*  bottomPadding={0}*/}
      {/*  onPress={handleAddNewAddressToGroup}*/}
      {/*/>*/}
      <BottomSheetAddNewAddressToGroup
        ref={addNewAddressToGroupRef}
        groupId={groupId}
        groupName={groupName}
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
