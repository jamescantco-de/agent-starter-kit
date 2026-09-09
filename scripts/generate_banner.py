import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

WIDTH = 1376
HEIGHT = 768

# 1. Base Canvas - Midnight Slate (#101420)
bg_color = (16, 20, 32, 255)
canvas = Image.new("RGBA", (WIDTH, HEIGHT), bg_color)

# Add subtle dark vignette / ambient depth
vignette = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
v_draw = ImageDraw.Draw(vignette)
# Radial gradient from center
center_x, center_y = WIDTH // 2, HEIGHT // 2
for r in range(WIDTH // 2, 0, -20):
    alpha = int(40 * (1 - r / (WIDTH // 2)))
    v_draw.ellipse(
        [center_x - r, center_y - int(r * 0.6), center_x + r, center_y + int(r * 0.6)],
        fill=(11, 14, 23, alpha)
    )
canvas = Image.alpha_composite(canvas, vignette)

# Fonts
headline_font_path = "/System/Library/Fonts/Supplemental/DIN Alternate Bold.ttf"
mono_font_path = "/System/Library/Fonts/SFNSMono.ttf"
if not os.path.exists(mono_font_path):
    mono_font_path = "/System/Library/Fonts/Menlo.ttc"

headline_size = 110
headline_font = ImageFont.truetype(headline_font_path, headline_size)
tagline_font = ImageFont.truetype(mono_font_path, 28)

# Load James Cutout
cutout_path = "/Users/nunn/Vibe Coding/jamescantcode/assets/cutouts/james_portrait_transparent.png"
james_img = Image.open(cutout_path).convert("RGBA")

# Resize James cutout to fit banner nicely (similar to james_cant_code_banner_16_9.jpg)
# In original banner, height is around 620px, anchored at bottom
j_w, j_h = james_img.size
target_h = 630
target_w = int(j_w * (target_h / j_h))
james_resized = james_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
james_x = (WIDTH - target_w) // 2
james_y = HEIGHT - target_h + 30 # slightly trimmed at bottom

print(f"James size: {target_w}x{target_h} at ({james_x}, {james_y})")

# We want the text:
# Left: "AGENT"
# Right: "STARTER" (or "KIT")
# Or "AGENT STARTER KIT"
# Let's see: Left of James is x: 0 to 450. Right of James is x: 920 to 1376.
