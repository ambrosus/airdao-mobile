import React from 'react';
import { View } from 'react-native';
import { BackIcon } from '@components/svg/icons';
import { Button, Row, Text } from '@components/base';
import { HeaderProps } from './Header.types';
import { styles } from './Header.styles';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@constants/colors';

export function Header(props: HeaderProps): JSX.Element {
  const {
    backIconVisible = true,
    contentLeft,
    contentRight,
    title,
    titlePosition = 'center',
    style = {},
    onBackPress
  } = props;
  const navigation = useNavigation();

  const _onBackPress = () => {
    if (typeof onBackPress === 'function') {
      onBackPress();
      return;
    }
    navigation.goBack();
  };

  const renderTitle = () => {
    if (typeof title === 'string') {
      return (
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={15}
          color={COLORS.black}
          title
        >
          {title}
        </Text>
      );
    }
    return title;
  };

  const renderContentLeft = () => {
    return (
      <>
        {backIconVisible && (
          <Button onPress={_onBackPress}>
            <BackIcon />
          </Button>
        )}
        {titlePosition === 'left' && (
          <View style={styles.titleOnLeft}>{renderTitle()}</View>
        )}
        {contentLeft}
      </>
    );
  };

  const renderContentCenter = () => {
    return titlePosition === 'center' && renderTitle();
  };

  const renderContentRight = () => {
    return <>{contentRight}</>;
  };

  return (
    <Row
      justifyContent="space-between"
      alignItems="center"
      style={{ ...styles.container, ...style }}
    >
      <Row style={styles.left} alignItems="center">
        {renderContentLeft()}
      </Row>
      <View style={styles.center}>{renderContentCenter()}</View>
      <Row style={styles.right} alignItems="center">
        {renderContentRight()}
      </Row>
    </Row>
  );
}
