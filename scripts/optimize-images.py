"""Builds lighter AVIF copies of every photo (originals stay untouched as the fallback).

For each photo in src/assets/img (and img/real), writes public/img/<name>-<width>.avif at
640/1080/1600/2400 px wide (only those smaller than the original) plus the original width,
and src/data/imgmeta.json with { name: [width, height, tiny blurred preview] }.
Run: python3 scripts/optimize-images.py   (skips files already built)
"""
import base64, glob, io, json, os, sys
from concurrent.futures import ProcessPoolExecutor
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'img')
META = os.path.join(ROOT, 'src', 'data', 'imgmeta.json')
STEPS = (640, 1080, 1600, 2400)


def widths(w):
    return [s for s in STEPS if s < w * 0.92] + [w]


def build(path):
    name = os.path.basename(path)[:-4]
    im = Image.open(path).convert('RGB')
    W, H = im.size
    for w in widths(W):
        dst = os.path.join(OUT, f'{name}-{w}.avif')
        if os.path.exists(dst):
            continue
        frame = im if w == W else im.resize((w, round(H * w / W)), Image.LANCZOS)
        # the full-size copy is kept at a near-transparent quality; smaller ones are already downscaled
        frame.save(dst + '.tmp', 'AVIF', quality=82 if w == W else 78, speed=5)
        os.replace(dst + '.tmp', dst)
    tiny = im.resize((20, max(1, round(H * 20 / W))), Image.LANCZOS)
    b = io.BytesIO()
    tiny.save(b, 'WEBP', quality=45)
    return name, [W, H, 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()]


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    files = [f for f in glob.glob(os.path.join(ROOT, 'src/assets/img/**/*.jpg'), recursive=True) if not f.endswith('.sm.jpg')]
    with ProcessPoolExecutor() as ex:
        meta = dict(sorted(ex.map(build, files)))
    with open(META, 'w') as f:
        json.dump(meta, f, separators=(',', ':'))
    print(len(meta), 'photos')
