import { addHexPrefix, stripHexPrefix } from 'ethereumjs-util';
import { strictEqual } from 'assert';
import BN from 'bn.js';
import enums from './enums';
const {
  ENVIRONMENT_TYPE_POPUP,
  ENVIRONMENT_TYPE_NOTIFICATION,
  ENVIRONMENT_TYPE_FULLSCREEN,
  PLATFORM_FIREFOX,
  PLATFORM_OPERA,
  PLATFORM_CHROME,
  PLATFORM_EDGE,
  PLATFORM_BRAVE
} = enums;

/**
 * Generates an example stack trace
 *
 * @returns {string} A stack trace
 *
 */
function getStack() {
  return new Error('Stack trace generator - not an error').stack;
}

/**
 * Used to determine the window type through which the app is being viewed.
 *  - 'popup' refers to the extension opened through the browser app icon (in top right corner in chrome and firefox)
 *  - 'responsive' refers to the main browser window
 *  - 'notification' refers to the popup that appears in its own window when taking action outside of metamask
 *
 * @returns {string} A single word label that represents the type of window through which the app is being viewed
 *
 */
const getEnvironmentType = (url = window.location.href) => {
  if (url.match(/popup.html(?:#.*)*$/)) {
    return ENVIRONMENT_TYPE_POPUP;
  } else if (
    url.match(/home.html(?:\?.+)*$/) ||
    url.match(/home.html(?:#.*)*$/)
  ) {
    return ENVIRONMENT_TYPE_FULLSCREEN;
  } else {
    return ENVIRONMENT_TYPE_NOTIFICATION;
  }
};

// noinspection JSUnusedLocalSymbols
/**
 * Returns the platform (browser) where the extension is running.
 *
 * @returns {string} the platform ENUM
 *
 */
const getPlatform = (_) => {
  const ua = navigator.userAgent;
  if (ua.search('Firefox') !== -1) {
    return PLATFORM_FIREFOX;
  } else {
    // noinspection JSUnresolvedVariable
    if (window && window.chrome && window.chrome.ipcRenderer) {
      return PLATFORM_BRAVE;
    } else if (ua.search('Edge') !== -1) {
      return PLATFORM_EDGE;
    } else if (ua.search('OPR') !== -1) {
      return PLATFORM_OPERA;
    } else {
      return PLATFORM_CHROME;
    }
  }
};

/**
 * Checks whether a given balance of ETH, represented as a hex string, is sufficient to pay a value plus a gas fee
 *
 * @param {object} txParams Contains data about a transaction
 * @param {string} txParams.gas The gas for a transaction
 * @param {string} txParams.gasPrice The price per gas for the transaction
 * @param {string} txParams.value The value of ETH to send
 * @param {string} hexBalance A balance of ETH represented as a hex string
 * @returns {boolean} Whether the balance is greater than or equal to the value plus the value of gas times gasPrice
 *
 */
function sufficientBalance(txParams, hexBalance) {
  // validate hexBalance is a hex string
  strictEqual(
    typeof hexBalance,
    'string',
    'sufficientBalance - hexBalance is not a hex string'
  );
  strictEqual(
    hexBalance.slice(0, 2),
    '0x',
    'sufficientBalance - hexBalance is not a hex string'
  );

  const balance = hexToBn(hexBalance);
  const value = hexToBn(txParams.value);
  const gasLimit = hexToBn(txParams.gas);
  const gasPrice = hexToBn(txParams.gasPrice);

  // noinspection JSUnresolvedFunction
  const maxCost = value.add(gasLimit.mul(gasPrice));
  // noinspection JSUnresolvedFunction
  return balance.gte(maxCost);
}

/**
 * Converts a BN object to a hex string with a '0x' prefix
 *
 * @param {BN} inputBn The BN to convert to a hex string
 * @returns {string} A '0x' prefixed hex string
 *
 */
function bnToHex(inputBn) {
  // noinspection JSCheckFunctionSignatures
  return addHexPrefix(inputBn.toString(16));
}

/**
 * Converts a hex string to a BN object
 *
 * @param {string} inputHex A number represented as a hex string
 * @returns {Object} A BN object
 *
 */
function hexToBn(inputHex) {
  // noinspection JSUnresolvedFunction
  return new BN(stripHexPrefix(inputHex), 16);
}

/**
 * Used to multiply a BN by a fraction
 *
 * @param {BN} targetBN The number to multiply by a fraction
 * @param {number|string} numerator The numerator of the fraction multiplier
 * @param {number|string} denominator The denominator of the fraction multiplier
 * @returns {BN} The product of the multiplication
 *
 */
function BnMultiplyByFraction(targetBN, numerator, denominator) {
  const numBN = new BN(numerator);
  const denomBN = new BN(denominator);
  // noinspection JSUnresolvedFunction
  return targetBN.mul(numBN).div(denomBN);
}

function applyListeners(listeners, emitter) {
  Object.keys(listeners).forEach((key) => {
    emitter.on(key, listeners[key]);
  });
}

function removeListeners(listeners, emitter) {
  Object.keys(listeners).forEach((key) => {
    emitter.removeListener(key, listeners[key]);
  });
}

// noinspection JSUnusedGlobalSymbols
export default {
  removeListeners,
  applyListeners,
  getPlatform,
  getStack,
  getEnvironmentType,
  sufficientBalance,
  hexToBn,
  bnToHex,
  BnMultiplyByFraction
};
