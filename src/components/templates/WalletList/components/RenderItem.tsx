import React, { useCallback, useMemo, useRef } from 'react';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { View } from 'react-native';
import { Button, Spacer } from '@components/base';
import { EditIcon } from '@components/svg/icons';
import { RemoveIcon } from '@components/svg/icons/Remove';
import { BottomSheetSingleAddressOptions } from '@screens/SingleCollection/modals/BottomSheetSingleAddressOptions';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { WalletItem } from '@components/templates';
import { ExplorerAccount } from '@models';
import { useNavigation } from '@react-navigation/native';
import { WalletsNavigationProp } from '@appTypes';
import { BottomSheetRef } from '@components/composite';
import { useLists } from '@contexts';
import { styles } from '@components/templates/WalletList/styles';
import { BottomSheetRemoveAddressFromWatchlists } from '@components/templates/BottomSheetConfirmRemove/BottomSheetRemoveAddressFromWatchlists';

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

  const selectedList = useMemo(
    () => listsOfAddressGroup.filter((group) => group.id === groupId)[0] || {},
    [groupId, listsOfAddressGroup]
  );

  const navigation = useNavigation<WalletsNavigationProp>();

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
        paddingVertical: 18,
        borderColor: COLORS.charcoal,
        borderBottomWidth: idx !== 0 ? 1 : 0,
        borderTopWidth: 2,
        marginTop: idx === 0 ? verticalScale(20) : 0
      }
    : {};
  const renderRightActions = () => {
    return (
      <>
        <View
          style={{
            backgroundColor: COLORS.charcoal,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            width: scale(130)
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
        <BottomSheetRemoveAddressFromWatchlists
          item={item}
          ref={confirmRemoveRef}
        />
      </>
    );
  };

  return (
    <>
      <Swipeable
        enabled={isPortfolioFlow}
        renderRightActions={() => renderRightActions()}
      >
        <View
          style={{
            backgroundColor: 'white'
          }}
        >
          <Button
            key={idx}
            style={[{ ...styles.item }, stylesForPortfolio]}
            onPress={navigateToAddressDetails}
            testID={`WalletItem_${idx}`}
          >
            <WalletItem item={item} isPortfolioFlow={isPortfolioFlow} />
          </Button>
        </View>
      </Swipeable>
    </>
  );
};
