import { ForwardedRef, forwardRef, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { CloseCircleIcon, RefreshIcon } from '@components/svg/icons/v2';
import { CopyIconV2 } from '@components/svg/icons/v2/settings';
import { COLORS } from '@constants/colors';
import { BrowserActionItem } from '@features/browser/components/templates/bottom-sheet-browser-actions/components';
import { ACTION_TYPES } from '@features/browser/constants';
import { useForwardedRef } from '@hooks';
import { scale } from '@utils';
import { styles } from './styles';

type Props = {
  onCopy: () => void;
  onRefresh: () => void;
  uri: string;
  title: string;
};

const formatUrl = (uri: string) =>
  uri.length > 40 ? `${uri.slice(0, 22)}...` : uri;

export const BottomSheetBrowserActions = forwardRef<BottomSheetRef, Props>(
  ({ onCopy, onRefresh, uri, title }, ref) => {
    const { t } = useTranslation();
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const formattedUrl = formatUrl(uri);

    const handleDismiss = useCallback(() => {
      localRef?.current?.dismiss();
    }, [localRef]);

    const browserActions = [
      {
        title: t('button.refresh.action'),
        type: ACTION_TYPES.REFRESH,
        icon: <RefreshIcon />,
        onPress: onRefresh
      },
      {
        title: t('button.copy.action'),
        type: ACTION_TYPES.COPY,
        icon: <CopyIconV2 scale={1.5} color={COLORS.neutral700} />,
        onPress: onCopy
      }
    ];

    return (
      <BottomSheet
        ref={localRef}
        containerStyle={styles.bottomSheetContainer}
        swiperIconVisible
        testID="BottomSheet_Remove_Address_From_Watchlists"
      >
        <View style={styles.contentContainer}>
          <Row justifyContent="space-between" alignItems="center">
            <View>
              <Text fontSize={scale(20)} color={COLORS.neutral800}>
                {title}
              </Text>
              <Text fontSize={scale(15)}>{formattedUrl}</Text>
            </View>
            <TouchableOpacity onPress={handleDismiss}>
              <CloseCircleIcon />
            </TouchableOpacity>
          </Row>
          <Spacer value={14} />
          {browserActions.map((action) => (
            <BrowserActionItem
              key={action.type}
              type={action.type}
              title={action.title}
              icon={action.icon}
              onPress={action.onPress}
            />
          ))}
          <Spacer value={14} />
        </View>
      </BottomSheet>
    );
  }
);
