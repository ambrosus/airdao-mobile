import React, { useEffect, useMemo, useRef } from 'react';
import { styles } from './styles';
import {
  KeyboardDismissingView,
  Spacer,
  Spinner,
  Text
} from '@components/base';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { BottomSheetRef } from '@components/composite';
import { useBridgeContextData } from '@features/bridge/context';
import { useKeyboardHeight } from '@hooks';
import { DEVICE_HEIGHT } from '@constants/variables';
import { PrimaryButton } from '@components/modular';
import { View } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { isAndroid } from '@utils/isPlatform';
import { COLORS } from '@constants/colors';
import { TokenSelectData } from '@features/bridge/templates/BridgeForm/components/TokenSelectData/TokenSelectData';
import { InputWithTokenSelect } from '@components/templates';
import { Tokens } from '@models/Bridge';
import { parseUnits } from 'ethers/lib/utils';
import { BottomSheetBridgePreview } from '@features/bridge/templates/BottomSheetBridgePreview/BottomSheetBridgePreview';
import { getFeeData } from '@features/bridge/context/helpers/getBridgeFee';
import { FeeData } from '@lib/bridgeSDK/models/types';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { NumberUtils } from '@utils/number';

export const BridgeForm = () => {
  const keyboardHeight = useKeyboardHeight() + DEVICE_HEIGHT * 0.01;

  const previewRef = useRef<BottomSheetRef>(null);
  const tokenSelectRef = useRef<BottomSheetRef>(null);
  const { t } = useTranslation();

  const { variables, methods } = useBridgeContextData();
  const {
    selectedTokenFrom,
    selectedTokenDestination,
    selectedTokenPairs,
    templateDataLoader,
    amountToBridge,
    bridgeConfig,
    networkNativeToken
  } = variables;
  const {
    setBridgePreviewData,
    setTemplateDataLoader,
    setAmountToBridge,
    setSelectedTokenPairs,
    processBridge
  } = methods;

  const initialMargin = useSharedValue(0);
  const margin = useAnimatedStyle(() => {
    return {
      marginBottom: withTiming(initialMargin.value)
    };
  });

  const error = useMemo(() => {
    if (!selectedTokenPairs || amountToBridge.trim() === '') return false;

    const bnInputBalance = selectedTokenFrom.balance;
    const bnAmount = parseUnits(amountToBridge, selectedTokenFrom.decimals);

    return bnAmount.gt(bnInputBalance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTokenPairs, amountToBridge]);

  const disabledButton = useMemo(() => {
    return !amountToBridge || error || templateDataLoader;
  }, [amountToBridge, error, templateDataLoader]);

  useEffect(() => {
    initialMargin.value = withTiming(keyboardHeight, {
      duration: 0
    });
  }, [initialMargin, keyboardHeight]);

  const onTokenSelect = (tokenPair: Tokens[]) => {
    // @ts-ignore
    setSelectedTokenPairs(tokenPair);
    tokenSelectRef?.current?.dismiss();
  };
  const parseBridgePreviewData = (feeData: FeeData, gasFee: BigNumberish) => {
    return [
      {
        name: t('bridge.preview.receive'),
        crypto: {
          amount: feeData?.amount ?? BigNumber.from(0),
          decimals: selectedTokenFrom.decimals
        },
        symbol: selectedTokenFrom.symbol
      },
      {
        name: t('bridge.preview.bridge.fee'),
        crypto: {
          amount: feeData.bridgeFee,
          decimals: networkNativeToken?.decimals || 18
        },
        symbol: networkNativeToken.symbol
      },
      {
        name: t('bridge.preview.network.fee'),
        crypto: {
          amount: feeData?.transferFee ?? BigNumber.from(0),
          decimals: networkNativeToken?.decimals || 18
        },
        symbol: networkNativeToken.symbol
      },
      {
        name: t('bridge.preview.gas.fee'),
        crypto: {
          amount: gasFee,
          decimals: networkNativeToken?.decimals || 18
        },
        symbol: networkNativeToken.symbol
      }
    ];
  };

  const goToPreview = async () => {
    const isMax =
      amountToBridge ===
      NumberUtils.limitDecimalCount(
        ethers.utils.formatUnits(
          // @ts-ignore
          selectedTokenFrom?.balance?._hex,
          selectedTokenFrom.decimals
        ),
        selectedTokenFrom.decimals ?? 18
      );
    try {
      setTemplateDataLoader(true);

      const feeData = await getFeeData({
        bridgeConfig,
        amountTokens: amountToBridge,
        selectedTokenFrom,
        selectedTokenDestination,
        setTemplateDataLoader,
        isMaxOptions: isMax
      });
      if (feeData) {
        const gasFee = await processBridge(true, feeData);
        if (gasFee) {
          const dataToPreview = parseBridgePreviewData(feeData, gasFee);
          const data = {
            value: {
              feeData,
              gasFee
            },
            dataToPreview
          };
          setBridgePreviewData(data);
          previewRef?.current?.show();
        }
      }
    } finally {
      setTimeout(() => setTemplateDataLoader(false), 500);
    }
  };

  return (
    <KeyboardDismissingView style={styles.separatedContainer}>
      <View style={styles.inputContainerWitHeading}>
        {templateDataLoader && (
          <View
            style={{
              zIndex: 1000,
              opacity: 0.7,
              position: 'absolute',
              width: '100%',
              height: 200,
              backgroundColor: COLORS.neutral0
            }}
          />
        )}
        <InputWithTokenSelect
          ref={tokenSelectRef}
          title={t('bridge.select.assets')}
          value={amountToBridge}
          label={t('bridge.set.amount')}
          // @ts-ignore
          token={selectedTokenFrom}
          bottomSheetNode={<TokenSelectData onPressItem={onTokenSelect} />}
          onChangeText={setAmountToBridge}
          onPressMaxAmount={() => {
            // do nothing
          }}
        />

        <Spacer value={scale(32)} />
      </View>
      <Animated.View style={[margin]}>
        <PrimaryButton onPress={goToPreview} disabled={disabledButton}>
          {templateDataLoader ? (
            <Spinner customSize={15} />
          ) : (
            <Text color={disabledButton ? COLORS.brand300 : COLORS.neutral0}>
              {error ? t('bridge.insufficient.funds') : t('button.preview')}
            </Text>
          )}
        </PrimaryButton>
      </Animated.View>
      <Spacer value={verticalScale(isAndroid ? 30 : 0)} />
      <BottomSheetBridgePreview ref={previewRef} />
    </KeyboardDismissingView>
  );
};
