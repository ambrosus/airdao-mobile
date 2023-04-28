import React, { ForwardedRef, forwardRef, RefObject, useRef } from 'react';
import { View } from 'react-native';
import { captureRef, CaptureOptions } from 'react-native-view-shot';
import { BottomSheet } from '@components/composite';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import {
  PortfolioPerformance,
  PortfolioPerformanceProps
} from '@components/templates/PortfolioPerformance';
import {
  BottomSheetSwiperIcon,
  ClipboardIcon,
  MessagesIcon,
  PlusIcon,
  TwitterIcon
} from '@components/svg/icons';
import { verticalScale } from '@utils/scaling';
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

    const onSharePress = async (type?: Social) => {
      const captureOptions: CaptureOptions = {
        fileName: `share_portfolio_${portfolioBalanceProps.timestamp.getTime()}`, // android only
        format: 'png'
      };
      const result = await captureRef(shareRef, captureOptions);
      const uri = result;
      if (type) {
        ShareUtils.socialShareImage(
          {
            uri: uri,
            title: `Share on ${type}!`
          },
          type
        );
      } else {
        ShareUtils.shareImage({
          uri: uri,
          title: `Share!`
        });
      }
    };

    return (
      <BottomSheet ref={localRef}>
        <View style={styles.container}>
          <View style={styles.icon}>
            <BottomSheetSwiperIcon />
          </View>
          <Spacer value={29} />
          <View style={styles.newListTitle}>
            <Text fontFamily="Inter_600SemiBold" title color={COLORS.black}>
              {bottomSheetTitle}
            </Text>
          </View>
          <View style={styles.portfolioPerfomance}>
            <View ref={shareRef}>
              <PortfolioPerformance {...portfolioBalanceProps} />
            </View>
          </View>
          <Spacer value={verticalScale(40)} />
          <View style={styles.shareButtons}>
            <Row justifyContent="space-between" alignItems="center">
              <View style={styles.shareButton}>
                <Button
                  type="circular"
                  style={styles.twitterBtn}
                  onPress={async () => onSharePress(Social.Twitter)}
                >
                  <TwitterIcon color="#FFFFFF" />
                </Button>
                <Spacer value={verticalScale(8)} />
                <Text>Twitter</Text>
              </View>
              <View style={styles.shareButton}>
                <Button
                  type="circular"
                  style={styles.messagesBtn}
                  onPress={() => onSharePress(Social.Sms)}
                >
                  <MessagesIcon color="#FFFFFF" />
                </Button>
                <Spacer value={verticalScale(8)} />
                <Text>Messages</Text>
              </View>
              <View style={styles.shareButton}>
                <Button type="circular" style={styles.lightBtn}>
                  <ClipboardIcon color="#222222" />
                </Button>
                <Spacer value={verticalScale(8)} />
                <Text>Copy link</Text>
              </View>
              <View style={styles.shareButton}>
                <Button
                  type="circular"
                  style={styles.lightBtn}
                  onPress={() => onSharePress()}
                >
                  <PlusIcon color="#222222" />
                </Button>
                <Spacer value={verticalScale(8)} />
                <Text>More</Text>
              </View>
            </Row>
          </View>
        </View>
      </BottomSheet>
    );
  }
);
