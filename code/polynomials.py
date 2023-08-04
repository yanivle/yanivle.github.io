from PIL import Image, ImageDraw
import random

colors = [
    (255, 0, 0, 255), # Red
    (0, 255, 0, 255), # Green
    (0, 0, 255, 255), # Blue
    (255, 255, 0, 255), # Yellow
    (0, 255, 255, 255), # Cyan
    (255, 0, 255, 255), # Magenta
    (255, 165, 0, 255), # Orange
    (128, 0, 128, 255), # Purple
    (255, 192, 203, 255), # Pink
    (0, 128, 0, 255), # Dark Green
    (128, 0, 0, 255), # Maroon
    (0, 128, 128, 255), # Teal
    (128, 128, 0, 255), # Olive
    (70, 130, 180, 255), # Steel Blue
    (240, 230, 140, 255), # Khaki
    (255, 215, 0, 255), # Gold
    (165, 42, 42, 255), # Brown
    (255, 20, 147, 255), # Deep Pink
    (0, 255, 127, 255), # Spring Green
    (210, 105, 30, 255), # Chocolate
    (220, 20, 60, 255), # Crimson
    (0, 191, 255, 255), # Deep Sky Blue
    (85, 107, 47, 255), # Dark Olive Green
    (255, 140, 0, 255), # Dark Orange
    (75, 0, 130, 255), # Indigo
    (255, 105, 180, 255), # Hot Pink
    (107, 142, 35, 255), # Olive Drab
    (0, 0, 139, 255), # Dark Blue
    (255, 69, 0, 255), # Orange Red
    (188, 143, 143, 255), # Rosy Brown
    (176, 224, 230, 255), # Powder Blue
    (147, 112, 219, 255), # Medium Purple
    (152, 251, 152, 255), # Pale Green
    (199, 21, 133, 255), # Medium Violet Red
    (255, 160, 122, 255), # Light Salmon
    (72, 61, 139, 255), # Dark Slate Blue
    (32, 178, 170, 255), # Light Sea Green
    (128, 128, 128, 255), # Gray
    (255, 0, 0, 255), # Red
    (216, 191, 216, 255), # Thistle
    (100, 149, 237, 255), # Cornflower Blue
    (102, 205, 170, 255), # Medium Aquamarine
    (255, 222, 173, 255), # Navajo White
    (189, 183, 107, 255), # Dark Khaki
    (240, 128, 128, 255), # Light Coral
    (233, 150, 122, 255), # Dark Salmon
    (250, 250, 210, 255), # Light Goldenrod
    (144, 238, 144, 255), # Light Green
    (221, 160, 221, 255), # Plum
    (255, 239, 213, 255), # Papaya Whip
    (255, 99, 71, 255), # Tomato
    (173, 216, 230, 255) # Light Blue
]

# Define the size
WIDTH = 2000
HEIGHT = 2000

def gradient(size, color1, color2):
    base = Image.new('RGB', size, color1)
    top = Image.new('RGB', size, color2)
    mask = Image.new('L', size)
    mask_data = []

    for y in range(size[1]):
        mask_data.extend([int(255 * (y / size[1]))] * size[0])

    mask.putdata(mask_data)
    return Image.composite(base, top, mask)

# Create a gradient image
img = gradient((WIDTH, HEIGHT), (39, 39, 74), (70, 130, 180))  # Feel free to change size and colors

def polynomial(*roots, c=0):
    def p(x):
        r = 1
        for t in roots:
            r *= (x - t)
        return r + c
    return p

def random_poly():
    deg = random.randint(2, 4)
    return polynomial(*[random.randint(1, 18) for _ in range(deg)], c=random.randint(0, 1))

def draw_transparent_polynomial(f, color, r=5):
    transparent_layer = Image.new('RGBA', img.size)
    px = None
    py = None
    draw = ImageDraw.Draw(transparent_layer)
    for ix in range(WIDTH*20):
        x = ix / 20
        graph_x = 20 * (x / WIDTH) # [0, 20]
        graph_y = f(graph_x)
        y = int((graph_y + 10) * HEIGHT / 20)
        if ix > 0:
            draw.line((px, py, x, y), fill=color, width=r)
        px, py = x, y
    img.paste(transparent_layer, (0, 0), transparent_layer)

# Draw each function

random.seed(42)
for _ in range(3):
    for color in colors:
        print('.', end='', flush=True)
        f = random_poly()
        r, g, b, a = color
        draw_transparent_polynomial(f, (r, g, b, 50))
    print('!')

# Save the image
img.save('../assets/images/hero/polynomials.png')
