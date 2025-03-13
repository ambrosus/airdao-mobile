import { ReactElement, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@components/base';
import { CheckIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { ACTION_TYPES } from '@features/browser/constants';
import { scale } from '@utils';
import { styles } from './styles';

interface Props {
  title: string;
  type: string;
  icon: ReactElement;
  onPress: () => void;
}

export const BrowserActionItem = ({ title, icon, type, onPress }: Props) => {
  const { t } = useTranslation();
  const [text, setText] = useState(title);
  const [color, setColor] = useState(COLORS.neutral900);
  const [currentIcon, setCurrentIcon] = useState(icon);

  const handleClick = () => {
    onPress();

    if (type === ACTION_TYPES.COPY) {
      setText(t('common.copied'));
      setColor(COLORS.success500);
      setCurrentIcon(<CheckIcon scale={1.5} color={COLORS.success500} />);

      setTimeout(() => {
        setText(title);
        setColor(COLORS.neutral900);
        setCurrentIcon(icon);
      }, 1000);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleClick}>
      <Text fontSize={scale(16)} color={color}>
        {text}
      </Text>
      <View style={styles.svgContainer}>{currentIcon}</View>
    </TouchableOpacity>
  );
};
