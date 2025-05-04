const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Áp dụng NativeWind
const nativeWindConfig = withNativeWind(config, { input: './global.css' });

// SVG transformer
nativeWindConfig.transformer = {
  ...nativeWindConfig.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};
nativeWindConfig.resolver = {
  ...nativeWindConfig.resolver,
  assetExts: nativeWindConfig.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...nativeWindConfig.resolver.sourceExts, 'svg'],
};

module.exports = nativeWindConfig;