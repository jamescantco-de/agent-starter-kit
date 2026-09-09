import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

WIDTH = 1376
HEIGHT = 768

# Brand Colors
MIDNIGHT_SLATE = (16, 20, 32, 255)       # #101420
VOID_CHARCOAL = (11, 14, 23, 255)        # #0B0E17
HYPER_PINK = (255, 51, 136)              # #FF3388
SUNSET_CORAL = (255, 125, 90)            # #FF7D5A
GHOST_WHITE = (248, 250, 252, 255)       # #F8FAFC
MUTED_SLATE = (148, 163, 184, 255)       # #94A3B8

FONTS_DIR = "/Users/nunn/Vibe Coding/agent-starter-kit/assets/fonts"
BEBAS_PATH = os.path.join(FONTS_DIR, "BebasNeue-Regular.ttf")
MONO_PATH = os.path.join(FONTS_DIR, "JetBrainsMono.ttf")
CUTOUT_PATH = "/Users/nunn/Vibe Coding/jamescantcode/assets/cutouts/james_portrait_transparent.png"
LOGO_PATH = "/Users/nunn/Vibe Coding/jamescantcode/public/assets/logos/jcc_mark_transparent.png"

def make_gradient_mask(w, h, start_color, end_color):
    """Creates a 135-degree linear gradient image."""
    arr = np.zeros((h, w, 4), dtype=np.uint8)
    for y in range(h):
        for x in range(w):
            # 135 deg: normalized diagonal factor
            t = (x / max(1, w - 1) * 0.75 + y / max(1, h - 1) * 0.25)
            t = max(0.0, min(1.0, t))
            r = int(start_color[0] + t * (end_color[0] - start_color[0]))
            g = int(start_color[1] + t * (end_color[1] - start_color[1]))
            b = int(start_color[2] + t * (end_color[2] - start_color[2]))
            arr[y, x] = [r, g, b, 255]
    return Image.fromarray(arr, "RGBA")

def create_hollow_neon_text(text, font, stroke_width=4):
    """
    Renders text with hollow interior, gradient stroke,
    and multi-tier neon bloom glow.
    """
    dummy = Image.new("RGBA", (1, 1))
    d = ImageDraw.Draw(dummy)
    bbox = d.textbbox((0, 0), text, font=font, stroke_width=stroke_width)
    pad = 90
    tw = bbox[2] - bbox[0] + pad * 2
    th = bbox[3] - bbox[1] + pad * 2

    # Stroke mask
    stroke_layer = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(stroke_layer)
    s_draw.text((pad - bbox[0], pad - bbox[1]), text, font=font, fill=(0, 0, 0, 0), stroke_width=stroke_width, stroke_fill=(255, 255, 255, 255))
    
    # Gradient stroke
    grad = make_gradient_mask(tw, th, HYPER_PINK, SUNSET_CORAL)
    colored_stroke = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    colored_stroke.paste(grad, (0, 0), stroke_layer)

    # Bloom layers
    glow_wide = colored_stroke.filter(ImageFilter.GaussianBlur(radius=28))
    glow_med = colored_stroke.filter(ImageFilter.GaussianBlur(radius=14))
    glow_core = colored_stroke.filter(ImageFilter.GaussianBlur(radius=4))

    bloom = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    bloom = Image.alpha_composite(bloom, glow_wide)
    bloom = Image.alpha_composite(bloom, glow_med)
    bloom = Image.alpha_composite(bloom, glow_core)
    bloom = Image.alpha_composite(bloom, colored_stroke)

    return bloom, (tw, th), pad

def render_master():
    canvas = Image.new("RGBA", (WIDTH, HEIGHT), MIDNIGHT_SLATE)
    
    # 1. Ambient Lighting & Background
    # Top-left Hyper Pink glow
    pink_glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    pg_draw = ImageDraw.Draw(pink_glow)
    pg_draw.ellipse([-150, -150, 750, 750], fill=(255, 51, 136, 40))
    pink_glow = pink_glow.filter(ImageFilter.GaussianBlur(radius=90))
    canvas = Image.alpha_composite(canvas, pink_glow)

    # Center-right Sunset Coral glow behind portrait
    coral_glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    cg_draw = ImageDraw.Draw(coral_glow)
    cg_draw.ellipse([750, 150, 1650, 950], fill=(255, 125, 90, 32))
    coral_glow = coral_glow.filter(ImageFilter.GaussianBlur(radius=90))
    canvas = Image.alpha_composite(canvas, coral_glow)

    # Subtle Cyber Grid Points
    grid = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(grid)
    for x in range(36, WIDTH, 44):
        for y in range(36, HEIGHT, 44):
            g_draw.point((x, y), fill=(255, 255, 255, 14))
    canvas = Image.alpha_composite(canvas, grid)

    # 2. James Cutout on Right
    james_img = Image.open(CUTOUT_PATH).convert("RGBA")
    j_target_h = 715
    j_w, j_h = james_img.size
    j_target_w = int(j_w * (j_target_h / j_h))
    james_resized = james_img.resize((j_target_w, j_target_h), Image.Resampling.LANCZOS)
    
    j_x = WIDTH - j_target_w + 35
    j_y = HEIGHT - j_target_h + 35

    # Edge rim glow silhouette behind James
    j_glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    jg_draw = ImageDraw.Draw(j_glow)
    jg_draw.ellipse([j_x + 90, j_y + 30, j_x + j_target_w - 40, j_y + 600], fill=(255, 51, 136, 50))
    j_glow = j_glow.filter(ImageFilter.GaussianBlur(radius=65))
    canvas = Image.alpha_composite(canvas, j_glow)

    # Paste James cutout
    canvas.alpha_composite(james_resized, (j_x, j_y))

    # 3. Top Header: JCC Mark Logo + Brand Pill
    header_img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    h_draw = ImageDraw.Draw(header_img)

    # Add JCC Logo mark icon
    logo_sz = 34
    logo_img = Image.open(LOGO_PATH).convert("RGBA").resize((logo_sz, logo_sz), Image.Resampling.LANCZOS)
    
    badge_font = ImageFont.truetype(MONO_PATH, 15)
    badge_text = "JAMES CAN'T CODE  ·  OPEN SOURCE FOUNDATION"
    b_bbox = h_draw.textbbox((0, 0), badge_text, font=badge_font)
    
    pill_x, pill_y = 85, 95
    pill_w = logo_sz + (b_bbox[2] - b_bbox[0]) + 42
    pill_h = 44

    h_draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], radius=pill_h//2, fill=(255, 51, 136, 25), outline=(255, 51, 136, 120), width=1)
    
    # Paste logo mark inside pill
    header_img.paste(logo_img, (pill_x + 8, pill_y + (pill_h - logo_sz)//2), logo_img)
    # Draw pill text
    h_draw.text((pill_x + logo_sz + 18, pill_y + 12), badge_text, font=badge_font, fill=GHOST_WHITE)
    canvas = Image.alpha_composite(canvas, header_img)

    # 4. Main Headline: AGENT STARTER KIT (Hollow Neon)
    title_font = ImageFont.truetype(BEBAS_PATH, 142)
    # Line 1: AGENT
    bloom_agent, (aw, ah), pad1 = create_hollow_neon_text("AGENT", title_font, stroke_width=4)
    canvas.alpha_composite(bloom_agent, (85 - pad1, 152 - pad1))

    # Line 2: STARTER KIT
    bloom_kit, (kw, kh), pad2 = create_hollow_neon_text("STARTER KIT", title_font, stroke_width=4)
    canvas.alpha_composite(bloom_kit, (85 - pad2, 288 - pad2))

    # 5. Glowing Divider Line
    div_img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_draw = ImageDraw.Draw(div_img)
    d_draw.line([(85, 465), (770, 465)], fill=(255, 125, 90, 85), width=1)
    canvas = Image.alpha_composite(canvas, div_img)

    # 6. Tagline: Exact Tokens Burned & Ethos
    tag_font_bold = ImageFont.truetype(MONO_PATH, 24)
    tag_font_sub = ImageFont.truetype(MONO_PATH, 20)
    foot_font = ImageFont.truetype(MONO_PATH, 16)
    
    tag_img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    t_draw = ImageDraw.Draw(tag_img)
    
    # Line 1: Exact tokens burned
    line1 = "18,200,000+ TOKENS BURNED & REFINED"
    t_draw.text((85, 492), line1, font=tag_font_bold, fill=GHOST_WHITE)
    
    # Line 2: The builder formula
    line2 = "0% CODE  ·  100% PERSISTENCE  ·  ZERO FLUFF"
    t_draw.text((85, 536), line2, font=tag_font_sub, fill=SUNSET_CORAL + (255,))

    # Line 3: Core message
    line3 = "Shipping real apps & software with agents and willpower."
    t_draw.text((85, 574), line3, font=tag_font_sub, fill=MUTED_SLATE)

    # Line 4: Clean GitHub URL anchor
    t_draw.text((85, 650), "github.com/jamescantco-de/agent-starter-kit", font=foot_font, fill=(148, 163, 184, 180))

    canvas = Image.alpha_composite(canvas, tag_img)

    # Save to assets/banner.jpg (master GitHub banner)
    out_banner_jpg = "/Users/nunn/Vibe Coding/agent-starter-kit/assets/banner.jpg"
    out_banner_png = "/Users/nunn/Vibe Coding/agent-starter-kit/assets/banner.png"
    canvas.convert("RGB").save(out_banner_jpg, quality=96)
    canvas.save(out_banner_png)
    print(f"Master banner generated successfully: {out_banner_jpg}")

render_master()
