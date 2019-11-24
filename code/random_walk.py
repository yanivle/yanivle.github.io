import random

def random_walk(mn=-1000, mx=1):
  i = 0
  t = 0
  while i not in [mn, mx]:
    t += 1
    if random.random() < 0.5:
      i += 1
    else:
      i -= 1
  return t

def f(x, j, k):
  bits_to_add = j - k
  i = 0
  while bits_to_add != 0:
    bits_to_add += [-1, 1][x[i]]
    x[i] = 1 - x[i]
    i += 1
  return i

def asafs_algo(n=1000, k=400):
  v = [1]*k + [0]*(n-k)
  random.shuffle(v)
  return f(v, 401, 400)

def E(f, n=1000):
  v = []
  for i in range(n):
    v.append(f())
  return float(sum(v))/len(v)

# for i in range(100):
#   print(E(asafs_algo))

n = 20
k = 8
v = [1]*k + [0]*(n-k)
random.shuffle(v)
print(v)
f(v, 9, 8)
print(v)
