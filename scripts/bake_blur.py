from PIL import Image, ImageFilter

DIR = "/Users/siddharth/bricx-website/public/testimonials"
DISPLAY_W = 443
# (css radius, fraction-from-bottom fully-blurred, fraction where blur is gone)
TIERS = [
    (2, 0.15, 0.42),
    (6, 0.06, 0.25),
    (16, 0.0, 0.12),
]


def ramp_mask(w, h, full, gone):
    # build a 1-px-wide vertical gradient then stretch to full width (fast)
    col = []
    for y in range(h):
        pos = (h - 1 - y) / (h - 1)  # 1 at top, 0 at bottom
        if pos <= full:
            a = 255
        elif pos >= gone:
            a = 0
        else:
            a = int(round(255 * (1 - (pos - full) / (gone - full))))
        col.append(a)
    strip = Image.new("L", (1, h))
    strip.putdata(col)
    return strip.resize((w, h))


def bake(src_name, out_name):
    base = Image.open(f"{DIR}/{src_name}").convert("RGB")
    w, h = base.size
    scale = w / DISPLAY_W
    result = base.copy()
    sigmas = []
    for css, full, gone in TIERS:
        sigma = max(0.3, css * scale)
        sigmas.append(round(sigma, 1))
        blurred = base.filter(ImageFilter.GaussianBlur(sigma))
        mask = ramp_mask(w, h, full, gone)
        result = Image.composite(blurred, result, mask)  # mask=255 -> blurred
    result.save(f"{DIR}/{out_name}")
    print(f"baked {src_name} -> {out_name}  ({w}x{h}, sigmas {sigmas})")


bake("clip-1c.png", "clip-1c-pb.png")
bake("face-2b.png", "face-2b-pb.png")
