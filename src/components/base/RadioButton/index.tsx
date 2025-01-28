import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

type Props = {
  onPress: () => void;
  isActive: boolean;
  testID?: string;
};

export const RadioButton = ({ onPress, isActive, testID }: Props) => {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      style={styles.mainContainer}
    >
      <View style={[styles.radioButtonIcon]}>
        <View
          style={[
            isActive ? styles.radioButtonActive : styles.radioButtonInactive
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: 40,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  radioButtonIcon: {
    backgroundColor: COLORS.sapphireBlue,
    height: 24,
    width: 24,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioButtonInactive: {
    height: 24,
    width: 24,
    backgroundColor: 'white',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.lightGrey
  },
  radioButtonActive: {
    height: 0,
    width: 0,
    backgroundColor: 'white',
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.neutral0
  }
});
