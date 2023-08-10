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
            '@crypto': './crypto',
            '@database': './src/database',
            '@hooks': './src/hooks',
            '@helpers': './src/helpers',
            '@lib': './src/lib',
            '@models': './src/models',
            '@navigation': './src/navigation',
            '@screens': './src/screens',
            '@theme': './src/theme',
            '@utils': './src/utils',
            'crypto': 'react-native-quick-crypto',
            'stream': 'stream-browserify',
            'buffer': '@craftzdog/react-native-buffer'
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
