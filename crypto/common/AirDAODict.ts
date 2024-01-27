import CoinAirDAODict from '@crypto/assets/coinAirDAODict.json';
import { Database } from '@database';
import { DatabaseTable } from '@appTypes';

const VisibleCodes = ['ETH'];
const Codes = ['ETH', 'BNB_SMART'];
const Currencies = CoinAirDAODict;

const ALL_SETTINGS = {};

function getCurrencyAllSettings(currencyCodeOrObject, source = '') {
  let currencyCode = currencyCodeOrObject;
  if (typeof currencyCode === 'undefined' || !currencyCode) {
    return false;
  }
  if (currencyCode === 'ETH_LAND') {
    Database.unsafeRawQuery(
      DatabaseTable.Accounts,
      `DELETE FROM ${DatabaseTable.Accounts} WHERE currency_code='ETH_LAND'`
    );
  }

  if (typeof currencyCodeOrObject.currencyCode !== 'undefined') {
    currencyCode = currencyCodeOrObject.currencyCode;
  }
  if (typeof ALL_SETTINGS[currencyCode] !== 'undefined') {
    return ALL_SETTINGS[currencyCode];
  }

  const settings = Currencies[currencyCode];
  if (!settings) {
    throw new Error(
      'Currency code not found in dict ' +
        JSON.stringify(currencyCode) +
        ' from ' +
        source
    );
  }
  if (settings.extendsProcessor && Currencies[settings.extendsProcessor]) {
    const settingsParent = Currencies[settings.extendsProcessor];
    let newKey;
    for (newKey of Object.keys(settingsParent)) {
      if (
        typeof settings[newKey] === 'undefined' ||
        settings[newKey] === false
      ) {
        settings[newKey] = settingsParent[newKey];
      }
    }
  }
  ALL_SETTINGS[currencyCode] = settings;
  return settings;
}

export default {
  VisibleCodes,
  Codes,
  Currencies,
  getCurrencyAllSettings
};
