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

FONTS_DIR = "/Users/nunn/Vibe Coding/agent-starter-kit/assets/fonts"
BEBAS_PATH = os.path.join(FONTS_DIR, "BebasNeue-Regular.ttf")
MONO_PATH = os.path.join(FONTS_DIR, "JetBrainsMono.ttf")
LOGO_PATH = "/Users/nunn/Vibe Coding/jamescantcode/public/assets/logos/jcc_mark_transparent.png"
CORE_PATH = "/Users/nunn/.gemini/antigravity/brain/1b32c25e-05f9-4d01-9b16-6bf83d4e9120/superskills_power_core_1789332638453.jpg"

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
    canvas = Image.new("RGBA", (WIDTH, HEIGHT), MIDNIGHT_SLATE)
    
    # Ambient glows
    pink_glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    pg_draw = ImageDraw.Draw(pink_glow)
    pg_draw.ellipse([-150, -150, 750, 750], fill=(255, 51, 136, 40))
    pink_glow = pink_glow.filter(ImageFilter.GaussianBlur(radius=90))
    canvas = Image.alpha_composite(canvas, pink_glow)

    coral_glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    cg_draw = ImageDraw.Draw(coral_glow)
    cg_draw.ellipse([700, 100, 1600, 900], fill=(255, 125, 90, 35))
    coral_glow = coral_glow.filter(ImageFilter.GaussianBlur(radius=90))
    canvas = Image.alpha_composite(canvas, coral_glow)

    # Grid Points
    grid = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(grid)
    for x in range(36, WIDTH, 44):
        for y in range(36, HEIGHT, 44):
            g_draw.point((x, y), fill=(255, 255, 255, 14))
    canvas = Image.alpha_composite(canvas, grid)

    # Right Side: Super Skills Core Image
    core_img = Image.open(CORE_PATH).convert("RGBA")
    c_target_h = 720
    c_w, c_h = core_img.size
    c_target_w = int(c_w * (c_target_h / c_h))
    core_resized = core_img.resize((c_target_w, c_target_h), Image.Resampling.LANCZOS)

    # Soft circular/feathered mask
    mask = Image.new("L", (c_target_w, c_target_h), 255)
    m_draw = ImageDraw.Draw(mask)

    # Radial gradient or feathering
    center_x, center_y = c_target_w // 2, c_target_h // 2
    max_radius = min(center_x, center_y) - 10
    
    # We create a smooth radial falloff towards the edges
    for y in range(c_target_h):
        for x in range(c_target_w):
            dx = (x - center_x)
            dy = (y - center_y)
            dist = (dx * dx + dy * dy) ** 0.5
            if dist > max_radius - 120:
                fade = max(0.0, min(1.0, (max_radius - dist) / 120.0))
                # Also blend strongly on the left edge so it doesn't collide with text
                left_factor = min(1.0, x / 140.0)
                mask.putpixel((x, y), int(255 * fade * left_factor))

    core_resized.putalpha(mask)

    c_x = WIDTH - c_target_w + 30
    c_y = (HEIGHT - c_target_h) // 2

    # Back glow behind reactor
    c_glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    cg_sub = ImageDraw.Draw(c_glow)
    cg_sub.ellipse([c_x + 120, c_y + 120, c_x + c_target_w - 120, c_y + c_target_h - 120], fill=(255, 51, 136, 50))
    c_glow = c_glow.filter(ImageFilter.GaussianBlur(radius=80))
    canvas = Image.alpha_composite(canvas, c_glow)

    canvas.alpha_composite(core_resized, (c_x, c_y))

    # Header pill
    header_img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    h_draw = ImageDraw.Draw(header_img)
    logo_sz = 34
    logo_img = Image.open(LOGO_PATH).convert("RGBA").resize((logo_sz, logo_sz), Image.Resampling.LANCZOS)
    badge_font = ImageFont.truetype(MONO_PATH, 15)
    badge_text = "JAMES CAN'T CODE  ·  AGENT ARCHITECTURE SERIES"
    b_bbox = h_draw.textbbox((0, 0), badge_text, font=badge_font)
    pill_x, pill_y = 85, 95
    pill_w = logo_sz + (b_bbox[2] - b_bbox[0]) + 42
    pill_h = 44
    h_draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], radius=pill_h//2, fill=(255, 51, 136, 25), outline=(255, 51, 136, 120), width=1)
    header_img.paste(logo_img, (pill_x + 8, pill_y + (pill_h - logo_sz)//2), logo_img)
    h_draw.text((pill_x + logo_sz + 18, pill_y + 12), badge_text, font=badge_font, fill=GHOST_WHITE)
    canvas = Image.alpha_composite(canvas, header_img)

    # Main Headline
    title_font = ImageFont.truetype(BEBAS_PATH, 142)
    bloom_super, (sw, sh), pad1 = create_hollow_neon_text("SUPERSKILLS", title_font, stroke_width=4)
    canvas.alpha_composite(bloom_super, (85 - pad1, 160 - pad1))

    sub_title_font = ImageFont.truetype(BEBAS_PATH, 70)
    bloom_sub, (subw, subh), pad2 = create_hollow_neon_text("PROGRESSIVE DISCLOSURE", sub_title_font, stroke_width=3)
    canvas.alpha_composite(bloom_sub, (85 - pad2, 330 - pad2))

    # Divider
    div_img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_draw = ImageDraw.Draw(div_img)
    d_draw.line([(85, 465), (750, 465)], fill=(255, 125, 90, 85), width=1)
    canvas = Image.alpha_composite(canvas, div_img)

    # Taglines
    tag_font_bold = ImageFont.truetype(MONO_PATH, 22)
    tag_font_sub = ImageFont.truetype(MONO_PATH, 20)
    foot_font = ImageFont.truetype(MONO_PATH, 16)
    
    tag_img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    t_draw = ImageDraw.Draw(tag_img)
    
    t_draw.text((85, 492), "THE 40-YEAR-OLD HCI RULE THAT SAVES YOUR CONTEXT", font=tag_font_bold, fill=GHOST_WHITE)
    t_draw.text((85, 536), "0% PROMPT BLOAT  ·  100% DEPTH  ·  ZERO LOST IN MIDDLE", font=tag_font_sub, fill=SUNSET_CORAL + (255,))
    t_draw.text((85, 574), "Why 'More Skills' is a trap — and how to delegate outcomes.", font=tag_font_sub, fill=MUTED_SLATE)
    t_draw.text((85, 650), "github.com/jamescantco-de/agent-starter-kit", font=foot_font, fill=(148, 163, 184, 180))
    canvas = Image.alpha_composite(canvas, tag_img)

    out_jpg = "/Users/nunn/Vibe Coding/agent-starter-kit/assets/banner_superskills.jpg"
    canvas.convert("RGB").save(out_jpg, quality=96)
    print("Saved banner to", out_jpg)

build_banner()
