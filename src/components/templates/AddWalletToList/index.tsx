import React from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { CheckBox } from '@components/composite';
import { verticalScale } from '@utils/scaling';
import { styles } from './styles';
import { ExplorerAccount } from '@models/Explorer';
import { AccountList } from '@models/AccountList';
import { COLORS } from '@constants/colors';

interface AddWalletToListProps {
  wallet: ExplorerAccount;
  lists: AccountList[];
  onPressList: (list: AccountList) => unknown;
}

export const AddWalletToList = (props: AddWalletToListProps): JSX.Element => {
  const { wallet, lists, onPressList } = props;

  const renderList = (args: ListRenderItemInfo<AccountList>) => {
    const { item: list } = args;
    const selected = list.accounts.indexOfItem(wallet, 'address') > -1;
    const onPress = () => {
      onPressList(list);
    };

    return (
      <Button onPress={onPress} testID="AddWalletToList_Container">
        <Row alignItems="center" justifyContent="space-between">
          <View>
            <Text fontSize={17} fontFamily="Inter_700Bold" fontWeight="600">
              {list.name}
            </Text>
            <Spacer value={verticalScale(4)} />
            <Text fontSize={16} fontWeight="400" fontFamily="Inter_400Regular">
              {list.accountCount} Addresses
            </Text>
          </View>
          <CheckBox
            testID="AddWalletToList_Checkbox"
            type="square"
            value={selected}
            fillColor={COLORS.sapphireBlue}
            color="#FFFFFF"
          />
        </Row>
      </Button>
    );
  };

  return (
    <FlatList
      data={lists}
      renderItem={renderList}
      keyExtractor={(l) => l.id}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <Spacer value={verticalScale(28)} />}
    />
  );
};
