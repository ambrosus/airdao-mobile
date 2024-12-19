import React, { MutableRefObject, RefObject, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { InputRef, Text } from '@components/base';
import { InputWithIcon } from '@components/composite';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';
import { styles } from './style';

interface RenderWordsModel {
  inputs: MutableRefObject<RefObject<InputRef>[]>;
  mnemonicWords: string[];
  handleWordChange: (index: number, text: string) => void;
  focusNextInput: (from: number) => void;
  navigateToRestoreWallet: () => Promise<void>;
}

export const RenderWords = ({
  inputs,
  mnemonicWords,
  handleWordChange,
  focusNextInput,
  navigateToRestoreWallet
}: RenderWordsModel) => {
  const inputAxisStyle = useCallback(
    (index: number) => ({
      paddingLeft: scale(index + 1 > 9 ? 17 : 10)
    }),
    []
  );
  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const returnKeyType = index === mnemonicWords.length ? 'done' : 'next';

    const onSubmitEditingHandle = () =>
      index === mnemonicWords.length
        ? navigateToRestoreWallet()
        : focusNextInput(index);

    return (
      <View style={styles.container}>
        <InputWithIcon
          blurOnSubmit={false}
          ref={inputs.current[index]}
          value={item}
          type="text"
          style={inputAxisStyle(index)}
          returnKeyType={returnKeyType}
          autoCapitalize="none"
          iconLeft={
            <Text
              fontSize={16}
              fontFamily="Inter_400Regular"
              color={item !== '' ? COLORS.neutral900 : COLORS.alphaBlack60}
            >
              {index + 1}.{' '}
            </Text>
          }
          spacingLeft={0}
          spacingRight={0}
          onChangeText={(text) => handleWordChange(index, text)}
          onSubmitEditing={onSubmitEditingHandle}
        />
      </View>
    );
  };

  return (
    <FlatList
      numColumns={2}
      data={mnemonicWords}
      keyExtractor={(_, index) => index.toString()}
      scrollEnabled={false}
      renderItem={renderItem}
      columnWrapperStyle={styles.columnWrapperStyle}
      contentContainerStyle={styles.contentContainerStyle}
    />
  );
};
