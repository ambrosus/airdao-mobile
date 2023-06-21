import React, { useMemo, useRef } from 'react';
import { Platform, SafeAreaView, View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { EditIcon } from '@components/svg/icons';
import { BottomSheetRef, Header, PercentChange } from '@components/composite';
import { useLists } from '@contexts/ListsContext';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { styles } from '@screens/SingleCollection/styles';
import { BottomSheetAddNewAddressToGroup } from './modals/BottomSheetAddNewAddressToGroup';
import { NumberUtils } from '@utils/number';
import { BottomSheetEditCollection, WalletList } from '@components/templates';
import { COLORS } from '@constants/colors';
import { Badge } from '@components/base/Badge';
import { scale } from '@utils/scaling';
import { AddIcon } from '@components/svg/icons/AddIcon';
import {
  CommonStackNavigationProp,
  CommonStackParamsList
} from '@appTypes/navigation/common';
import { FloatButton } from '@components/base/FloatButton';
import { useAMBPrice } from '@hooks';

export const SingleGroupScreen = () => {
  const {
    params: {
      group: { id: groupId }
    }
  } = useRoute<RouteProp<CommonStackParamsList, 'Collection'>>();
  const navigation = useNavigation<CommonStackNavigationProp>();
  const { data: ambPriceData } = useAMBPrice();

  const addNewAddressToGroupRef = useRef<BottomSheetRef>(null);
  const groupRenameRef = useRef<BottomSheetRef>(null);
  const editCollectionModalRef = useRef<BottomSheetRef>(null);
  const { handleOnRename, listsOfAddressGroup } = useLists((v) => v);

  const selectedList = useMemo(
    () => listsOfAddressGroup.filter((group) => group.id === groupId)[0] || {},
    [groupId, listsOfAddressGroup]
  );

  const { accounts, name } = selectedList;
  const groupTokens = selectedList.totalBalance * (ambPriceData?.priceUSD || 0);

  const showAddAddress = () => {
    addNewAddressToGroupRef.current?.show();
  };

  const showEditCollection = () => {
    editCollectionModalRef.current?.show();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {Platform.OS === 'android' && <Spacer value={30} />}
      <Header
        title={
          <Text
            numberOfLines={1}
            fontFamily="Inter_700Bold"
            fontSize={16}
            color={COLORS.smokyBlack}
          >
            {selectedList.name}
          </Text>
        }
        centerContainerStyle={{
          maxWidth: '70%',
          alignItems: 'flex-start',
          paddingLeft: scale(20)
        }}
        style={{
          shadowColor: COLORS.transparent
        }}
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
        <Text
          color={COLORS.smokyBlack50}
          fontFamily="Inter_600SemiBold"
          fontSize={12}
        >
          TOTAL BALANCE
        </Text>
        <Spacer value={10} />
        <Text fontFamily="Inter_700Bold" fontSize={30} color={COLORS.nero}>
          ${NumberUtils.formatNumber(groupTokens, 2)}
        </Text>
        <Spacer value={10} />
        <Badge
          icon={
            <Row>
              <PercentChange
                fontSize={14}
                change={ambPriceData?.percentChange24H || 0}
              />
              <Text> (24hr)</Text>
            </Row>
          }
        />
      </View>
      <View style={{ flex: 1, paddingHorizontal: scale(16) }}>
        <WalletList
          data={accounts}
          emptyText={''}
          isPortfolioFlow={true}
          removeType="collection"
        />
      </View>
      {Platform.OS === 'android' && (
        <FloatButton
          type="circular"
          onPress={showAddAddress}
          icon={<AddIcon color={COLORS.white} scale={1.5} />}
        />
      )}
      <BottomSheetAddNewAddressToGroup
        ref={addNewAddressToGroupRef}
        collection={selectedList}
      />
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
