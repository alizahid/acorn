import { type ImagePickerAsset } from 'expo-image-picker'
import { z } from 'zod'

import { reddit } from './api'

export async function uploadFile(asset: ImagePickerAsset) {
  const lease = await prepareUpload(asset)

  const body = new FormData()

  lease.args.fields.forEach((field) => {
    body.append(field.name, field.value)
  })

  // @ts-expect-error -- go away
  body.append('file', {
    name: asset.fileName,
    type: asset.mimeType,
    uri: asset.uri,
  })

  const headers = new Headers()

  const response = await fetch(`https:${lease.args.action}`, {
    body,
    headers,
    method: 'post',
  })

  const xml = await response.text()

  const matches = /<Location>(.*?)<\/Location>/.exec(xml)

  return matches?.[1]
}

async function prepareUpload(asset: ImagePickerAsset) {
  const body = new FormData()

  if (asset.fileName) {
    body.append('filepath', asset.fileName)
  }

  if (asset.mimeType) {
    body.append('mimetype', asset.mimeType)
  }

  const response = await reddit({
    body,
    method: 'post',
    url: '/api/media/asset.json',
  })

  return PrepareSchema.parse(response)
}

const PrepareSchema = z.object({
  args: z.object({
    action: z.string(),
    fields: z.array(
      z.object({
        name: z.string(),
        value: z.string(),
      }),
    ),
  }),
})
