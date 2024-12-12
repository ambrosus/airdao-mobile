import React from 'react';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { PrimaryButton } from '@components/modular';
import { TextOrSpinner } from '@components/composite';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { scale } from '@utils/scaling';
import { FormPreviewDataModel } from '@features/harbor/components/modular/model';

interface PreviewFormModel {
  formPreviewData: FormPreviewDataModel[];
  btnTitle?: string;
  onAcceptPress: () => void;
  loader: boolean;
}

export const PreviewForm = ({
  btnTitle,
  formPreviewData,
  onAcceptPress,
  loader
}: PreviewFormModel) => {
  const { t } = useTranslation();

  const RenderPreviewFormData = (
    item: ListRenderItemInfo<FormPreviewDataModel>
  ) => {
    const {
      index,
      item: { title, content }
    } = item;
    return (
      <>
        <Row justifyContent="space-between">
          <Text style={styles.title}>{t(title)}</Text>
          {content}
        </Row>
        {index + 1 !== formPreviewData.length && <Spacer value={scale(12)} />}
      </>
    );
  };

  return (
    <>
      <FlatList
        contentContainerStyle={styles.wrapper}
        data={formPreviewData}
        renderItem={RenderPreviewFormData}
      />
      <PrimaryButton onPress={onAcceptPress}>
        <TextOrSpinner
          spinnerColor={COLORS.neutral0}
          spinnerSize={'small'}
          loading={loader}
          styles={{
            active: styles.regularBtnStyle,
            loading: styles.loadingBtnStyle
          }}
          loadingLabel={t('kosmos.button.processing')}
          label={btnTitle || t('staking.header')}
        />
      </PrimaryButton>
    </>
  );
};
