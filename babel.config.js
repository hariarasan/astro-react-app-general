module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Must remain the last plugin in the list.
    'react-native-reanimated/plugin',
  ],
};
