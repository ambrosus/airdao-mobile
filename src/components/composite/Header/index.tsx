import React from 'react';
import { View } from 'react-native';
import { BackIcon, CloseIcon } from '@components/svg/icons';
import { Button, Row, Text } from '@components/base';
import { HeaderProps } from './Header.types';
import { styles } from './Header.styles';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@constants/colors';

export function Header(props: HeaderProps): JSX.Element {
  const {
    bottomBorder = false,
    backIconVisible = true,
    contentLeft,
    contentRight,
    contentCenter,
    title,
    closeIconVisible = false,
    titlePosition = 'center',
    style = {},
    titleStyle = {},
    leftContainerStyles = {},
    rightContainerStyles = {},
    centerContainerStyle = {},
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
          style={titleStyle}
          fontFamily="Inter_700Bold"
          fontSize={20}
          fontWeight="700"
          color={COLORS.neutral900}
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
        {closeIconVisible && (
          <Button onPress={navigation.goBack}>
            <CloseIcon />
          </Button>
        )}
        {backIconVisible && (
          <Button onPress={_onBackPress}>
            <BackIcon color={COLORS.neutral900} scale={1} />
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
    return contentCenter
      ? contentCenter
      : titlePosition === 'center' && renderTitle();
  };

  const renderContentRight = () => {
    return <>{contentRight}</>;
  };

  const combineContainerStyles = {
    ...styles.container,
    ...(bottomBorder ? styles.containerBorder : {}),
    ...style
  };

  return (
    <Row
      justifyContent="space-between"
      alignItems="center"
      style={combineContainerStyles}
    >
      <Row
        style={{ ...styles.left, ...leftContainerStyles }}
        alignItems="center"
      >
        {renderContentLeft()}
      </Row>
      <View style={[styles.center, centerContainerStyle]}>
        {renderContentCenter()}
      </View>
      <Row
        style={{ ...styles.right, ...rightContainerStyles }}
        alignItems="center"
        testID="Header_ContentRight"
      >
        {renderContentRight()}
      </Row>
    </Row>
  );
}
