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

def make_gradient_mask(w, h, start_color, end_color):
    """Creates a horizontal linear gradient image."""
    arr = np.zeros((h, w, 4), dtype=np.uint8)
    for x in range(w):
        t = x / max(1, w - 1)
        r = int(start_color[0] + t * (end_color[0] - start_color[0]))
        g = int(start_color[1] + t * (end_color[1] - start_color[1]))
        b = int(start_color[2] + t * (end_color[2] - start_color[2]))
        arr[:, x] = [r, g, b, 255]
    return Image.fromarray(arr, "RGBA")

def create_hollow_neon_text(text, font, stroke_width=3, tracking=0):
    """
    Renders text with hollow fill, 135-deg / horizontal gradient stroke,
    and multi-layer neon bloom.
    """
    # Calculate text bounding box
    dummy = Image.new("RGBA", (1, 1))
    d = ImageDraw.Draw(dummy)
    bbox = d.textbbox((0, 0), text, font=font, stroke_width=stroke_width)
    tw = bbox[2] - bbox[0] + 80
    th = bbox[3] - bbox[1] + 80

    # 1. Base stroke layer
    stroke_layer = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(stroke_layer)
    # Draw stroke with white mask
    s_draw.text((40 - bbox[0], 40 - bbox[1]), text, font=font, fill=(0, 0, 0, 0), stroke_width=stroke_width, stroke_fill=(255, 255, 255, 255))
    
    # 2. Colorize with gradient
    grad = make_gradient_mask(tw, th, HYPER_PINK, SUNSET_CORAL)
    # Use stroke mask as alpha
    colored_stroke = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    colored_stroke.paste(grad, (0, 0), stroke_layer)

    # 3. Create Neon Bloom layers
    # Wide ambient glow
    glow_wide = colored_stroke.filter(ImageFilter.GaussianBlur(radius=24))
    # Medium glow
    glow_med = colored_stroke.filter(ImageFilter.GaussianBlur(radius=12))
    # Tight core glow
    glow_tight = colored_stroke.filter(ImageFilter.GaussianBlur(radius=4))

    # Combine glow
    bloom = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    bloom = Image.alpha_composite(bloom, glow_wide)
    bloom = Image.alpha_composite(bloom, glow_med)
    bloom = Image.alpha_composite(bloom, glow_tight)
    bloom = Image.alpha_composite(bloom, colored_stroke)

    return bloom, (tw, th)

def render_layout_1():
    """
    Layout 1: Split Hero layout (Text & Tagline Left, James Cutout Right)
    """
    canvas = Image.new("RGBA", (WIDTH, HEIGHT), MIDNIGHT_SLATE)
    
    # Subtle ambient gradient backdrops
    # Pink glow top-left
    pink_glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    pg_draw = ImageDraw.Draw(pink_glow)
    pg_draw.ellipse([-200, -200, 600, 600], fill=(255, 51, 136, 35))
    pink_glow = pink_glow.filter(ImageFilter.GaussianBlur(radius=80))
    canvas = Image.alpha_composite(canvas, pink_glow)

    # Coral glow center-right
    coral_glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    cg_draw = ImageDraw.Draw(coral_glow)
    cg_draw.ellipse([800, 200, 1600, 1000], fill=(255, 125, 90, 25))
    coral_glow = coral_glow.filter(ImageFilter.GaussianBlur(radius=80))
    canvas = Image.alpha_composite(canvas, coral_glow)

    # Subtle tech grid / dots
    grid = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(grid)
    for x in range(40, WIDTH, 48):
        for y in range(40, HEIGHT, 48):
            g_draw.point((x, y), fill=(255, 255, 255, 12))
    canvas = Image.alpha_composite(canvas, grid)

    # Load and place James cutout on Right side
    james_img = Image.open(CUTOUT_PATH).convert("RGBA")
    j_target_h = 710
    j_w, j_h = james_img.size
    j_target_w = int(j_w * (j_target_h / j_h))
    james_resized = james_img.resize((j_target_w, j_target_h), Image.Resampling.LANCZOS)
    
    # James position: right aligned
    j_x = WIDTH - j_target_w + 30
    j_y = HEIGHT - j_target_h + 30

    # Ambient pink/coral rim glow behind James
    j_glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    jg_draw = ImageDraw.Draw(j_glow)
    jg_draw.ellipse([j_x + 80, j_y + 40, j_x + j_target_w - 40, j_y + 600], fill=(255, 51, 136, 45))
    j_glow = j_glow.filter(ImageFilter.GaussianBlur(radius=60))
    canvas = Image.alpha_composite(canvas, j_glow)

    # Add James to canvas
    canvas.alpha_composite(james_resized, (j_x, j_y))

    # Left Side Content
    # 1. Top Brand Pill Badge
    badge_font = ImageFont.truetype(MONO_PATH, 16)
    badge_img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(badge_img)
    badge_text = "✦  JAMES CAN'T CODE  ·  OPEN SOURCE  ✦"
    b_bbox = b_draw.textbbox((0, 0), badge_text, font=badge_font)
    bw = b_bbox[2] - b_bbox[0] + 32
    bh = b_bbox[3] - b_bbox[1] + 16
    bx, by = 90, 110
    # Pill background
    b_draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=bh//2, fill=(255, 51, 136, 25), outline=(255, 51, 136, 120), width=1)
    b_draw.text((bx + 16, by + 7), badge_text, font=badge_font, fill=HYPER_PINK + (255,))
    canvas = Image.alpha_composite(canvas, badge_img)

    # 2. Main Headline: AGENT STARTER KIT in Neon Hollow Bebas Neue
    title_font = ImageFont.truetype(BEBAS_PATH, 136)
    # Line 1: AGENT
    bloom_agent, (aw, ah) = create_hollow_neon_text("AGENT", title_font, stroke_width=4)
    canvas.alpha_composite(bloom_agent, (90 - 40, 160 - 40))

    # Line 2: STARTER KIT
    bloom_kit, (kw, kh) = create_hollow_neon_text("STARTER KIT", title_font, stroke_width=4)
    canvas.alpha_composite(bloom_kit, (90 - 40, 290 - 40))

    # 3. Divider Line
    div_img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_draw = ImageDraw.Draw(div_img)
    d_draw.line([(90, 465), (760, 465)], fill=(255, 125, 90, 80), width=1)
    canvas = Image.alpha_composite(canvas, div_img)

    # 4. Tagline with exact tokens burned
    tag_font_bold = ImageFont.truetype(MONO_PATH, 24)
    tag_font_sub = ImageFont.truetype(MONO_PATH, 20)
    tag_img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    t_draw = ImageDraw.Draw(tag_img)
    
    # Tagline Line 1: Exact tokens burned
    line1 = "18,200,000+ TOKENS BURNED & REFINED"
    t_draw.text((90, 495), line1, font=tag_font_bold, fill=GHOST_WHITE)
    
    # Tagline Line 2: The ethos
    line2 = "0% CODE · 100% PERSISTENCE · ZERO FLUFF"
    t_draw.text((90, 538), line2, font=tag_font_sub, fill=SUNSET_CORAL + (255,))

    # Tagline Line 3: Subtitle
    line3 = "Shipping real software with agents and willpower."
    t_draw.text((90, 575), line3, font=tag_font_sub, fill=MUTED_SLATE)

    # 5. Footer URL & GitHub handle
    footer_font = ImageFont.truetype(MONO_PATH, 16)
    t_draw.text((90, 650), "github.com/jamescantco-de/agent-starter-kit", font=footer_font, fill=(148, 163, 184, 180))

    canvas = Image.alpha_composite(canvas, tag_img)

    out_path = "/Users/nunn/Vibe Coding/agent-starter-kit/assets/banner_layout_split.jpg"
    canvas.convert("RGB").save(out_path, quality=98)
    print(f"Saved: {out_path}")

render_layout_1()

def render_layout_2():
    """
    Layout 2: Centered Layout (similar to james_cant_code_banner_16_9.jpg)
    James centered, AGENT on left, STARTER KIT on right, or AGENT STARTER KIT behind/flanking.
    """
    canvas = Image.new("RGBA", (WIDTH, HEIGHT), MIDNIGHT_SLATE)
    
    # Ambient Glows
    pink_glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    pg_draw = ImageDraw.Draw(pink_glow)
    pg_draw.ellipse([WIDTH//2 - 450, 100, WIDTH//2 + 450, 700], fill=(255, 51, 136, 40))
    pink_glow = pink_glow.filter(ImageFilter.GaussianBlur(radius=100))
    canvas = Image.alpha_composite(canvas, pink_glow)

    # Subtle tech grid dots
    grid = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(grid)
    for x in range(40, WIDTH, 48):
        for y in range(40, HEIGHT, 48):
            g_draw.point((x, y), fill=(255, 255, 255, 12))
    canvas = Image.alpha_composite(canvas, grid)

    # 1. Headline: AGENT (left) and STARTER KIT (right) or AGENT STARTER KIT in upper half
    # Let's test large AGENT STARTER KIT across the upper half behind James
    title_font = ImageFont.truetype(BEBAS_PATH, 115)
    bloom_title, (tw, th) = create_hollow_neon_text("AGENT STARTER KIT", title_font, stroke_width=4)
    canvas.alpha_composite(bloom_title, ((WIDTH - tw) // 2, 80))

    # 2. James Cutout Centered
    james_img = Image.open(CUTOUT_PATH).convert("RGBA")
    j_target_h = 630
    j_w, j_h = james_img.size
    j_target_w = int(j_w * (j_target_h / j_h))
    james_resized = james_img.resize((j_target_w, j_target_h), Image.Resampling.LANCZOS)
    
    j_x = (WIDTH - j_target_w) // 2
    j_y = HEIGHT - j_target_h + 35

    # Pink & Coral rim glow behind James
    rim = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    r_draw = ImageDraw.Draw(rim)
    r_draw.ellipse([j_x + 60, j_y + 40, j_x + j_target_w - 60, j_y + 580], fill=(255, 125, 90, 45))
    rim = rim.filter(ImageFilter.GaussianBlur(radius=50))
    canvas = Image.alpha_composite(canvas, rim)

    canvas.alpha_composite(james_resized, (j_x, j_y))

    # 3. Flanking Taglines on Left and Right of James
    tag_font_bold = ImageFont.truetype(MONO_PATH, 20)
    tag_font_sub = ImageFont.truetype(MONO_PATH, 16)
    t_img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    t_draw = ImageDraw.Draw(t_img)

    # Left Box
    t_draw.text((70, 520), "18,200,000+", font=ImageFont.truetype(BEBAS_PATH, 44), fill=HYPER_PINK + (255,))
    t_draw.text((70, 565), "TOKENS BURNED & REFINED", font=tag_font_bold, fill=GHOST_WHITE)
    t_draw.text((70, 595), "Battle-tested agent workflows", font=tag_font_sub, fill=MUTED_SLATE)

    # Right Box
    t_draw.text((950, 520), "0% CODE · 100% PERSISTENCE", font=ImageFont.truetype(BEBAS_PATH, 44), fill=SUNSET_CORAL + (255,))
    t_draw.text((950, 565), "SHIPPING WITH AGENTS & WILLPOWER", font=tag_font_bold, fill=GHOST_WHITE)
    t_draw.text((950, 595), "Free & Open Source on GitHub", font=tag_font_sub, fill=MUTED_SLATE)

    # Top Brand Pill
    badge_font = ImageFont.truetype(MONO_PATH, 15)
    badge_text = "✦ JAMES CAN'T CODE ✦"
    b_bbox = t_draw.textbbox((0, 0), badge_text, font=badge_font)
    bw = b_bbox[2] - b_bbox[0] + 28
    bh = b_bbox[3] - b_bbox[1] + 12
    bx, by = (WIDTH - bw) // 2, 40
    t_draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=bh//2, fill=(255, 51, 136, 25), outline=(255, 51, 136, 120), width=1)
    t_draw.text((bx + 14, by + 5), badge_text, font=badge_font, fill=HYPER_PINK + (255,))

    canvas = Image.alpha_composite(canvas, t_img)

    out_path = "/Users/nunn/Vibe Coding/agent-starter-kit/assets/banner_layout_centered.jpg"
    canvas.convert("RGB").save(out_path, quality=98)
    print(f"Saved: {out_path}")

render_layout_2()
