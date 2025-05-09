import { useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonStackNavigationProp, CommonStackParamsList } from '@appTypes';
import { Button, Spacer, Text } from '@components/base';
import { BottomSheetRef, Header } from '@components/composite';
import { TokenLogo } from '@components/modular';
import { AddIcon, EditIcon } from '@components/svg/icons';
import {
  AddressList,
  BottomSheetCreateRenameGroup,
  BottomSheetEditCollection
} from '@components/templates';
import { COLORS } from '@constants/colors';
import { useFetchAddresses } from '@entities/addresses';
import { useListsSelector } from '@entities/lists';
import { useListActions } from '@features/lists';
import { useUSDPrice } from '@hooks';
import { sortListByKey, NumberUtils, scale, verticalScale } from '@utils';
import { BottomSheetAddNewAddressToGroup } from './modals/BottomSheetAddNewAddressToGroup';
import { styles } from './styles';

export const SingleGroupScreen = () => {
  const { t } = useTranslation();
  const {
    params: {
      group: { id: groupId }
    }
  } = useRoute<RouteProp<CommonStackParamsList, 'Collection'>>();
  const navigation = useNavigation<CommonStackNavigationProp>();

  const { listsOfAddressGroup } = useListsSelector();
  const { onRenameList } = useListActions();
  const { refetch: refetchAddresses } = useFetchAddresses();

  const addNewAddressToGroupRef = useRef<BottomSheetRef>(null);
  const groupRenameRef = useRef<BottomSheetRef>(null);
  const editCollectionModalRef = useRef<BottomSheetRef>(null);

  const selectedList = useMemo(
    () => listsOfAddressGroup.filter((group) => group.id === groupId)[0] || {},
    [groupId, listsOfAddressGroup]
  );

  const { accounts, name } = selectedList;

  const groupBalanceAmb = selectedList.totalBalance;
  const groupBalanceUsd = useUSDPrice(groupBalanceAmb);

  const showAddAddress = useCallback(() => {
    addNewAddressToGroupRef.current?.show();
  }, []);

  const showEditCollection = useCallback(() => {
    editCollectionModalRef.current?.show();
  }, []);

  return (
    <SafeAreaView
      edges={['top']}
      style={styles.main}
      testID="Single_Collection"
    >
      <Header
        bottomBorder
        title={
          <Text
            numberOfLines={1}
            fontFamily="Inter_700Bold"
            fontSize={16}
            color={COLORS.neutral900}
          >
            {selectedList.name}
          </Text>
        }
        centerContainerStyle={styles.headerContainer}
        style={styles.headerStyle}
        contentRight={
          <>
            <Button
              testID="Add_Address_Button"
              onPress={showAddAddress}
              type="circular"
              style={styles.addButton}
            >
              <AddIcon color={COLORS.neutral700} scale={1.5} />
            </Button>
            <Spacer horizontal value={scale(32)} />
            <Button
              testID="Edit_Collection_Button"
              onPress={showEditCollection}
              type="circular"
              style={styles.optionsButton}
            >
              <EditIcon color={COLORS.neutral900} />
            </Button>
          </>
        }
      />
      <Spacer value={32} />
      <View style={styles.balanceWrapper}>
        <Text
          color={COLORS.alphaBlack50}
          fontFamily="Inter_600SemiBold"
          fontSize={12}
        >
          {t('collection.total.balance')}
        </Text>
        <Spacer value={verticalScale(8)} />
        <View style={styles.infoContainer}>
          <TokenLogo token={'AirDao'} />
          <Spacer horizontal value={verticalScale(8)} />
          <Text
            fontFamily="Inter_700Bold"
            fontWeight="800"
            fontSize={24}
            color={COLORS.neutral900}
          >
            {NumberUtils.formatNumber(
              groupBalanceAmb,
              groupBalanceAmb > 100000 ? 2 : 0
            )}
          </Text>
        </View>
        <Spacer value={5} />
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
        >
          ${NumberUtils.formatNumber(groupBalanceUsd, 2)}
        </Text>
      </View>
      <Spacer value={verticalScale(16)} />
      <View style={styles.addressList} testID="List_Of_Addresses">
        <AddressList
          data={sortListByKey(accounts || [], 'ambBalance', 'desc')}
          emptyText={''}
          isPortfolioFlow={true}
          removeType="collection"
          contentContainerStyle={styles.addressList}
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
        handleOnRenameGroup={onRenameList}
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
