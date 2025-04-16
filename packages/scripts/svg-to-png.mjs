#!/usr/bin/env zx

import { $, glob, path } from 'zx'

const directory = '../../apps/mobile/src/assets/icons'

const icons = await glob(`${directory}/*.svg`)

for (const icon of icons) {
  const name = path.basename(icon, '.svg')

  await $`magick -background none -density 512 ${icon} -resize 256x256 -gravity center -extent 256x256 ${directory}/${name}.png`

  await $`rm ${icon}`
}
