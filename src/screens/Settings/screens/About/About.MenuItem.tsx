import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { styles } from './styles';

export const AboutMenutItem = (props: { title: string }) => {
  return (
    <Row
      alignItems="center"
      justifyContent="space-between"
      style={styles.menuItem}
    >
      <Text
        color={COLORS.neutral900}
        fontSize={16}
        fontFamily="Inter_600SemiBold"
      >
        {props.title}
      </Text>
    </Row>
  );
};
