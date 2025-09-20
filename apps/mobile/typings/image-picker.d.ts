module '@baronha/react-native-multiple-image-picker' {
  type MediaPreview = {
    path: string
    thumbnail?: strung
    type: 'image' | 'video'
  }

  type PreviewConfig = {
    onLongPress?(index: number): void
  }

  function openPreview(
    media: Array<MediaPreview>,
    index?: number,
    config?: PreviewConfig,
  ): void
}
