import random

def x2(x): return 2 * x
def plus1(x): return x + 1

class OddException(Exception):
    ...

def d2(x):
    if x & 1: raise OddException()
    return x // 2
def minus1(x): return x - 1

rev = {
    x2: d2,
    plus1: minus1
}

names = {
    x2: '×2',
    plus1: '+1',
}

def gen_eq():
    while True:
        try:
            n_ops = random.randint(1, 4)
            ops = []
            possible_options = [x2, plus1]
            for op in range(n_ops):
                random.shuffle(possible_options)
                ops.append((possible_options[0], possible_options[1]))
            path1 = [random.randint(2, 999)]
            for op1, op2 in ops:
                path1.append(op1(path1[-1]))
            path2 = [path1[-1]]
            for op1, op2 in reversed(ops):
                path2.append(rev[op2](path2[-1]))
            path2 = list(reversed(path2))
            return path1, path2, [names[f[0]] for f in ops], [names[f[1]] for f in ops]
        except OddException:
            pass


if __name__ == '__main__':
    for i in range(10):
        print(gen_eq())
