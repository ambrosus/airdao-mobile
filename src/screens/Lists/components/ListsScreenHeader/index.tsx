import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Spacer } from '@components/base/Spacer';
import { FilterButtonIcon } from '@components/svg/FilterButton';
import { SettingsButtonIcon } from '@components/svg/SettingsButtonIcon';
import { COLORS } from '../../../../constants/colors';
import { ArrowIcon } from '@components/svg/ArrowIcon';
import { Button } from '@components/base';

export const ListsScreenHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.badgeButtonsContainer}>
        <Button
          style={{ ...styles.badgeButtonContainer, ...styles.settingsButton }}
          type="base"
        >
          <View style={styles.badgeButtonIcon}>
            <FilterButtonIcon />
          </View>
        </Button>
        <Button style={styles.badgeButtonContainer} type="base">
          <View style={styles.badgeButtonIcon}>
            <SettingsButtonIcon />
          </View>
        </Button>
      </View>
      <Spacer value={9} />
      <Text style={styles.balanceSubtitle}>Total list balance</Text>
      <Spacer value={15} />
      <Text style={styles.balanceCount}>$3,900.90</Text>
      <View style={styles.balanceStats}>
        <Text
          style={[
            styles.balanceTokens,
            { fontFamily: 'Inter_500Medium', fontSize: 12 }
          ]}
        >
          20,000 AMB
        </Text>
        <ArrowIcon />
        <Text
          style={[
            styles.progressInfo,
            {
              fontFamily: 'Inter_500Medium',
              fontSize: 12,
              color: COLORS.lightGrey
            }
          ]}
        >
          4%
        </Text>
        <Text>24HR</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: { paddingTop: 5, paddingLeft: 16 },
  badgeButtonsContainer: {
    flexDirection: 'row',
    paddingRight: 17,
    justifyContent: 'flex-end'
  },
  settingsButton: {
    marginRight: 16
  },
  balanceSubtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.lightGrey,
    opacity: 1
  },
  balanceCount: {
    paddingBottom: 12,
    fontFamily: 'Mersad_600SemiBold',
    fontSize: 36,
    color: COLORS.black
  },
  balanceStats: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  balanceTokens: {
    paddingRight: 14
  },
  progressInfo: {
    paddingLeft: 7,
    paddingRight: 4
  },
  badgeButtonContainer: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ' rgba(47, 43, 67, 0.05)'
  },
  badgeButtonIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
