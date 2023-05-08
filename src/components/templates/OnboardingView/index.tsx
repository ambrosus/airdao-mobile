import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Tooltip, { TooltipStyleProps } from 'react-native-walkthrough-tooltip';
import { OnBoardingToolTipBody } from '@components/composite';
import { Button } from '@components/base';
import { OnboardingContent } from '@constants/onboarding-content';
import { useOnboardingStatus } from '@contexts';
import { styles } from './styles';

const DEFAULT_BOTTOM_TAB_HEIGHT = 65;

type OnboardingViewType = 'view' | 'float';

interface OnboardingViewProps extends PropsWithChildren {
  type?: OnboardingViewType;
  childrenAlwaysVisible?: boolean;
  tooltipPlacement?: 'center' | 'bottom' | 'left' | 'right' | 'top' | undefined;
  thisStep: number;
  contentStyle?: TooltipStyleProps['contentStyle'];
  helpers?: {
    back?: () => unknown;
    next?: () => unknown;
    skip?: () => unknown;
  };
  removeAndroidStatusBarHeight?: boolean; // Android only
}

export const OnboardingView = (props: OnboardingViewProps) => {
  const {
    children,
    type = 'view',
    thisStep = -1,
    childrenAlwaysVisible = false,
    tooltipPlacement,
    contentStyle = {},
    helpers = {},
    removeAndroidStatusBarHeight = false
  } = props;
  const { status, back, next, skip, registerHelpers } = useOnboardingStatus(
    (v) => v
  );

  useEffect(() => {
    if (Object.keys(helpers).length > 0 && status === thisStep) {
      const backFn = helpers.back || undefined;
      const nextFn = helpers.next || undefined;
      const skipFn = helpers.skip || undefined;
      registerHelpers({ back: backFn, next: nextFn, skip: skipFn });
    }
  }, [helpers, thisStep, status, registerHelpers]);

  const {
    title,
    body,
    hideBack = false,
    closeButtonVisible = false
  } = OnboardingContent[status] || OnboardingContent[0];
  const content = useMemo(() => {
    return (
      <OnBoardingToolTipBody
        handleButtonClose={closeButtonVisible ? skip : undefined}
        title={title}
        buttonRightTitle={'Skip Tutorial'}
        subtitle={body}
        buttonLeftTitle={'Back'}
        isButtonLeftVisible={!hideBack}
        handleButtonLeftPress={() => back(thisStep)}
        handleButtonRightPress={skip}
      />
    );
  }, [back, skip, body, hideBack, title, thisStep, closeButtonVisible]);
  const isToolTipVisible = status === thisStep;
  const bottomSafeArea = useSafeAreaInsets().bottom || 34;
  if (!isToolTipVisible && childrenAlwaysVisible) return <>{children}</>;
  if (!isToolTipVisible) return null;

  return (
    <View
      style={
        type === 'float'
          ? [
              styles.tooltip,
              { bottom: bottomSafeArea + DEFAULT_BOTTOM_TAB_HEIGHT }
            ]
          : []
      }
    >
      <Tooltip
        tooltipStyle={{ flex: 1 }}
        contentStyle={[{ borderRadius: 8 }, contentStyle]}
        arrowSize={{ width: 16, height: 8 }}
        backgroundColor="rgba(0,0,0,0.5)"
        isVisible={isToolTipVisible}
        content={content}
        placement={tooltipPlacement}
        onClose={() => null}
        topAdjustment={
          removeAndroidStatusBarHeight
            ? Platform.select({
                android: -(StatusBar.currentHeight || 0),
                default: 0
              })
            : 0
        }
      >
        <Button style={{ width: '100%' }} onPress={() => next(thisStep)}>
          <View pointerEvents="none">{children}</View>
        </Button>
      </Tooltip>
    </View>
  );
};
