---
layout: post
title:  "Expanding Map"
excerpt: "A cool algorithmic combinatorics puzzle"
categories: Puzzle
tags:  Puzzle Coding
image:
  feature: map.jpg
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: yes
---
Let $$S^{n}$$ be the set of natural numbers from 1 to n:

$$S^{n} = \{1, 2, 3, ..., n\}$$

Let $$T^{n}_{k}$$ be the set of subsets of $$S^{n}$$ of size k:

$$
T^{n}_{k} = \{X \in \mathcal{P}(S^{n}) \mid |X| = k\}\\
$$

Since 
$$|T^{1000}_{400}| = \binom{1000}{400} \lt \binom{1000}{401} = |T^{1000}_{401}|$$
, there exists a function $$f: T^{1000}_{400} \rightarrow T^{1000}_{401}$$ that is an injection. Write a function, e.g. in C or Python, that implements the injection above (the input is represented by a boolean vector of length 1000). Your function should optimize for shortest code length as well as shortest runtime.

Thanks Asaf Aharoni for this super cool puzzle!

## Spoiler Alert - Solution Ahead!

We will solve a slightly more general problem. For any *n*, *k* and *j*, we will define $$S^{n}$$, $$T^{n}_{k}$$, and $$T^{n}_{j}$$ like above. We will code a general function $$f: T^{n}_{k} \rightarrow T^{n}_{j}$$ that will work for any *n*, *k* and *j* such that
$$\binom{n}{k} \lt \binom{n}{j}$$.

Let $$x \in T^{n}_{k}$$ be represented as above (a boolean vector of length *n*). *x* has *k* bits that are on. The function *f* will just flip a prefix of bits in *x* until there are exactly *j* bits that are on. Let *b = j - k*:

```python
def f(x, b):
  i = 0
  while b != 0:
    b += [-1, 1][x[i]]
    x[i] = 1 - x[i]
    i += 1
```

This function has several nice properties: it is obviously short and runs in linear time in the worst case. Actually, with the numbers above (1000, 400, and 401) if the inputs are random elements of $$T^{1000}_{400}$$ then it will touch on average only the first 5 elements of *x*.

Also the decoder function (i.e. the inverse function from the image of *f*) is exactly the same function (with *b = k - j*, instead of *b = j - k*).

A last nice property of this function, is that even in cases where $$\binom{n}{k} \gt \binom{n}{j}$$ (i.e. we can't construct an injection) the function will work on a subset of the inputs (e.g. *x = 111...111000...000*), and in these cases will be properly reversible. On other inputs (e.g. *x = 000...000111...111*) it will be able to tell you that it can't encode that input properly.
