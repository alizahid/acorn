module.exports = function config(api) {
  api.cache(true)

  return {
    plugins: [
      [
        'react-native-unistyles/plugin',
        {
          root: 'src',
        },
      ],
      [
        'inline-import',
        {
          extensions: ['.sql'],
        },
      ],
    ],
    presets: [
      [
        'babel-preset-expo',
        {
          unstable_transformImportMeta: true,
        },
      ],
    ],
  }
}
