import { type Purchase, verifyPurchaseWithProvider } from 'expo-iap'

export const skus = ['monthly', 'yearly', 'lifetime_pro']

export async function verifyPurchase(purchase: Purchase) {
  if (!purchase.purchaseToken) {
    return false
  }

  const { iapkit } = await verifyPurchaseWithProvider({
    iapkit: {
      apiKey: process.env.EXPO_PUBLIC_OPENIAP_KEY,
      apple: {
        jws: purchase.purchaseToken,
      },
    },
    provider: 'iapkit',
  })

  return Boolean(iapkit?.isValid && iapkit.productId === purchase.productId)
}
