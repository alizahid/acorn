// biome-ignore lint/style/noExportedImports: go away
import purchases from 'react-native-purchases'

purchases.configure({
  apiKey: process.env.EXPO_PUBLIC_REVENUE_CAT_KEY,
})

export { purchases }
