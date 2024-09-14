---
layout: post
title:  "Fixing a ''Bug'' in Speculative Decoding"
date:   2024-07-27 3:20:00
excerpt: "Speculative Decoding Talk"
categories: AI
tags:  AI Programming Google Computing
image:
  feature: block_verify.png
  topPosition: 0
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: yes
---

**Familiarity with [speculative decoding](https://arxiv.org/abs/2211.17192) is needed for this post. You can find some useful links [here]({% post_url 2023-07-25-speculative-decoding-icml %}).**

When we [published speculative decoding 2 years ago](https://arxiv.org/abs/2211.17192) we had a small "bug".
The algorithm is correct, but it is not optimal (although it is very close).

Indeed consider the simple case where the vocabulary consists of just two symbols, `A` and `B`, and their respective probabilities with the target ($p$) and draft ($q$) models are:

$p(A) = \frac{1}{3}$; $p(B) = \frac{2}{3}$;  $q(A) = \frac{2}{3}$; $q(A) = \frac{1}{3}$

Consider running standard speculative decoding on this, with a block size $\gamma = 2$.
With the notations from the original speculative decoding paper, we have $\alpha = E(min(p, q)) = \frac{1}{3}$ ([Corollary 3.6](https://arxiv.org/abs/2211.17192)), and $E(num\ expected\ tokens) =$ $\frac{1-\alpha^{\gamma+1}}{1-\alpha} =$ $\frac{1-\frac{1}{3^3}}{1-\frac{1}{3}} =$ $$ ([Equation (1)](https://arxiv.org/abs/2211.17192)).

, the expected number of accepted tokens is $\frac{10}{9}$.

After [Ziteng Sun](https://www.zitengsun.com/) made this really cool observation, he, together with Uri Mendlovic, Asaf Aharoni, Ahmad Beirami, Jae Hun Ro, Ananda Theertha Suresh, and myself put together [this paper](https://arxiv.org/abs/2403.10444) which explains how to fix the issue.
We call the technique *Block Verification*, as opposed to the original *Token Verification*. It makes speculative decoding (slightly but consistently) more efficient.

The proofs are a bit involved, but tl;dr - you can get slightly faster inference from speculative decoding by replacing this (the original token verification):

```python
import numpy as np
from random import random, choices

def token_verify(ps, qs, xs):
  qs.append(np.zeros(V := len(qs[0])))
  for n, xi in enumerate(xs + [0]):
    if random() > ps[n][xi] / qs[n][xi]:
      break
  w = np.maximum(0, ps[n] - qs[n])
  return xs[:n] + [choices(range(V), w)]
```

With this (the new block verification):

```python
def block_verify(ps, qs, xs):
  qs.append(np.zeros(V := len(qs[0])))
  s, a, voc = None, 1, range(V)
  for n, xi in enumerate(xs + [0]):
    seqs = [xs[:n] + [t] for t in voc] + [s]
    w = np.maximum(0, ps[n] * a - qs[n])
    s = choices(seqs, np.append(w, 1 - a))
    a = min(1, ps[n][xi] * a / qs[n][xi])
  return s
```

You can find more details in the paper [here](https://arxiv.org/abs/2403.10444)!
