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
            '@appTypes': './src/appTypes',
            '@components': './src/components',
            '@constants': './src/constants',
            '@contexts': './src/contexts',
            '@hooks': './src/hooks',
            '@models': './src/models',
            '@mocks': './src/__mocks__',
            '@navigation': './src/navigation',
            '@helpers': './src/helpers',
            '@lib': './src/lib',
            '@models': './src/models',
            '@navigation': './src/navigation',
            '@screens': './src/screens',
            '@theme': './src/theme',
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
