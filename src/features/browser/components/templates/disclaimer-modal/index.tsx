import { ForwardedRef, forwardRef } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { InfoIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { useForwardedRef } from '@hooks';
import { scale } from '@utils';
import { styles } from './styles';

interface DisclaimerModalProps {
  onApprove: () => void;
  onReject: () => void;
}

export const DisclaimerModal = forwardRef<BottomSheetRef, DisclaimerModalProps>(
  ({ onApprove, onReject }, ref) => {
    const { t } = useTranslation();
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

    return (
      <BottomSheet
        ref={localRef}
        containerStyle={styles.bottomSheet}
        swiperIconVisible={false}
        swipingEnabled={false}
        height={'100%'}
      >
        <View style={styles.container}>
          <InfoIcon scale={0.8} />
          <Text
            fontSize={scale(20)}
            fontFamily="Inter_700Bold"
            color={COLORS.neutral800}
            align="center"
          >
            {t('browser.disclaimer.header')}
          </Text>
          <Text
            fontSize={15}
            fontFamily="Inter_500Medium"
            color={COLORS.foregroundSecondaryContent}
            align="center"
          >
            {t('browser.disclaimer.description')}
          </Text>
          <Row width="100%" justifyContent={'space-around'}>
            <PrimaryButton style={styles.approve} onPress={onApprove}>
              <Text color={COLORS.neutral0}>{t('button.processed')}</Text>
            </PrimaryButton>

            <SecondaryButton style={styles.reject} onPress={onReject}>
              <Text color={COLORS.brand600}>{t('button.cancel')}</Text>
            </SecondaryButton>
          </Row>
        </View>
      </BottomSheet>
    );
  }
);
