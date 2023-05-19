import React, { useCallback, useMemo, useRef, useState } from 'react';
import { COLORS } from '@constants/colors';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { StyleSheet, View } from 'react-native';
import { Button, Spacer } from '@components/base';
import { EditIcon } from '@components/svg/icons';
import { RemoveIcon } from '@components/svg/icons/Remove';
import { BottomSheetSingleAddressOptions } from '@screens/List/modals/BottomSheetSingleAddressOptions';
import { BottomSheetConfirmRemove } from '@components/templates/BottomSheetConfirmRemove';
import { Swipeable } from 'react-native-gesture-handler';
import { WalletItem } from '@components/templates';
import { ExplorerAccount } from '@models';
import { useNavigation } from '@react-navigation/native';
import { WalletsNavigationProp } from '@appTypes';
import { BottomSheetRef } from '@components/composite';
import { useLists } from '@contexts';

type Props = {
  item: ExplorerAccount;
  idx: number;
  isPortfolioFlow?: boolean;
  groupId?: string;
};
export const RenderItem = ({
  item,
  idx,
  isPortfolioFlow = false,
  groupId
}: Props) => {
  const singleAddressOptionsRef = useRef<BottomSheetRef>(null);
  const confirmRemoveRef = useRef<BottomSheetRef>(null);

  const { listsOfAddressGroup } = useLists((v) => v);
  const [pressedAddress, setPressedAddress] = useState<ExplorerAccount>();

  const selectedList = useMemo(
    () => listsOfAddressGroup.filter((group) => group.id === groupId)[0] || {},
    [groupId, listsOfAddressGroup]
  );

  const navigation = useNavigation<WalletsNavigationProp>();
  const handleOnLongPress = useCallback(
    (address: React.SetStateAction<ExplorerAccount | undefined>) => {
      singleAddressOptionsRef.current?.show();
      setPressedAddress(address);
    },
    []
  );

  const handleOnOpenOptions = useCallback(() => {
    singleAddressOptionsRef.current?.show();
  }, []);

  const handleConfirmRemove = useCallback(() => {
    confirmRemoveRef.current?.show();
  }, []);
  const navigateToAddressDetails = () => {
    navigation.navigate('Address', { address: item.address });
  };
  const stylesForPortfolio = isPortfolioFlow
    ? {
        paddingVertical: 34,
        borderColor: COLORS.charcoal,
        borderBottomWidth: 0.5,
        borderTopWidth: idx === 0 ? 0.5 : 0,
        marginTop: idx === 0 ? verticalScale(20) : 0
      }
    : null;
  const renderRightActions = () => {
    return (
      <>
        <View
          style={{
            marginTop: 30,
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            width: 152,
            height: 110,
            flexDirection: 'row',
            backgroundColor: COLORS.charcoal
          }}
        >
          <Button onPress={handleOnOpenOptions}>
            <EditIcon scale={1.5} color={COLORS.electricBlue} />
          </Button>
          <Spacer horizontal value={scale(52)} />
          <Button onPress={handleConfirmRemove}>
            <RemoveIcon />
          </Button>
        </View>
        <BottomSheetSingleAddressOptions
          ref={singleAddressOptionsRef}
          item={item}
          groupId={selectedList.id}
        />
        <BottomSheetConfirmRemove
          item={item}
          ref={confirmRemoveRef}
          groupId={groupId}
        />
      </>
    );
  };

  console.log(item);

  return (
    <>
      <Swipeable
        enabled={isPortfolioFlow}
        renderRightActions={() => renderRightActions()}
        rightOpenValue={-100}
      >
        <View
          style={{
            backgroundColor: COLORS.white
          }}
        >
          <Button
            key={idx}
            style={[{ ...styles.item }, stylesForPortfolio]}
            onPress={navigateToAddressDetails}
            onLongPress={() => {
              if (isPortfolioFlow) {
                return handleOnLongPress(item);
              }
            }}
            testID={`WalletItem_${idx}`}
          >
            <WalletItem item={item} isPortfolioFlow={isPortfolioFlow} />
          </Button>
        </View>
      </Swipeable>
      <BottomSheetSingleAddressOptions
        ref={singleAddressOptionsRef}
        item={pressedAddress || item}
        groupId={selectedList.id}
      />
    </>
  );
};

const styles = StyleSheet.create({
  toggleBtn: {
    borderRadius: scale(36),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    padding: scale(12)
  },
  chevronIcon: {
    width: scale(12),
    height: scale(12)
  },
  list: {
    paddingTop: verticalScale(1)
  },
  item: {
    marginTop: verticalScale(20)
  },
  emptyContainer: {
    paddingTop: verticalScale(20),
    alignItems: 'center',
    alignSelf: 'center',
    width: scale(200)
  },
  addBtn: {
    backgroundColor: COLORS.mainBlue,
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(200)
  }
});
