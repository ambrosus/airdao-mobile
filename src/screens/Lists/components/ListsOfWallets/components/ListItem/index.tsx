import React, { FC, useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { Spacer } from '@components/base/Spacer';
import { Button, Text } from '@components/base';
import { OptionsIcon } from '@components/svg/icons/Options';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { BottomSheetListAction } from '@screens/Lists/components/ListsOfWallets/components/ListItem/components/BottomSheetListAction';
import { useNavigation } from '@react-navigation/native';
import { WalletGroup } from '@screens/Lists/components/ListsOfWallets';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@navigation/stacks/RootStack';
import { useLists } from '@contexts/ListsContext';
import { BottomSheetCreateRenameList } from '@components/templates/BottomSheetCreateRenameList';
import { styles } from './styles';

type Props = {
  item: WalletGroup;
};

export const ListItem: FC<Props> = ({ item }) => {
  const { handleOnDelete, handleOnRename } = useLists((v) => v);

  const listActionRef = useRef<BottomSheetRef>(null);
  const listRenameRef = useRef<BottomSheetRef>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  const handleOpenListAction = useCallback(() => {
    listActionRef.current?.show();
  }, []);

  const handleOpenRenameModal = useCallback(() => {
    listActionRef.current?.dismiss();
    setTimeout(() => {
      listRenameRef.current?.show();
    }, 900);
  }, []);

  const handleItemPress = () => {
    navigation.navigate('SingleListScreen', {
      item
    });
  };

  const tokensFormatted = useMemo(() => {
    const formattedNumber = item.tokens
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `$${formattedNumber} (${formattedNumber} AMB)`;
  }, [item.tokens]);

  return (
    <>
      <Button type="base" onPress={handleItemPress}>
        <View style={styles.container}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Spacer value={4} />
            <View style={styles.itemSubInfo}>
              <Text style={styles.walletsCount}>
                {item.addresses + ' addresses'}
              </Text>
              <Text style={styles.tokensCount}>{tokensFormatted}</Text>
            </View>
          </View>
          <Button
            style={styles.optionButton}
            type="base"
            onPress={handleOpenListAction}
          >
            <OptionsIcon />
          </Button>
          <BottomSheetListAction
            item={item}
            ref={listActionRef}
            handleOnDeleteItem={handleOnDelete}
            handleOnRenameButtonPress={handleOpenRenameModal}
          />
        </View>
      </Button>
      <BottomSheetCreateRenameList
        type="rename"
        listId={item.id}
        listTitle={item.title}
        handleOnRenameList={handleOnRename}
        ref={listRenameRef}
      />
    </>
  );
};
