import {
  defaultHTMLElementModels,
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html'

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
