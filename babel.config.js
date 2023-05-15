module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-transform-flow-strip-types'],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      [
        'module-resolver',
        {
          alias: {
            '@api': './src/api',
            '@components': './src/components',
            '@constants': './src/constants',
            '@screens': './src/screens',
            '@helpers': './src/helpers',
            '@theme': './src/theme',
            '@appTypes': './src/appTypes',
            '@contexts': './src/contexts',
            '@hooks': './src/hooks',
            '@models': './src/models',
            '@mocks': './src/__mocks__',
            '@navigation': './src/navigation',
            '@utils': './src/utils'
          },
          extensions: ['.ts', '.tsx']
        }
      ],
      [
        'react-native-reanimated/plugin',
        {
          relativeSourceLocation: true
        }
      ]
    ]
  };
};
