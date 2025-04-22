const { getDefaultConfig } = require("@react-native/metro-config");
const { withNativeWind } = require("nativewind/metro");

let config = getDefaultConfig(__dirname);

// ✅ Áp dụng NativeWind & gán lại
config = withNativeWind(config, { input: "./global.css" });

// ✅ SVG transformer
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...config.resolver.sourceExts, "svg"],
};

module.exports = config;
