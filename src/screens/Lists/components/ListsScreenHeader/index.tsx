import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Spacer } from '@components/atoms/Spacer';
import { BadgeButton } from '@components/BadgeButton/BadgeIconButton';
import { FilterButtonIcon } from '@components/svg/FilterButton';
import { SettingsButtonIcon } from '@components/svg/SettingsButtonIcon';
import { COLORS } from '../../../../constants/colors';
import { ArrowIcon } from '@components/svg/ArrowIcon';

export const ListsScreenHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <View style={styles.settingsButton}>
          <BadgeButton icon={<FilterButtonIcon />} />
        </View>
        <BadgeButton icon={<SettingsButtonIcon />} />
      </View>
      <Spacer value={9} />
      <Text style={styles.headerTextStyle}>Total list balance</Text>
      <Spacer value={15} />
      <Text style={styles.balanceHeaderStyle}>$3,900.90</Text>
      <View style={styles.bottomStatsContainer}>
        <View style={styles.priceStyle}>
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12 }}>
            20,000 AMB
          </Text>
        </View>
        <ArrowIcon />
        <View style={styles.progressStyle}>
          <Text
            style={{
              fontFamily: 'Inter_500Medium',
              fontSize: 12,
              color: COLORS.lightGrey
            }}
          >
            4%
          </Text>
        </View>

        <Text>24HR</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    paddingRight: 17,
    justifyContent: 'flex-end'
  },
  settingsButton: {
    paddingRight: 16
  },
  headerTextStyle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.lightGrey,
    opacity: 1
  },
  balanceHeaderStyle: {
    paddingBottom: 12,
    fontFamily: 'Mersad_600SemiBold',
    fontSize: 36,
    color: COLORS.black
  },
  container: { paddingTop: 5, paddingLeft: 16 },
  bottomStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  priceStyle: {
    paddingRight: 14
  },
  progressStyle: {
    paddingLeft: 7,
    paddingRight: 4
  }
});
