from typing import List
import operator

all_seqs = []


def solve_seq(s: List):
  for i in range(4 * 3 * 2 * 1 * 2 * 2 * 2 * 2):
    t = s.copy()
    while len(t) > 1:
      loc = i % (len(t) - 1)
      i //= (len(t) - 1)
      bit = i % 2
      i //= 2
      op = [operator.add, operator.mul][bit]
      t = t[:loc] + [op(t[loc], t[loc + 1]) % 5] + t[loc + 2:]
    if t[0] == 0:
      return i


for i in range(5**5):
  seq = []
  for j in range(5):
    seq.append(i % 5)
    i //= 5
  all_seqs.append(seq)

for seq in all_seqs:
  s = solve_seq(seq)
  if s is None:
    print(seq)
