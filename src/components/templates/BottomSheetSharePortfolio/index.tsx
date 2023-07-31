import React, { ForwardedRef, forwardRef, RefObject, useRef } from 'react';
import { Platform, Share, View } from 'react-native';
import ViewShot, { captureRef, CaptureOptions } from 'react-native-view-shot';
import { BottomSheetFloat } from '@components/modular';
import { BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import {
  PortfolioPerformance,
  PortfolioPerformanceProps
} from '@components/templates/PortfolioPerformance';
import { ShareIcon } from '@components/svg/icons';
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
        Platform.OS === 'android'
          ? await ShareUtils.shareImage({
              uri,
              title: `Share!`
            })
          : await Share.share({
              title: `Share on ${type}!`,
              url: uri
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
              color={COLORS.smokyBlack}
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
          <Spacer value={verticalScale(24)} />
          <View style={styles.shareButtons}>
            <Row justifyContent="center" alignItems="center">
              {/*<View style={styles.shareButton}>*/}
              {/*  <Button*/}
              {/*    testID="SharePortfolio_Twitter_Button"*/}
              {/*    type="circular"*/}
              {/*    style={styles.twitterBtn}*/}
              {/*    onPress={async () => onSharePress(Social.Twitter)}*/}
              {/*  >*/}
              {/*    <TwitterIcon color="#FFFFFF" />*/}
              {/*  </Button>*/}
              {/*  <Spacer value={verticalScale(8)} />*/}
              {/*  <Text>Twitter</Text>*/}
              {/*</View>*/}
              {/*<View*/}
              {/*  style={[styles.shareButton, { marginHorizontal: scale(36) }]}*/}
              {/*>*/}
              {/*  <Button*/}
              {/*    testID="SharePortfolio_Message_Button"*/}
              {/*    type="circular"*/}
              {/*    style={styles.messagesBtn}*/}
              {/*    onPress={() => onSharePress(Social.Sms)}*/}
              {/*  >*/}
              {/*    <MessagesIcon color="#FFFFFF" />*/}
              {/*  </Button>*/}
              {/*  <Spacer value={verticalScale(8)} />*/}
              {/*  <Text>Messages</Text>*/}
              {/*</View>*/}
              {/*<View style={styles.shareButton}>*/}
              {/*<Button*/}
              {/*  testID="SharePortfolio_More_Button"*/}
              {/*  type="circular"*/}
              {/*  style={styles.lightBtn}*/}
              {/*  onPress={() => onSharePress()}*/}
              {/*>*/}
              {/*  /!*<PlusIcon color="#222222" />*!/*/}
              {/*  <Text>Share</Text>*/}
              {/*</Button>*/}
              {/*<Spacer value={verticalScale(8)} />*/}
              {/*<Text>Share</Text>*/}
              <Button
                type="circular"
                style={styles.shareBtn}
                onPress={() => onSharePress()}
                testID="SharePortfolio_More_Button"
              >
                <Row alignItems="center">
                  <ShareIcon color="#000000" />
                  <Spacer value={scale(3.5)} horizontal />
                  <Text>Share</Text>
                </Row>
              </Button>
              {/*</View>*/}
            </Row>
          </View>
        </View>
      </BottomSheetFloat>
    );
  }
);
