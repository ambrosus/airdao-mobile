import React, { ForwardedRef, forwardRef, RefObject, useRef } from 'react';
import { Platform, View } from 'react-native';
import { captureRef, CaptureOptions } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
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
    const shareRef = useRef(null);

    // TODO change type
    const onSharePress = async (type?: Social) => {
      const captureOptions: CaptureOptions = {
        fileName: `share_portfolio_${portfolioBalanceProps.timestamp.getTime()}`, // android only
        format: 'jpg'
        // result: 'base64'
      };
      const result = await captureRef(shareRef, captureOptions);
      const base64 = `data:image/jpg;base64, ${result}`;
      const uri = result;
      if (type) {
        console.log('share social');
        ShareUtils.socialShareImage(
          {
            base64: base64,
            title: `Share on ${type}!`
          },
          type
        );
      } else {
        console.log(' share image');
        ShareUtils.shareImage({
          base64: uri,
          title: `Share!`
        });
      }
      // const res = await Sharing.shareAsync(`file://${base64}`, {
      //   UTI: 'image/jpeg',
      //   mimeType: 'image/jpeg',
      //   dialogTitle: 'Check out price!'
      // });
      // console.log({ res });
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
                  style={styles.darkBtn}
                  onPress={async () => onSharePress(Social.Twitter)}
                >
                  <TwitterIcon color="#FFFFFF" />
                </Button>
                <Spacer value={verticalScale(8)} />
                <Text>Twitter</Text>
              </View>
              <View style={styles.shareButton}>
                <Button type="circular" style={styles.darkBtn}>
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
