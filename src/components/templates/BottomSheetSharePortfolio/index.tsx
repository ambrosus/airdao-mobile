import React, { ForwardedRef, forwardRef, RefObject, useRef } from 'react';
import { Linking, Platform, Share, View } from 'react-native';
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
        if (Platform.OS === 'ios') {
          try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const base64Image = reader.result as string;
                const truncatedBase64Image = base64Image.slice(0, 1000);
                const url = `sms:&body=${truncatedBase64Image}`;
                Linking.openURL(url);
              } catch (error) {
                console.error('Error opening SMS app:', error);
              }
            };
            reader.readAsDataURL(blob);
          } catch (error) {
            console.error('Error reading image file:', error);
          }
        } else {
          const base64Image = uri.replace(/^.*\/(.*)$/, '$1');
          const truncatedBase64Image = base64Image.slice(0, 1000);
          const url = `sms:?body=${truncatedBase64Image}`;
          Linking.openURL(url);
        }
        await ShareUtils.socialShareImage(
          {
            uri,
            title: `Share on ${type}!`
          },
          type
        );
      } else {
        const message = `Check out my portfolio! ${uri}`;
        if (message.length <= 1000) {
          await Share.share({
            title: 'Share',
            message,
            url: uri
          });
        } else {
          console.error('Message too long for SMS');
        }
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
                  <TwitterIcon color="#FFFFFF" />
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
                  <MessagesIcon color="#FFFFFF" />
                </Button>
                <Spacer value={verticalScale(8)} />
                <Text>Messages</Text>
              </View>
              <View style={styles.shareButton}>
                <Button
                  testID="SharePortfolio_More_Button"
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
      </BottomSheetFloat>
    );
  }
);
