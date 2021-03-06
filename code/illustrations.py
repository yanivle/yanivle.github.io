from PIL import Image, ImageDraw, ImageColor, ImageFont
from dataclasses import dataclass
from typing import Tuple, List
import math
import random
import progressbar
import glob
import numpy

GRAY = (
    128,
    128,
    128,
    128,
)


@dataclass
class Vec:
  x: float = 0.
  y: float = 0.
  z: float = 0.
  w: float = 0.

  def __init__(self, x, y=0, z=0, w=0):
    if type(x) == tuple:
      assert y == z == w == 0
      t = x + (0, 0, 0, 0)
      self.x, self.y, self.z, self.w = t[:4]
    else:
      self.x = x
      self.y = y
      self.z = z
      self.w = w

  def __add__(self, p2: 'Vec'):
    return Vec(self.x + p2.x, self.y + p2.y, self.z + p2.z, self.w + p2.w)

  def __sub__(self, p2: 'Vec'):
    return Vec(self.x - p2.x, self.y - p2.y, self.z - p2.z, self.w - p2.w)

  def __mul__(self, a: float):
    return Vec(self.x * a, self.y * a, self.z * a, self.w * a)

  def __truediv__(self, a: float):
    return Vec(self.x / a, self.y / a, self.z / a, self.w / a)

  def __neg__(self):
    return Vec(-self.x, -self.y, -self.z, -self.w)

  def dot(self, p2: 'Vec'):
    return self.x * p2.x + self.y * p2.y + self.z + p2.z + self.w * p2.w

  def norm2(self):
    return self.dot(self)

  def norm(self):
    return math.sqrt(self.norm2())

  def inorm(self, n=1.0):
    self *= n / self.norm()
    return self

  def tuple2(self):
    return (self.x, self.y)

  def ituple2(self):
    return (int(self.x), int(self.y))

  def tuple3(self):
    return (self.x, self.y, self.z)

  def ituple3(self):
    return (int(self.x), int(self.y), int(self.z))

  def tuple4(self):
    return (self.x, self.y, self.z, self.w)

  def ituple4(self):
    return (int(self.x), int(self.y), int(self.z), int(self.w))

  def perpendicular2(self):
    return Vec(-self.y, self.x)

  def attractToOther(self, other, alpha):
    diff = other - self
    return self + diff * alpha

  def dist2(self, other):
    return (self - other).norm2()

  def dist(self, other):
    return (self - other).norm()

class Grid:
  @dataclass
  class Cell:
    top_left: Vec
    center: Vec

  def __init__(self, image: Image, width: int, height: int):
    self.image = image
    self.width = width
    self.height = height
    self.cell_width = image.width // width
    self.cell_height = image.height // height
    self.cell_size = Vec(self.cell_width, self.cell_height)

  def cell(self, x: int, y: int) -> 'Grid.Cell':
    return Grid.Cell(
        Vec(x * self.cell_width, y * self.cell_height),
        Vec(x * self.cell_width + self.cell_width // 2,
            y * self.cell_height + self.cell_height // 2))

  def vertical_line(self, i, width=1):
    x = i * self.cell_width
    self.line((x, 0), (x, self.image.height), width=width)

  def horizontal_line(self, i, width=1):
    y = i * self.cell_height
    self.line((0, y), (self.image.width, y), width=width)

  def line(self, start, end, width=1):
    draw = ImageDraw.Draw(self.image)
    draw.line((start, end), fill=GRAY, width=width)

  def draw(self):
    for x in range(1, self.width):
      self.vertical_line(x)

    for y in range(1, self.height):
      self.horizontal_line(y)


def polygonFromRelativePoints(p: Vec, rs: List[Vec]):
  res = []
  for r in rs:
    p = p + r
    res.append(p.tuple2())
  return tuple(res)


class PirateShip:
  def __init__(self, pos: Vec, size: Vec):
    self.pos = pos
    self.size = size

  def draw(self, image: Image):
    draw = ImageDraw.Draw(image)
    w = self.size.x
    h = self.size.y
    # deck
    points = polygonFromRelativePoints(self.pos, [
        Vec(-w // 4, h // 4),
        Vec(-w // 4, -h // 4),
        Vec(w, 0),
        Vec(-w // 4, h // 4)
    ])
    draw.polygon(points,
                 fill=ImageColor.getrgb('brown'),
                 outline=ImageColor.getrgb('black'))

    # sail
    points = polygonFromRelativePoints(
        self.pos,
        [Vec(-w // 2, 0),
         Vec(0, -h // 1.5),
         Vec(w, 0),
         Vec(0, h // 2)])
    draw.polygon(points,
                 fill=ImageColor.getrgb('lightblue'),
                 outline=ImageColor.getrgb('black'))


class Circle:
  def __init__(self, pos: Vec, radius: int):
    self.pos = pos
    self.r = radius
    self.r2 = radius * radius

  def dist2(self, other):
    return self.pos.dist2(other.pos)

  def dist(self, other):
    return self.pos.dist(other.pos)

  def draw(self, image: Image, color1: Vec, color2: Vec):
    draw = ImageDraw.Draw(image, mode='RGBA')
    draw.ellipse((self.pos.x - self.r, self.pos.y - self.r,
                  self.pos.x + self.r, self.pos.y + self.r),
                 fill=color1.ituple4(),
                 outline=color2.ituple4())

  def drawShaded(self, image: Image, color1: Vec, color2: Vec):
    for y in range(self.pos.y - self.r, self.pos.y + self.r):
      for x in range(self.pos.x - self.r, self.pos.x + self.r):
        d2 = (self.pos - Vec(x, y)).norm2()
        if d2 < self.r2:
          d = math.sqrt(d2) / self.r
          c = color1 * d + color2 * (1 - d)
          c = Vec(*image.getpixel((x, y))) * 0.2 + c * 0.8
          image.putpixel((x, y), c.ituple4())


def rotate_around_point(p: Vec, angle: float, origin: Vec = Vec(0, 0)):
  x, y = p.x, p.y
  adjusted_x = (x - origin.x)
  adjusted_y = (y - origin.y)
  cos = math.cos(angle)
  sin = math.sin(angle)
  return Vec(origin.x + cos * adjusted_x + sin * adjusted_y,
             origin.y + -sin * adjusted_x + cos * adjusted_y)


class Arrow:
  def __init__(self,
               start: Vec,
               end: Vec,
               width: int = 8,
               arrow_head_size: int = 30,
               color: Vec = Vec(255, 0, 0, 200)):
    self.start = start
    self.end = end
    self.width = width
    self.arrow_head_size = arrow_head_size
    self.color = color

  def contract(self, alpha):
    center = (self.start + self.end) / 2
    self.start = self.start.attractToOther(center, alpha)
    self.end = self.end.attractToOther(center, alpha)

  def draw(self, image: Image):
    draw = ImageDraw.Draw(image, 'RGBA')
    draw.line((self.start.ituple2(), self.end.ituple2()),
              fill=self.color.ituple4(),
              width=self.width)
    d = self.end - self.start
    if self.arrow_head_size:
      e1 = (d.perpendicular2() - d * 2).inorm(self.arrow_head_size) + self.end
      e2 = (-d.perpendicular2() - d * 2).inorm(self.arrow_head_size) + self.end
      draw.line((e1.ituple2(), self.end.ituple2()),
                fill=self.color.ituple4(),
                width=self.width)
      draw.line((e2.ituple2(), self.end.ituple2()),
                fill=self.color.ituple4(),
                width=self.width)


class Label:
  @staticmethod
  def draw(image: Image, txt: str, pos: Vec, fontsize=32):
    font = ImageFont.truetype('/Library/Fonts/Arial.ttf', fontsize)
    draw = ImageDraw.Draw(image)
    w, h = draw.textsize(txt, font)
    draw.text((pos - Vec(w, h) / 2).ituple2(),
              txt,
              font=font,
              fill=(0, 0, 0, 50))

class WheresWaldo:
  def __init__(self, file_filter, waldo_file, black_and_white_mode=True, thumbsize=(30, 30)):
    files = glob.glob(file_filter)
    print(files)
    self.thumbnails = []
    self.files = []
    for f in files:
      im = Image.open(f).resize(thumbsize, resample=Image.LANCZOS)
      if black_and_white_mode:
        if im.mode in ['L', 'LA']:
          im = im.convert('RGBA')
          # if 2000 < im.histogram()[-256]:
          if True:
            if f == waldo_file:
              self.waldo = im
            else:
              self.thumbnails.append(im)
              self.files.append(f)
      else:
        im = im.convert('RGBA')
        if f == waldo_file:
          self.waldo = im
        else:
          self.thumbnails.append(im)
          self.files.append(f)
    print(f'Total {len(self.thumbnails)} images')

  def draw(self, image: Image, width : int, height : int):
    for x in range(width):
      for y in range(height):
        pos = Vec(x * image.width / width, y * image.height / height)
        offset = Vec(random.randint(-20, 20),
                     random.randint(-20, 20))
        pos = (pos + offset).ituple2()
        i = random.choice(range(len(self.thumbnails)))
        thumbnail = self.thumbnails[i]
        # thumbnail = random.choice(self.thumbnails)
        self.pasteAtPos(image, pos, thumbnail)

    waldo_pos = random.randint(100, image.width-100), random.randint(100, image.height-100)
    self.pasteAtPos(image, waldo_pos, self.waldo)
    print(f'Waldo is at {waldo_pos}')

  def pasteAtPos(self, image:Image, pos:Tuple[int, int], thumbnail:Image):
    rotated = thumbnail.rotate(random.randint(0, 360),
                              resample=Image.BICUBIC,
                              fillcolor=(255, 255, 255, 0))
    image.paste(rotated, pos, rotated)


def pawnBoard(filename,
              grid_width,
              grid_height,
              pawn_cells,
              arrows,
              label_cells=False,
              image_size=(1000, 1000),
              draw_separator_line=True,
              label_with_grid=False):
  image = Image.new(mode='RGB', size=image_size, color=(
      255,
      255,
      255,
  ))

  horizontal_line = grid_height // 2

  grid = Grid(image, grid_width, grid_height)
  grid.draw()

  pawn = Image.open('cliparts/pawn.png')
  pawn.thumbnail((grid.cell_size * 0.8).ituple2())

  if draw_separator_line:
    grid.horizontal_line(horizontal_line, width=3)
  for cell in pawn_cells:
    image.paste(pawn,
                (grid.cell(*cell).center - Vec(*pawn.size) / 2).ituple2(),
                pawn)

  for arrow in arrows:
    Arrow(grid.cell(*arrow[0]).center, grid.cell(*arrow[1]).center).draw(image)

  if label_cells:
    center_cell_x = grid_width // 2
    center_cell_y = grid_height // 2
    for x in range(grid_width):
      for y in range(grid_height // 2, grid_height):
        cell = grid.cell(x, y)
        denominator = 2**(abs(x - center_cell_x) + abs(y - center_cell_y))
        if denominator == 1:
          Label.draw(image, '1', cell.center)
        else:
          Label.draw(image, '1', cell.center - Vec(0, 20))
          Label.draw(image, '-', cell.center)
          Label.draw(image, str(denominator), cell.center + Vec(0, 20))

  if label_with_grid:
    center_cell_x = grid_width // 2
    center_cell_y = grid_height // 2
    for x in range(grid_width):
      for y in range(grid_height):
        coord = (x - center_cell_x), (y - center_cell_y)
        cell = grid.cell(x, y)
        Label.draw(image, str(coord), cell.center)

  image.save('../assets/images/posts/pawns/' + filename)
  image.show()


def pawns():
  pawnBoard('far.png', 100, 100, [], [])
  pawnBoard('empty.png', 9, 9, [], [])
  pawnBoard('rules_before.png',
            3,
            4, [(0, 0), (1, 0), (0, 1), (0, 2)], [((0, 0), (2, 0)),
                                                  ((0, 1), (0, 3))],
            draw_separator_line=False,
            image_size=(750, 1000))
  pawnBoard('rules_after.png',
            3,
            4, [(2, 0), (0, 3)], [],
            draw_separator_line=False,
            image_size=(750, 1000))
  pawnBoard('starting_example.png', 9, 9, [(4, 5), (2, 4), (7, 6), (6, 6),
                                           (6, 7), (5, 7)], [])
  pawnBoard('example1_1.png', 9, 9, [(4, 5), (4, 4)], [((4, 5), (4, 3))])
  pawnBoard('example1_2.png', 9, 9, [(4, 3)], [])
  pawnBoard('example2_1.png', 9, 9, [(4, 5), (4, 4), (5, 4), (6, 4)],
            [((4, 5), (4, 3))])
  pawnBoard('example2_2.png', 9, 9, [(4, 3), (5, 4), (6, 4)],
            [((6, 4), (4, 4))])
  pawnBoard('example2_3.png', 9, 9, [(4, 3), (4, 4)], [((4, 4), (4, 2))])
  pawnBoard('example2_4.png', 9, 9, [(4, 2)], [])
  pawnBoard('solution_potential_grid_labels.png',
            9,
            9, [], [],
            label_with_grid=True)
  pawnBoard('solution_potential_labels.png', 9, 9, [], [], True)


def pirates():
  image = Image.new(mode='RGB', size=(1000, 1000), color=(
      255,
      255,
      255,
  ))

  grid = Grid(image, 16, 16)
  grid.draw()

  pirate_ship = Image.open('cliparts/pirate-ship.png')
  pirate_ship = pirate_ship.convert('RGBA')
  pirate_ship.thumbnail((grid.cell_size * 1.8).ituple2())

  p1 = Vec(2, 12)
  d = Vec(6, -4)
  p = p1 - d
  n = 5
  cells = []
  for i in range(n):
    cells.append(p.ituple2())
    p += d
  # print(cells)
  # cells = [(-3, 11), (2, 8), (7, 5), (12, 2), (17, -1)]
  for cell in cells:
    image.paste(pirate_ship,
                (grid.cell(*cell).center - (Vec(*pirate_ship.size) / 2) +
                 Vec(0, -25)).ituple2(), pirate_ship)
    # doing 16 - y to make y-axis grow upwards.
    label = str((cell[0], 16 - cell[1]))
    Label.draw(image, label,
               grid.cell(*cell).center + Vec(0, grid.cell_height * 0.8))

  for i in range(1, len(cells)):
    target = Vec(*cells[i])
    src = Vec(*cells[i - 1])
    if i not in [1, len(cells) - 1]:
      arr = Arrow(grid.cell(*cells[i - 1]).center, grid.cell(*cells[i]).center)
    else:
      arr = Arrow(grid.cell(*cells[i - 1]).center,
                  grid.cell(*cells[i]).center,
                  color=Vec(255, 0, 0, 50))
    arr.contract(0.3)
    arr.draw(image)
    v = target - src
    arrow_center = (grid.cell(*cells[i - 1]).center +
                    grid.cell(*cells[i]).center) / 2
    if i not in [1, len(cells) - 1]:
      # need to reverse the y coordinate to make the y-axis grow up.
      label_text = str((v.ituple2()[0], -v.ituple2()[1]))
      Label.draw(image, label_text, arrow_center + Vec(30, 30))

  compass = Image.open('cliparts/compass.png')
  compass = compass.resize((300, 300), resample=Image.LANCZOS)
  image.paste(compass, (50, 50), compass)

  cannon = Image.open('cliparts/cannon.png')
  cannon.thumbnail((400, 400), resample=Image.LANCZOS)
  # cannon = cannon.rotate(-20,
  #                        resample=Image.BICUBIC,
  #                        fillcolor=(255, 255, 255, 0),
  #                        expand=True)
  image.paste(cannon, (550, 750), cannon)

  image.save('../assets/images/posts/pirates_illustration.png')
  image.show()

def zero_knowledge():
  random.seed(0)
  image = Image.new(mode='RGB', size=(1500, 1500), color=(
      255,
      255,
      255,
  ))

  rt = WheresWaldo('scrapped_cliparts/*.png', 'scrapped_cliparts/pando.png', True, (75, 75))
  rt.draw(image, 30, 30)
  image.save('../assets/images/posts/zkp/blackdo_hidden.png')
  image.show()

  rt = WheresWaldo('scrapped_cliparts/ball/*.png', 'scrapped_cliparts/ball/baldo.png', False, (50, 50))
  rt.draw(image, 100, 100)
  image.save('../assets/images/posts/zkp/baldo_hidden.png')
  image.show()

  rt = WheresWaldo('scrapped_cliparts/cartoon/*.png', 'scrapped_cliparts/cartoon/pando.png', False, (100, 100))
  rt.draw(image, 50, 50)
  image.save('../assets/images/posts/zkp/pando_hidden.png')
  image.show()

  # image = Image.open('../assets/images/posts/zkp/waldo50x50.png')
  rt = WheresWaldo('scrapped_cliparts/cartoon/*.png', 'scrapped_cliparts/cartoon/waldo.png', False)
  rt.draw(image, 75, 75)

  image.save('../assets/images/posts/zkp/waldo50x50.png')
  image.show()

  width, height = (200, 200)
  image.thumbnail((width, height))
  image = image.convert('RGBA')
  draw = ImageDraw.Draw(image)
  draw.rectangle((0, 0, 200, 200), fill=None,
                 outline=(0, 0, 0, 255), width=2)
  base_image = image.transform((width * 4, height * 3), Image.AFFINE,
                          (1, 1, -400 - 200,
                           0, 1, -30 - 200), Image.BICUBIC)

  white_paper_image = Image.new('RGBA', (200, 200), color=(255, 0, 0, 255))
  draw = ImageDraw.Draw(white_paper_image)
  draw.rectangle((0, 0, 200, 200),
                 (255, 255, 255, 255),
                 (0, 0, 0, 255), width=2)
  white_paper_image = white_paper_image.transform((width * 4, height * 3), Image.AFFINE,
                          (0.75, 1, -300,
                           0, 0.95, -30), Image.BICUBIC)

  white_paper_with_hole_image = Image.new('RGBA', (200, 200), color=(255, 0, 0, 255))
  draw = ImageDraw.Draw(white_paper_with_hole_image)
  draw.rectangle((0, 0, 200, 200),
                 (255, 255, 255, 255),
                 (0, 0, 0, 255), width=2)
  draw.ellipse((100, 100, 120, 120),
                fill=(0, 0, 0, 0),
                outline=(0, 0, 0, 255))
  white_paper_with_hole_image_sheared = white_paper_with_hole_image.transform((width * 4, height * 3), Image.AFFINE,
                          (0.75, 1, -300 - 100,
                           0, 0.95, -30 - 100), Image.BICUBIC)

  composed = Image.new(mode='RGBA', size=(750, 500), color=(255, 255, 255, 255))
  composed.paste(base_image, (-100, 0), mask=base_image)
  composed.paste(white_paper_with_hole_image_sheared, (-60, 0), mask=white_paper_with_hole_image_sheared)
  composed.paste(white_paper_image, (-60, 0), mask=white_paper_image)

  Label.draw(composed, 'Top Layer: Large Paper', Vec(600, 100), 14)
  Label.draw(composed, 'Middle Layer: Large Paper w/ Hole', Vec(600, 200), 14)
  Label.draw(composed, 'Bottom Layer: Where\'s Waldo Image', Vec(600, 350), 14)

  composed.save('../assets/images/posts/zkp/waldo_layers.png')
  composed.show()

  revealed_image = Image.new('RGBA', (250, 250), color=(255, 255, 255, 255))
  waldo = Image.open('scrapped_cliparts/cartoon/waldo.png')
  waldo.thumbnail((30, 30))
  revealed_image.paste(waldo, (120, 120), waldo)
  revealed_image.paste(white_paper_with_hole_image, (25, 25), white_paper_with_hole_image)
  revealed_image.show()
  revealed_image.save('../assets/images/posts/zkp/waldo_revealed.png')


class Table:
  left = 300
  top = 100
  right = 700
  bottom = 900


brown = Vec(ImageColor.getrgb('brown'))
black = Vec(0, 0, 0, 255)
yellow = Vec(255, 255, 0, 255)


def table():
  image = Image.new(mode='RGB', size=(1000, 1000), color=(
      255,
      255,
      255,
  ))
  draw = ImageDraw.Draw(image)

  draw.rectangle((Table.left, Table.top, Table.right, Table.bottom),
                 fill=brown.ituple4(),
                 outline=black.ituple4())
  return image


def table_cover():
  image = table()
  coins = []
  r = 10
  for x in range(Table.left + r, Table.right - r, int(2.5 * r)):
    for y in range(Table.top + r, Table.bottom - r, int(2.5 * r)):
      new_coin = Circle(
          Vec(x + random.randint(0, r // 2), y + random.randint(0, int(r))), r)
      coins.append(new_coin)

  for coin in coins:
    coin.draw(image, yellow, black)
  image.save('../assets/images/posts/table_cover_solution1.png')
  image.show()

  image = table()
  for coin in coins:
    coin.r *= 2
    coin.r2 *= 4
    coin.draw(image, yellow, black)
  image.save('../assets/images/posts/table_cover_solution2.png')
  image.show()

  image = table()
  for coin in coins:
    coin.r //= 2
    coin.r2 //= 4
    coin.pos = coin.pos.attractToOther(Vec(Table.left, Table.top), 0.5)
    coin.draw(image, yellow, black)
  image.save('../assets/images/posts/table_cover_solution3.png')
  image.show()


def planar_pairings_board(filename,
                          shoes1,
                          shoes2,
                          pairing,
                          pairing2 = [],
                          image_size=(1000, 1000),
                          shoe_size=(50, 50),
                          width=8,
                          show_shoes=True):
  image = Image.new(mode='RGB', size=image_size, color=(
      255,
      255,
      255,
  ))
  shoe1 = Image.open('cliparts/shoe1.png')
  shoe2 = Image.open('cliparts/shoe2.png')
  shoe1.thumbnail(shoe_size)
  shoe2.thumbnail(shoe_size)

  if show_shoes:
    for coord in shoes1:
      image.paste(shoe1, coord, shoe1)
    for coord in shoes2:
      image.paste(shoe2, coord, shoe2)

  for p in pairing:
    target = Vec(shoes1[p[0]]) + Vec(shoe_size) / 2
    src = Vec(shoes2[p[1]]) + Vec(shoe_size) / 2
    arr = Arrow(src, target, color=Vec(0, 0, 0, 50), arrow_head_size=0, width=width)
    arr.draw(image)

  for p in pairing2:
    target = Vec(shoes1[p[0]]) + Vec(shoe_size) / 2
    src = Vec(shoes2[p[1]]) + Vec(shoe_size) / 2
    arr = Arrow(src, target, color=Vec(255, 0, 0, 50), arrow_head_size=0, width=width)
    arr.draw(image)

  image.save('../assets/images/posts/planar_pairing/' + filename)
  image.show()


def planar_pairings():
  planar_pairings_board('cross.png', [(60,60), (700, 80)], [(800, 800), (180, 750)], [(0, 0,), (1, 1)], image_size=(1000, 1000), shoe_size=(150, 150))
  planar_pairings_board('uncross.png', [(60,60), (700, 80)], [(800, 800), (180, 750)], [(0, 1,), (1, 0)], image_size=(1000, 1000), shoe_size=(150, 150))
  planar_pairings_board('dists.png', [(60,60), (700, 80)], [(800, 800), (180, 750)], [(0, 0,), (1, 1)], [(0, 1,), (1, 0)], image_size=(1000, 1000), shoe_size=(150, 150), show_shoes=False)

  MIN_DIST = 80
  MIN_DIST2 = MIN_DIST * MIN_DIST
  N = 20

  shoes1 = []
  while len(shoes1) < N:
    coord = (random.randint(100, 900), random.randint(100, 900))
    for s in shoes1:
      if Vec(s).dist2(Vec(coord)) < MIN_DIST2:
        break
    else:
      shoes1.append(coord)

  shoes2 = []
  while len(shoes2) < N:
    coord = (random.randint(100, 900), random.randint(100, 900))
    for s in shoes1 + shoes2:
      if Vec(s).dist2(Vec(coord)) < MIN_DIST2:
        break
    else:
      shoes2.append(coord)
  pairing = [(i, i) for i in range(N)]
  planar_pairings_board('random_start.png', shoes1, shoes2, pairing, width=3)

def reverse_and_clean_board(filename,
              white_cells,
              empty_cells,
              image_size=(1000, 1000)):
  image = Image.new(mode='RGB', size=image_size, color=(
      255,
      255,
      255,
  ))

  grid = Grid(image, 3, 3)
  grid.draw()

  for x in range(3):
    for y in range(3):
      c = Circle(grid.cell(x, y).center, grid.cell_height // 2 * 0.8)
      if (x, y) in white_cells:
        c.draw(image, Vec(200, 200, 200, 255), Vec(0, 0, 0, 255))
      elif (x, y) not in empty_cells:
        c.draw(image, Vec(0, 0, 0, 255), Vec(0, 0, 0, 255))

  image.save('../assets/images/posts/reverse_and_clean/' + filename)
  image.show()

def reverse_and_clean():
  reverse_and_clean_board('3x3.png', [(2, 2)], [])
  reverse_and_clean_board('move1.png', [(1,2), (2, 1)], [(2, 2)])
  reverse_and_clean_board('move2.png', [(1,2), (1, 1), (2, 0)], [(2, 2), (2, 1)])

def transparent_polygon(image, points, width=5, fill=(255, 200, 200, 255), outline=(0, 0, 0, 255)):
  image2 = Image.new('RGBA', image.size)
  polygon(image2, points, width, fill, outline)
  image.paste(image2, mask=image2)

def polygon(image, points, width=5, fill=(255, 200, 200, 255), outline=(0, 0, 0, 255)):
  draw = ImageDraw.Draw(image)
  draw.polygon(points, fill=fill, outline=(255, 0, 0, 0))
  pp = points[0]
  for p in points[1:] + [points[0]]:
    draw.line((pp, p), fill=outline, width=width)
    pp = p

def hilbert():
  random.seed(0)
  image = Image.new(mode='RGBA', size=(800, 800), color=(255, 255, 255, 255,))
  polygon(image, [(50, 150), (200, 30), (400, 100), (700, 600), (350, 350), (250, 700), (100, 500)], width=8)
  image.show()
  image.save('../assets/images/posts/hilbert/polygon.png')

  transparent_polygon(image, [(10, 10), (10, 500), (300, 500), (300, 10)], width=2, fill=(200, 200, 255, 64))
  transparent_polygon(image, [(280, 40), (750, 40), (750, 650), (280, 650)], width=2, fill=(200, 200, 255, 64))
  transparent_polygon(image, [(30, 450), (530, 450), (530, 750), (30, 750)], width=2, fill=(200, 200, 255, 64))
  image.show()
  image.save('../assets/images/posts/hilbert/polygon_covering.png')

  image = Image.new(mode='RGBA', size=(800, 800), color=(255, 255, 255, 255,))
  polygon(image, [(50, 600), (700, 600), (450, 100)], width=8)
  image.show()
  image.save('../assets/images/posts/hilbert/triangle.png')

  polygon(image, [(50, 600), (450, 600), (450, 100)], width=8, fill=(200, 255, 200, 255))
  polygon(image, [(450, 100), (450, 600), (700, 600)], width=8, fill=(255, 255, 200, 255))
  image.show()
  image.save('../assets/images/posts/hilbert/right_triangles.png')

  image = Image.new(mode='RGBA', size=(800, 800), color=(255, 255, 255, 255,))
  polygon(image, [(50, 600), (450, 600), (450, 100)], width=8, fill=(200, 255, 200, 255))
  polygon(image, [(250, 350), (450, 350), (450, 100)], width=8, fill=(200, 200, 255, 255))
  image.show()
  image.save('../assets/images/posts/hilbert/right_triangle_half_height.png')

  image = Image.new(mode='RGBA', size=(800, 800), color=(255, 255, 255, 255,))
  polygon(image, [(50, 600), (450, 600), (450, 100)], width=8, fill=(200, 255, 200, 255))
  polygon(image, [(250, 350), (450, 350), (450, 100)], width=8, fill=(200, 200, 255, 255))
  polygon(image, [(50, 350), (250, 350), (50, 600)], width=8, fill=(200, 200, 255, 255))
  image.show()
  image.save('../assets/images/posts/hilbert/triangle_rectangle.png')

def higher_dimensions():
  width = 800
  height = 100
  image = Image.new(mode='RGBA', size=(width, height), color=(255, 255, 255, 255,))
  draw = ImageDraw.Draw(image)

  num_squares = 8
  grid_width = width / num_squares
  square_side = int(grid_width * 0.75)
  for x in range(num_squares):
    center = Vec(grid_width // 2 + grid_width * x, height // 2)
    points = polygonFromRelativePoints(
        center,
        [Vec(-square_side // 2, -square_side // 2),
         Vec(square_side, 0),
         Vec(0, square_side),
         Vec(-square_side, 0)])
    draw.polygon(points,
                 fill=ImageColor.getrgb('lightblue'),
                 outline=ImageColor.getrgb('black'))

  image.show()
  image.save('../assets/images/posts/higher_dimensions/cube_slices.png')

if __name__ == '__main__':
  higher_dimensions()
  # hilbert()
  # zero_knowledge()
  # pawns()
  # pirates()
  # table_cover()
  # planar_pairings()
  # reverse_and_clean()