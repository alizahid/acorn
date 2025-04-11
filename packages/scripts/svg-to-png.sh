#!/bin/bash

INPUT_DIR="../../apps/mobile/src/assets/icons"
OUTPUT_DIR="../../apps/mobile/src/assets/icons"

for svg in "$INPUT_DIR"/*.svg; do
  name=$(basename "$svg" .svg)

  magick -background none -density 512 "$svg" -resize 256x256 -gravity center -extent 256x256 "$OUTPUT_DIR/${name}.png"

  rm "$svg"
done
