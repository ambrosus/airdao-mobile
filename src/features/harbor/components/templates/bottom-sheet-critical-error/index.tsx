import { ForwardedRef, forwardRef, useEffect } from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { t } from 'i18next';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite';
import { AlertModalTemplate } from '@components/templates';
import { useForwardedRef } from '@hooks';
import { delay } from '@utils';
import { styles } from './styles';

interface CriticalErrorProps {
  visible?: boolean;
  title: string;
  message?: string;
  onClose?: () => void;
}

export const BottomSheetCriticalError = forwardRef<
  BottomSheetRef,
  BottomSheetProps & CriticalErrorProps
>((props, ref) => {
  const { visible, title, message, onClose, ...restProps } = props;
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const navigation = useNavigation();

  useEffect(() => {
    if (visible) {
      localRef.current?.show();
    }
  }, [visible, localRef]);

  const onButtonPress = async () => {
    localRef.current?.dismiss();
    await delay(200);
    if (onClose) {
      onClose();
    }
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'HomeScreen' }]
          })
        );
  };

  return (
    <BottomSheet
      ref={localRef}
      containerStyle={styles.bottomSheet}
      swiperIconVisible={false}
      swipingEnabled={false}
      height={'100%'}
      {...restProps}
    >
      <AlertModalTemplate
        title={!!title ? t(title) : 'Error'}
        subTitle={message ? t(message) : 'A critical error occurred'}
        buttonsLabels={['', t('wallet.connect.button.approve')]}
        onApprove={onButtonPress}
        onReject={onButtonPress}
      />
    </BottomSheet>
  );
});
