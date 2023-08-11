import React, { useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Button, Row, Spacer, Text, Badge } from '@components/base';
import {
  BottomSheetEditCollection,
  WalletList,
  BottomSheetCreateRenameGroup
} from '@components/templates';
import { EditIcon, AddIcon } from '@components/svg/icons';
import { BottomSheetRef, Header, PercentChange } from '@components/composite';
import { useLists } from '@contexts/ListsContext';
import { NumberUtils } from '@utils/number';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { CommonStackNavigationProp, CommonStackParamsList } from '@appTypes';
import { useAMBPrice } from '@hooks';
import { useAllAddressesContext } from '@contexts';
import { BottomSheetAddNewAddressToGroup } from './modals/BottomSheetAddNewAddressToGroup';
import { sortListByKey } from '@utils/sort';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';

export const SingleGroupScreen = () => {
  const {
    params: {
      group: { id: groupId }
    }
  } = useRoute<RouteProp<CommonStackParamsList, 'Collection'>>();
  const navigation = useNavigation<CommonStackNavigationProp>();
  const { data: ambPriceData } = useAMBPrice();
  const { t } = useTranslation();

  const addNewAddressToGroupRef = useRef<BottomSheetRef>(null);
  const groupRenameRef = useRef<BottomSheetRef>(null);
  const editCollectionModalRef = useRef<BottomSheetRef>(null);
  const { handleOnRename, listsOfAddressGroup } = useLists((v) => v);
  const { refresh: refetchAddresses } = useAllAddressesContext((v) => v);
  const selectedList = useMemo(
    () => listsOfAddressGroup.filter((group) => group.id === groupId)[0] || {},
    [groupId, listsOfAddressGroup]
  );

  const { accounts, name } = selectedList;

  const groupTokens = selectedList.totalBalance * (ambPriceData?.priceUSD || 0);

  const showAddAddress = useCallback(() => {
    addNewAddressToGroupRef.current?.show();
  }, []);

  const showEditCollection = useCallback(() => {
    editCollectionModalRef.current?.show();
  }, []);

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1 }}
      testID="Single_Collection"
    >
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
          paddingLeft: scale(28)
        }}
        style={{
          shadowColor: COLORS.transparent
        }}
        contentRight={
          <>
            <Button
              testID="Add_Address_Button"
              onPress={showAddAddress}
              type="circular"
              style={styles.addButton}
            >
              <AddIcon color={COLORS.white} scale={0.8} />
            </Button>
            <Spacer horizontal value={scale(32)} />
            <Button
              testID="Edit_Collection_Button"
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
          {t('total.balance')}
        </Text>
        <Spacer value={10} />
        <Text fontFamily="Inter_700Bold" fontSize={30} color={COLORS.nero}>
          ${NumberUtils.formatNumber(groupTokens, 2)}
        </Text>
        <Spacer value={10} />
        <Badge
          color={COLORS.gray300}
          icon={
            <Row>
              <PercentChange
                fontSize={14}
                change={ambPriceData?.percentChange24H || 0}
              />
              <Text
                fontFamily="Inter_500Medium"
                fontSize={14}
                color={COLORS.smokyBlack}
              >
                {' '}
                (24hr)
              </Text>
            </Row>
          }
        />
      </View>
      <Spacer value={verticalScale(16)} />
      <View
        style={{ flex: 1, paddingHorizontal: scale(16) }}
        testID="List_Of_Addresses"
      >
        <WalletList
          data={sortListByKey(accounts || [], 'ambBalance', 'desc')}
          emptyText={''}
          isPortfolioFlow={true}
          removeType="collection"
          contentContainerStyle={{ paddingBottom: '10%' }}
          onRefresh={refetchAddresses}
        />
      </View>
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
