import { TextStyle, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { Row, Spacer, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

interface TitleData {
  name: string;
  textStyle?: TextStyle;
  symbol?: CryptoCurrencyCode;
  value: string;
}

export const SuccessTitle = ({
  titleData
}: {
  titleData: TitleData | null;
}) => {
  const { t } = useTranslation();
  if (titleData) {
    return (
      <View>
        <Spacer value={scale(8)} />
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={scale(14)}
          color={COLORS.neutral900}
          align="center"
          style={titleData.textStyle || {}}
        >
          {t(titleData.name)}
        </Text>
        <Spacer value={scale(8)} />
        <Row alignItems="center" justifyContent="center">
          {titleData.symbol && <TokenLogo token={titleData.symbol} />}
          {titleData.value && titleData.symbol && (
            <Text
              fontFamily="Inter_700Bold"
              color={COLORS.neutral900}
              fontSize={scale(24)}
            >
              {' '}
              {titleData.value} {titleData.symbol}
            </Text>
          )}
        </Row>
      </View>
    );
  }
};
