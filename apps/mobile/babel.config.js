module.exports = function config(api) {
  api.cache(true)

  return {
    plugins: [
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
