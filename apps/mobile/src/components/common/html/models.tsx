import {
  defaultHTMLElementModels,
  HTMLContentModel,
  HTMLElementModel,
} from '@native-html/render'

const spoiler = HTMLElementModel.fromCustomModel({
  contentModel: HTMLContentModel.textual,
  tagName: 'spoiler',
})

const img = defaultHTMLElementModels.img.extend({
  contentModel: HTMLContentModel.mixed,
})

export const models = {
  img,
  spoiler,
}
