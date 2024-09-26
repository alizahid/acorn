const config = {
  dependencies: {},
}

// FIXME: once I update Sentry
if (process.env.CHANNEL === 'simulator') {
  config.dependencies['@sentry/react-native'] = {
    platforms: {
      ios: null,
    },
  }
}

module.exports = config
