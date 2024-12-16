import React, { MutableRefObject, RefObject } from 'react';
import { View } from 'react-native';
import { scale } from '@utils/scaling';
import { InputRef, Row, Text } from '@components/base';
import { InputWithIcon } from '@components/composite';
import { COLORS } from '@constants/colors';
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
  const wordInputs = [];
  for (let i = 0; i < 12; i += 2) {
    wordInputs.push(
      <Row
        key={i}
        alignItems="center"
        justifyContent="space-between"
        style={styles.main}
      >
        <View style={styles.container}>
          <InputWithIcon
            blurOnSubmit={false}
            ref={inputs.current[i]}
            value={mnemonicWords[i]}
            style={{ paddingLeft: scale(i + 1 > 9 ? 17 : 10) }}
            type="text"
            returnKeyType="next"
            autoCapitalize="none"
            iconLeft={
              <Text
                fontSize={16}
                fontFamily="Inter_400Regular"
                color={
                  mnemonicWords[i] !== ''
                    ? COLORS.neutral900
                    : COLORS.alphaBlack60
                }
              >
                {i + 1}.{' '}
              </Text>
            }
            spacingLeft={0}
            spacingRight={0}
            onChangeText={(text) => handleWordChange(i, text)}
            onSubmitEditing={() => focusNextInput(i)}
          />
        </View>
        <View style={styles.container}>
          <InputWithIcon
            ref={inputs.current[i + 1]}
            value={mnemonicWords[i + 1]}
            style={{ paddingLeft: scale(i + 2 > 9 ? 17 : 10) }}
            type="text"
            autoCapitalize="none"
            returnKeyType={i === 10 ? 'done' : 'next'}
            iconLeft={
              <Text
                fontSize={16}
                fontFamily="Inter_400Regular"
                color={
                  mnemonicWords[i + 1] !== ''
                    ? COLORS.neutral900
                    : COLORS.alphaBlack60
                }
              >
                {i + 2}.{' '}
              </Text>
            }
            spacingLeft={0}
            spacingRight={0}
            onChangeText={(text) => handleWordChange(i + 1, text)}
            onSubmitEditing={() =>
              i === 10 ? navigateToRestoreWallet() : focusNextInput(i + 1)
            }
          />
        </View>
      </Row>
    );
  }

  return wordInputs;
};
