from fractions import Fraction
from math import floor

n = 5
mat = [[None for x in range(n)] for y in range(n)]
bets = [[None for x in range(n)] for y in range(n)]

for x in range(n):
  mat[x][0] = Fraction(2**x)
  bets[x][0] = Fraction(1)
for y in range(n):
  mat[0][y] = Fraction(1)
  bets[0][y] = Fraction(0)

for x in range(1, n):
  for y in range(1, n):
    a = mat[x][y - 1]
    b = mat[x - 1][y]
    bet = (a - b) / (a + b)
    bets[x][y] = bet
    mat[x][y] = (1 - bet) * a


def frac_mat_to_str_mat(mat):
  res = []
  for y in range(n):
    res.append([])
    for x in range(n):
      int_part = floor(mat[x][y])
      frac_part = mat[x][y] - int_part
      num, denom = frac_part.numerator, frac_part.denominator
      s = '$$'
      if int_part:
        s += f'{int_part} '
      if frac_part:
        s += f'\\frac{{ {num} }}{{ {denom} }}'
      s += '$$'
      res[-1].append(s)
  return res


def str_mat_to_html(mat, bold_first_row=True, bold_first_col=True):
  rows = []
  for i, line in enumerate(mat):
    items = []
    for j, s in enumerate(line):
      if (bold_first_row and i == 0) or (bold_first_col and j == 0):
        items.append(f'<td class="highlight_cell">{s}</td>')
      else:
        items.append(f'<td>{s}</td>')
    row = '\n  '.join(items)
    rows.append(f'<tr>{row}</tr>')
  table = '\n'.join(rows)
  return f'<table>{table}</table>'


def bookie_html_table(mat, bets):
  rows = []
  for i, line in enumerate(mat):
    items = []
    for j, s in enumerate(line):
      bet = bets[i][j]
      items.append(f'<td>$$W_{{ {i} , {j} }} = {s}' + '\\\\' +
                   f'k_{{ {i}, {j} }} = {bet}$$</td>')
    row = '\n  '.join(items)
    rows.append(f'<tr>{row}</tr>')
  table = '\n'.join(rows)
  return f'<table>{table}</table>'


def print_str_mat(mat):
  for line in mat:
    for s in line:
      print('%-15s' % s, end=', ')
    print()


# print(bookie_html_table(frac_mat_to_str_mat(mat), frac_mat_to_str_mat(bets)))
print('''
##### W:
''')
print(str_mat_to_html(frac_mat_to_str_mat(mat)))
print('''
##### k:
''')
print(str_mat_to_html(frac_mat_to_str_mat(bets)))
