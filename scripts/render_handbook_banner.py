import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

WIDTH = 1376
HEIGHT = 768

MIDNIGHT_SLATE = (16, 20, 32, 255)       # #101420
HYPER_PINK = (255, 51, 136)              # #FF3388
SUNSET_CORAL = (255, 125, 90)            # #FF7D5A
GHOST_WHITE = (248, 250, 252, 255)       # #F8FAFC
MUTED_SLATE = (148, 163, 184, 255)       # #94A3B8

REPO_ROOT = "/Users/nunn/Vibe Coding/agent-starter-kit"
FONTS_DIR = os.path.join(REPO_ROOT, "assets", "fonts")
BEBAS_PATH = os.path.join(FONTS_DIR, "BebasNeue-Regular.ttf")
MONO_PATH = os.path.join(FONTS_DIR, "JetBrainsMono.ttf")
LOGO_PATH = "/Users/nunn/Vibe Coding/jamescantcode/public/assets/logos/jcc_mark_transparent.png"
BG_BASE = os.path.join(REPO_ROOT, "assets", "banner.jpg")

def make_gradient_mask(w, h, start_color, end_color):
    arr = np.zeros((h, w, 4), dtype=np.uint8)
    for y in range(h):
        for x in range(w):
            t = (x / max(1, w - 1) * 0.75 + y / max(1, h - 1) * 0.25)
            t = max(0.0, min(1.0, t))
            r = int(start_color[0] + t * (end_color[0] - start_color[0]))
            g = int(start_color[1] + t * (end_color[1] - start_color[1]))
            b = int(start_color[2] + t * (end_color[2] - start_color[2]))
            arr[y, x] = [r, g, b, 255]
    return Image.fromarray(arr, "RGBA")

def create_hollow_neon_text(text, font, stroke_width=4):
    dummy = Image.new("RGBA", (1, 1))
    d = ImageDraw.Draw(dummy)
    bbox = d.textbbox((0, 0), text, font=font, stroke_width=stroke_width)
    pad = 90
    tw = bbox[2] - bbox[0] + pad * 2
    th = bbox[3] - bbox[1] + pad * 2

    stroke_layer = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(stroke_layer)
    s_draw.text((pad - bbox[0], pad - bbox[1]), text, font=font, fill=(0, 0, 0, 0), stroke_width=stroke_width, stroke_fill=(255, 255, 255, 255))
    
    grad = make_gradient_mask(tw, th, HYPER_PINK, SUNSET_CORAL)
    colored_stroke = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    colored_stroke.paste(grad, (0, 0), stroke_layer)

    glow_wide = colored_stroke.filter(ImageFilter.GaussianBlur(radius=28))
    glow_med = colored_stroke.filter(ImageFilter.GaussianBlur(radius=14))
    glow_core = colored_stroke.filter(ImageFilter.GaussianBlur(radius=4))

    bloom = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    bloom = Image.alpha_composite(bloom, glow_wide)
    bloom = Image.alpha_composite(bloom, glow_med)
    bloom = Image.alpha_composite(bloom, glow_core)
    bloom = Image.alpha_composite(bloom, colored_stroke)

    return bloom, (tw, th), pad

def build_banner():
    # Base canvas
    if os.path.exists(BG_BASE):
        canvas = Image.open(BG_BASE).convert("RGBA").resize((WIDTH, HEIGHT))
        # Dark vignette overlay
        overlay = Image.new("RGBA", (WIDTH, HEIGHT), (11, 14, 23, 200))
        canvas = Image.alpha_composite(canvas, overlay)
    else:
        canvas = Image.new("RGBA", (WIDTH, HEIGHT), MIDNIGHT_SLATE)

    draw = ImageDraw.Draw(canvas)

    # Fonts
    font_badge = ImageFont.truetype(MONO_PATH, 18)
    font_h1 = ImageFont.truetype(BEBAS_PATH, 105)
    font_h2 = ImageFont.truetype(MONO_PATH, 28)
    font_meta = ImageFont.truetype(MONO_PATH, 18)

    # Top Tag Badge
    badge_text = "GRAND FINALE · SPECIAL FLAGSHIP GUIDE"
    draw.text((100, 110), badge_text, font=font_badge, fill=HYPER_PINK)

    # Neon Hollow Headline: THE PRODUCTION HANDBOOK
    neon_img, (nw, nh), pad = create_hollow_neon_text("THE PRODUCTION HANDBOOK", font_h1, stroke_width=4)
    canvas.alpha_composite(neon_img, (100 - pad, 150 - pad))

    # Subheading
    subheading = "The Non-Coder Multi-Agent Playbook (0% Code · 100% Persistence)"
    draw.text((100, 275), subheading, font=font_h2, fill=GHOST_WHITE)

    # Feature Bullets
    bullets = [
        "🔹 01: The Absolute Prerequisite — Crystal-Clear Intent & Prompt Articulation",
        "🔹 02: Syntax is a Legacy Constraint — The Multi-Agent Executive Model",
        "🔹 03: The Headless Xcode Loop — Conquering 4 App Store Rejections in 15 Min",
        "🔹 04: The 1.13B Token Correction Ledger — Eliminating AI Amnesia for Good"
    ]
    y = 350
    for b in bullets:
        draw.text((100, y), b, font=font_meta, fill=MUTED_SLATE)
        y += 48

    # Bottom Meta Bar
    draw.line([(100, 640), (WIDTH - 100, 640)], fill=(255, 51, 136, 80), width=1)
    footer_text = "@JamesCantCode · Live on iOS App Store & Google Play · jamescantco.de"
    draw.text((100, 665), footer_text, font=font_meta, fill=MUTED_SLATE)

    # Paste Logo mark if present
    if os.path.exists(LOGO_PATH):
        try:
            logo = Image.open(LOGO_PATH).convert("RGBA").resize((70, 70))
            canvas.alpha_composite(logo, (WIDTH - 180, 645))
        except Exception as e:
            print("Logo load skipped:", e)

    # Save
    out_path = os.path.join(REPO_ROOT, "assets", "banner_handbook.jpg")
    canvas.convert("RGB").save(out_path, quality=95)
    print(f"✅ Handbook Banner created at: {out_path}")

if __name__ == "__main__":
    build_banner()
