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
            '@navigation': './src/navigation',
            '@components': './src/components',
            '@constants': './src/constants',
            '@screens': './src/screens',
            '@constants': './src/constants',
            '@helpers': './src/helpers',
            '@theme': './src/theme',
            '@appTypes': './src/appTypes',
            '@contexts': './src/contexts',
            '@hooks': './src/hooks',
            '@api': './src/api',
            '@models': './src/models',
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
