import random, math, sys, pygame
from pygame.locals import *
from functools import reduce


def size_of_facet(dim, num_edges):
  num_facets = dim * 2
  faces_per_edge = dim - 1
  edges_per_facet = (num_edges * faces_per_edge) / num_facets
  print("Number of edges: ", num_edges)
  print("Number of facets: ", num_facets)
  print("Facets per edge: ", faces_per_edge)
  print("Edges per facet: ", edges_per_facet)
  return edges_per_facet


def create_ring(ax0, ax1, n=10, dim=4):
  res = []
  for i in range(n):
    vec = [0] * dim
    alpha = 2 * math.pi * i / n
    vec[ax0] = math.cos(alpha)
    vec[ax1] = math.sin(alpha)
    res += [vec]

    vec = [0] * dim
    alpha = 2 * math.pi * i / n
    vec[ax0] = math.cos(alpha) * 1.1
    vec[ax1] = math.sin(alpha) * 1.1
    res += [vec]
  return res


def create_spiral(dim=4):
  res = []
  vec = [-1] * dim
  for idx in range(dim + 1):
    res += [vec]
    vec = vec[:idx] + [1] + vec[idx + 1:]
  return res


def create_rect(dim=4):
  if dim <= 0:
    raise 'ERROR! dim <= 0'
  if dim == 1:
    return [[-1], [1]]
  else:
    res = []
    r1 = create_rect(dim - 1)
    for i in r1:
      res += [i + [-1]]
      res += [i + [1]]
    return res


def to_higher_dim(dim_universe, shape, post=1):
  dim_shape = len(shape[0])
  if dim_universe < dim_shape:
    raise 'ERROR! dim_universe < dim_shape'
  rest_coord = [1] * (dim_universe - dim_shape)
  for i in shape:
    if post:
      i += rest_coord
    else:
      i[:] = rest_coord + i


def create_full_rect(dim=4):
  if dim <= 0:
    raise 'ERROR! dim <= 0'
  if dim == 1:
    return [[-1], [0], [1]]
  else:
    res = []
    r1 = create_full_rect(dim - 1)
    for i in r1:
      res += [i + [-1]]
      res += [i + [0]]
      res += [i + [1]]
    return res


def normalize_rect(rect):
  dim = len(rect[0])
  scale = 1. / math.sqrt(dim)
  for p in rect:
    for i in range(dim):
      p[i] *= scale


def rotate(point, coord_idx1, coord_idx2, beta, epsilon=0.1):
  x = point[coord_idx1]
  y = point[coord_idx2]
  alpha = math.atan2(y, x)
  tg = math.tan(alpha + beta)
  xp = math.sqrt((x**2 + y**2) / (1. + tg**2))
  yp = xp * tg
  dif1 = abs((math.atan2(yp, xp) - (alpha + beta)) % (2 * math.pi) - math.pi)
  dif2 = abs((math.atan2(-yp, -xp) - (alpha + beta)) % (2 * math.pi) - math.pi)
  if dif2 > dif1:
    xp = -xp
    yp = -yp
  point[coord_idx1] = xp
  point[coord_idx2] = yp
  return point


def translate(shape, vec):
  for v in shape:
    for i in range(len(v)):
      v[i] += vec[i]


#constants
WINSIZE = [640, 480]


def to_screen(p, scale=150):
  return p[0] * scale + WINSIZE[0] / 2, p[1] * scale + WINSIZE[1] / 2


def draw_point(screen, p, color, size=2):
  p = to_screen(p)
  pygame.draw.rect(screen, color,
                   (p[0] - size / 2, p[1] - size / 2, size, size))


def draw_point2(screen, p, color, color2, size=2):
  p = to_screen(p)
  pygame.draw.rect(screen, color,
                   (p[0] - size / 2, p[1] - size / 2, size / 2, size))
  pygame.draw.rect(screen, color2, (p[0], p[1] - size / 2, size / 2, size))


def count_dif(p1, p2):
  return math.sqrt(
      reduce(lambda x, y: x + y, [(p1[i] - p2[i])**2 for i in range(len(p1))]))


def gen_line_pairs(rect, dist=1):
  res = []
  for i in range(len(rect)):
    for j in range(i):
      dif = count_dif(rect[i], rect[j])
      if dif == 0:
        raise Exception('Points are too close!')
      elif dif <= dist:
        res.append((i, j))
  return res


color_dir = 0.1


def next_color(c):
  global color_dir
  c[0] += color_dir
  if c[0] >= 196:
    color_dir = -color_dir
    c[0] = 196
  elif c[0] <= 64:
    c[0] = 64
    color_dir = -color_dir


def main(dim=4, shape_name='rect', options=''):
  #initialize and prepare screen
  pygame.init()
  screen = pygame.display.set_mode(WINSIZE)
  pygame.display.set_caption("Yaniv's 4D Renderer")

  shapes = []  # our shapes array

  if shape_name == 'rect':
    print('Shape = rect')
    if 'full' in options:
      rect = create_full_rect(dim)
      line_pairs = gen_line_pairs(rect, 1)
    elif 'reside' in options:
      rect_dim = 3
      if 'facet' in options:
        rect_dim = 2
      rect = create_rect(rect_dim)
      to_higher_dim(dim, rect)
      line_pairs = gen_line_pairs(rect, 2)
    else:
      rect = create_rect(dim)
      line_pairs = gen_line_pairs(rect, 2)
    shapes += [(rect, line_pairs)]

    print('Rect details:')
    facet_size = size_of_facet(dim, len(line_pairs))
  elif shape_name == 'spiral':
    print('Shape = spiral')
    spiral = create_spiral(dim)
    line_pairs = gen_line_pairs(spiral, 2)
    shapes += [(spiral, line_pairs)]
  elif shape_name == 'rings':
    print('Shape = rings')
    ring1 = create_ring(0, 1, 30, dim)
    ring2 = create_ring(1, 2, 30, dim)
    translate(ring1, (0.5, 0, 0, 0))
    translate(ring2, (0, 0.5, 0, 1))
    if 'wide' in options:
      ring1a = create_ring(0, 1, 30, dim)
      ring2a = create_ring(1, 2, 30, dim)
      translate(ring1a, (0.5, 0, 0.1, 0))
      translate(ring2a, (0.1, 0.5, 0, 1))
      ring1 += ring1a
      ring2 += ring2a
    line_pairs1 = gen_line_pairs(ring1, 0.3)
    line_pairs2 = gen_line_pairs(ring2, 0.3)
    shapes += [(ring1, line_pairs1)]
    shapes += [(ring2, line_pairs2)]
  else:
    raise Exception('Unknown shape: "%s".' % shape_name)

  if 'normalize' in options:
    print('Normalize [ON]')
    for shape in shapes:
      normalize_rect(shape[0])

  black = 0, 0, 0
  screen.fill(black)

  done = 0
  rot_count = 0
  coord1 = 0
  coord2 = 1

  use_4d = '4d' in options
  auto_rotate = 'auto' in options

  color_coord = dim - 1

  print
  print('-----')
  print

  #   for shape, line_pairs in shapes:
  #     for i in range(len(shape)):
  #       p = shape[i]
  #       rotate(p, 0, 1, math.pi / 4)
  #   for shape, line_pairs in shapes:
  #     for i in range(len(shape)):
  #       p = shape[i]
  #       rotate(p, 1, 2, 0.95)

  while not done:
    # handle automatic rotation of shapes
    if auto_rotate:
      rot_count += 80
      if rot_count == 80:
        if use_4d:
          coord1 = random.randint(0, dim - 1)
        else:
          coord1 = random.randint(0, 2)
        coord2 = coord1
        while coord2 == coord1:
          if use_4d:
            coord2 = random.randint(0, dim - 1)
          else:
            coord2 = random.randint(0, 2)
        if coord2 < coord1:
          t = coord1
          coord1 = coord2
          coord2 = t
        rot_count = 0

    # draw the shapes
    for shape, line_pairs in shapes:
      screen_shape = [to_screen(x) for x in shape]
      for lp in line_pairs:
        pygame.draw.line(screen, black, screen_shape[lp[0]],
                         screen_shape[lp[1]], 3)
      for i in range(len(shape)):
        p = shape[i]
        rotate(p, coord1, coord2, 0.1)
      screen_shape = [to_screen(x) for x in shape]

      draw_pairs = line_pairs

      for lp in draw_pairs:
        color = [0, 0, 0]
        color[0] = int(
            128 *
            (1 + (shape[lp[0]][color_coord] + shape[lp[1]][color_coord]) / 2))
        if color[0] > 255:
          color[0] = 255
        if color[0] < 0:
          color[0] = 0
        color[1] = color[0]
        color[2] = 128

        pygame.draw.line(screen, color, screen_shape[lp[0]],
                         screen_shape[lp[1]], 3)

    pygame.display.update()
    for e in pygame.event.get():
      if e.type == KEYUP:
        if e.key == K_UP or e.key == K_1:
          # rotate up y-z
          coord1 = 1
          coord2 = 2
          print(1)
        elif e.key == K_DOWN or e.key == K_2:
          # rotate down z-y
          coord1 = 2
          coord2 = 1
          print(2)
        elif e.key == K_LEFT or e.key == K_3:
          # rotate left x-z
          coord1 = 0
          coord2 = 2
          print(3)
        elif e.key == K_RIGHT or e.key == K_4:
          # rotate right z-x
          coord1 = 2
          coord2 = 0
          print(4)
        elif e.key == K_HOME or e.key == K_5:
          # rotate left x-y
          coord1 = 0
          coord2 = 1
          print(5)
        elif e.key == K_PAGEUP or e.key == K_6:
          # rotate right y-x
          coord1 = 1
          coord2 = 0
          print(6)
        elif e.key == K_RETURN or e.key == K_7:
          # rotate x-w
          coord1 = 0
          coord2 = 3
          print(7)
        elif e.key == K_SPACE or e.key == K_8:
          # rotate w-x
          coord1 = 3
          coord2 = 0
          print(8)
        elif e.key == K_END or e.key == K_9:
          # rotate left y-w
          coord1 = 1
          coord2 = 3
          print(9)
        elif e.key == K_PAGEDOWN or e.key == K_0:
          # rotate right w-y
          coord1 = 3
          coord2 = 1
          print(0)
        elif e.key == ord('r'):
          if auto_rotate:
            auto_rotate = False
            print("Automatic Rotation [OFF]")
          else:
            auto_rotate = True
            print("Automatic Rotation [ON]")
          break
        elif e.key == ord('d'):
          if use_4d:
            use_4d = False
            print("4D Rotation [OFF]")
          else:
            use_4d = True
            print("4D Rotation [ON]")
          break
        elif e.key == ord('c'):
          color_coord += 1
          if color_coord == dim:
            color_coord = 0
          print("Color Coord [%d]" % color_coord)
          break
        if e.type == QUIT or (e.type == KEYUP and e.key == K_ESCAPE):
          done = 1
          break


# try:
if True:
  dim = int(sys.argv[1])
  shape_name = sys.argv[2]
  options = sys.argv[3:]
  if len(options) == 0:
    options = ['normalize', 'auto']
  main(dim, shape_name, options)
# except Exception as e:
#   print(e)
#   print('Usage: %s <dim> <shape_name> [options]' % sys.argv[0])
