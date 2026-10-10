import { createId } from '@paralleldrive/cuid2'
import { File, Paths } from 'expo-file-system'
import { type ImagePickerAsset } from 'expo-image-picker'
import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native'

import { createApi } from './api'

export async function uploadFile(asset: ImagePickerAsset) {
  const reddit = await createApi()

  return reddit.posts.upload({
    file: {
      name: asset.fileName ?? asset.uri.split('/').pop() ?? 'file',
      type: asset.mimeType ?? '',
      uri: asset.uri,
    },
  })
}

export async function generateVideoThumbnail(
  asset: ImagePickerAsset,
): Promise<ImagePickerAsset> {
  const file = new File(Paths.cache, `${createId()}.jpg`)

  const session = await FFmpegKit.executeWithArguments([
    '-y',
    '-ss',
    '0',
    '-i',
    asset.uri,
    '-frames:v',
    '1',
    '-q:v',
    '2',
    file.uri,
  ])

  const returnCode = await session.getReturnCode()

  if (!ReturnCode.isSuccess(returnCode)) {
    throw new Error('Unable to generate video thumbnail')
  }

  return {
    fileName: file.name,
    height: asset.height,
    mimeType: 'image/jpeg',
    type: 'image',
    uri: file.uri,
    width: asset.width,
  }
}
