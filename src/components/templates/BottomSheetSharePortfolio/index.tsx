import React, { ForwardedRef, forwardRef, RefObject, useRef } from 'react';
import { View } from 'react-native';
import ViewShot, { captureRef, CaptureOptions } from 'react-native-view-shot';
import { useTranslation } from 'react-i18next';
import { BottomSheetFloat } from '@components/modular';
import { BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import {
  PortfolioPerformance,
  PortfolioPerformanceProps
} from '@components/templates/PortfolioPerformance';
import { MessagesIcon, PlusIcon, TwitterIcon } from '@components/svg/icons';
import { scale, verticalScale } from '@utils/scaling';
import { ShareUtils } from '@utils/share';
import { Social } from '@appTypes/Sharing';
import { styles } from './styles';

interface SharePortfolioProps extends PortfolioPerformanceProps {
  ref: RefObject<BottomSheetRef>;
  bottomSheetTitle: string;
}

export const SharePortfolio = forwardRef<BottomSheetRef, SharePortfolioProps>(
  (props, ref) => {
    const { bottomSheetTitle, ...portfolioBalanceProps } = props;
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const shareRef = useRef<View>(null);
    const { t } = useTranslation();

    const onSharePress = async (type?: Social) => {
      const captureOptions: CaptureOptions = {
        fileName: `share_portfolio_${portfolioBalanceProps.timestamp.getTime()}`, // android only
        format: 'jpg',
        width: 2000,
        height: 1200,
        quality: 1.0
      };
      const uri = await captureRef(shareRef, captureOptions);
      if (type) {
        ShareUtils.socialShareImage(
          {
            uri,
            title: `Share on ${type}!`
          },
          type
        );
      } else {
        ShareUtils.shareImage({
          uri,
          title: `Share!`
        });
      }
    };

    return (
      <BottomSheetFloat
        ref={localRef}
        testID="Share_Portfolio_BottomSheet"
        swiperIconVisible
      >
        <View testID="BottomSheet_Container" style={styles.container}>
          <Spacer value={29} />
          <View style={styles.newListTitle}>
            <Text
              fontSize={20}
              fontFamily="Inter_700Bold"
              color={COLORS.neutral900}
            >
              {bottomSheetTitle}
            </Text>
          </View>
          <View style={styles.portfolioPerfomance}>
            <View ref={shareRef}>
              <ViewShot>
                <PortfolioPerformance {...portfolioBalanceProps} />
              </ViewShot>
            </View>
          </View>
          <Spacer value={verticalScale(40)} />
          <View style={styles.shareButtons}>
            <Row justifyContent="space-between" alignItems="center">
              <View style={styles.shareButton}>
                <Button
                  testID="SharePortfolio_Twitter_Button"
                  type="circular"
                  style={styles.twitterBtn}
                  onPress={async () => onSharePress(Social.Twitter)}
                >
                  <TwitterIcon color={COLORS.neutral0} />
                </Button>
                <Spacer value={verticalScale(8)} />
                <Text>Twitter</Text>
              </View>
              <View
                style={[styles.shareButton, { marginHorizontal: scale(36) }]}
              >
                <Button
                  testID="SharePortfolio_Message_Button"
                  type="circular"
                  style={styles.messagesBtn}
                  onPress={() => onSharePress(Social.Sms)}
                >
                  <MessagesIcon color={COLORS.neutral0} />
                </Button>
                <Spacer value={verticalScale(8)} />
                <Text>{t('common.messages')}</Text>
              </View>
              <View style={styles.shareButton}>
                <Button
                  testID="SharePortfolio_More_Button"
                  type="circular"
                  style={styles.lightBtn}
                  onPress={() => onSharePress()}
                >
                  <PlusIcon color={COLORS.gray800} />
                </Button>
                <Spacer value={verticalScale(8)} />
                <Text>{t('common.more')}</Text>
              </View>
            </Row>
          </View>
        </View>
      </BottomSheetFloat>
    );
  }
);
