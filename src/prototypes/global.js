/* eslint-disable @typescript-eslint/no-var-requires */
// Inject node globals into React Native global scope.
import Crypto from 'react-native-quick-crypto';
global.Buffer = require('buffer').Buffer;
global.process = require('process');

if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return new Buffer(str, 'binary').toString('base64');
  };
}

if (typeof atob === 'undefined') {
  global.atob = function (b64Encoded) {
    return new Buffer(b64Encoded, 'base64').toString('binary');
  };
}

if (typeof global.crypto !== 'object') {
  // global.crypto = Crypto;
}

if (typeof window !== 'undefined') {
  window.crypto = Crypto;
  window.crypto.getRandomValues = Crypto.getRandomValues;
}

if (typeof global.crypto.getRandomValues !== 'function') {
  global.crypto.getRandomValues = Crypto.getRandomValues;
}
