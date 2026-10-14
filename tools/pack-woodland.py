#!/usr/bin/env python3
"""Pack native atlas pixels verbatim so distant variants share one instance batch.

Pillow is an offline authoring dependency only; the shipped game reads the PNGs.
"""
import json
import sys
from pathlib import Path
from PIL import Image

root = Path(sys.argv[1])
library = json.loads((root / 'library.json').read_text())
plants = library['plants']
size = max(p['atlas']['size'] for p in plants)
width = size * 2
x = y = row_height = 0
for plant in sorted(plants, key=lambda p: -p['atlas']['size']):
    bank = plant['atlas']['size']
    if x + bank > width:
        y += row_height
        x = row_height = 0
    plant['atlas']['origin'] = [x, y]
    x += bank
    row_height = max(row_height, bank)
height = y + row_height
library['atlas'].update(width=width, height=height, columns=2)
for channel in ('colour', 'normal', 'depth'):
    atlas = Image.new('RGBA', (width, height))
    for plant in plants:
        with Image.open(root / plant['id'] / plant['atlas'][channel]) as image:
            if image.size != (plant['atlas']['size'], plant['atlas']['size']):
                raise ValueError('Source PNG dimensions do not match the manifest')
            atlas.paste(image.convert('RGBA'), tuple(plant['atlas']['origin']))
    atlas.save(root / (channel + '.png'))
(root / 'library.json').write_text(json.dumps(library, indent=2) + '\n')
