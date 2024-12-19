/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  preset: 'jest-expo',
  transform: {
    '\\.ts?$': '<rootDir>/node_modules/babel-jest',
    '\\.js?$': '<rootDir>/node_modules/babel-jest'
  },
  moduleNameMapper: {
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1'
  },
  testMatch: ['**/?(*.)+(spec|test).ts'],
  setupFiles: ['<rootDir>/jest/setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(@neverdull-agency/expo-unlimited-secure-store|node_modules))(?!victory-native)/|node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ]
};
