#!/usr/bin/env python3
"""Pack native atlas pixels verbatim so distant variants share one instance batch.

Pillow is an offline authoring dependency only; the shipped game reads the PNGs.
"""
import json
import sys
from pathlib import Path
from PIL import Image

root = Path(sys.argv[1])
plants = json.loads((root / 'library.json').read_text())['plants']
size = plants[0]['atlas']['size']
if any(p['atlas']['size'] != size or p['atlas']['tileSize'] != plants[0]['atlas']['tileSize'] or p['atlas']['padding'] != plants[0]['atlas']['padding'] for p in plants):
    raise ValueError('Combined atlases require matching source dimensions')
for channel in ('colour', 'normal', 'depth'):
    atlas = Image.new('RGBA', (size * 4, size * ((len(plants) + 3) // 4)))
    for i, plant in enumerate(plants):
        with Image.open(root / plant['id'] / plant['atlas'][channel]) as image:
            if image.size != (size, size):
                raise ValueError('Source PNG dimensions do not match the manifest')
            atlas.paste(image.convert('RGBA'), (i % 4 * size, i // 4 * size))
    atlas.save(root / (channel + '.png'))
