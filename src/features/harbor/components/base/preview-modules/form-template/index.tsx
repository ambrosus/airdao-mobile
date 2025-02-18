import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { TextOrSpinner } from '@components/composite';
import { PrimaryButton, TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import {
  FormTemplateProps,
  HarborPreViewData
} from '@features/harbor/components/harbor-preview/model';
import { scale } from '@utils';
import { styles } from './styles';

export const FormTemplate = ({
  data,
  buttonTitle,
  onAcceptPress,
  loading
}: FormTemplateProps) => {
  const { t } = useTranslation();

  const onPress = () => {
    if (loading) return;
    onAcceptPress();
  };
  const RenderPreviewFormData = (
    formItem: ListRenderItemInfo<HarborPreViewData>
  ) => {
    const { item } = formItem;

    if (!data) {
      return null;
    }

    return (
      <Row
        justifyContent={'space-between'}
        style={{ paddingVertical: scale(10) }}
      >
        {!!item?.name && (
          <Text
            fontFamily={'Inter_500Medium'}
            fontSize={scale(14)}
            color={COLORS.neutral600}
          >
            {t(item.name)}
          </Text>
        )}
        <Row alignItems="center">
          {!!item?.symbol && (
            <>
              <TokenLogo scale={0.7} token={item.symbol} />
              <Spacer horizontal value={scale(4)} />
            </>
          )}
          <Text
            fontSize={scale(14)}
            color={COLORS.neutral900}
            style={item?.textStyle || {}}
          >
            {item.value}{' '}
          </Text>
          {!!item.timeSymbol && (
            <Text fontSize={scale(14)} color={COLORS.neutral900}>
              {t(item.timeSymbol)}
            </Text>
          )}
          {!!item.symbol && (
            <Text fontSize={scale(14)} color={COLORS.neutral900}>
              {item.symbol}
            </Text>
          )}
        </Row>
      </Row>
    );
  };

  return (
    <View>
      <FlatList
        contentContainerStyle={styles.wrapper}
        data={data}
        renderItem={RenderPreviewFormData}
      />
      <Spacer value={scale(20)} />
      <PrimaryButton disabled={loading} onPress={onPress}>
        <TextOrSpinner
          styles={{
            loading: {
              color: COLORS.brand600
            },
            active: {
              color: COLORS.neutral0
            }
          }}
          loading={loading}
          loadingLabel={t('harbor.button.processing')}
          label={buttonTitle}
        />
      </PrimaryButton>
      <Spacer value={scale(12)} />
    </View>
  );
};
