---
layout: post
title:  "Zeroing an Array in Constant Time"
date:   2011-01-20 01:00:00
excerpt: "A cool and practical riddle"
categories: Puzzles
tags:  Algorithms Puzzles Easy
image:
  feature: zero.jpg
  topPosition: -100
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: yes
---
Implement an “integer array” data structure, that supports the following 3 operations:

1. **Init(int n, int x)** – initialize the array to be of size n and with all cells set to the value x.
2. **Get(int i)** – return the value at cell i.
3. **Set(int i, int x)** – set the value of cell i to x.

The catch – all 3 operations should take constant time (not amortized, not probabilistic).

Note – you can assume that malloc or new are constant time, but that the returned memory is filled with (adversarial) random.

Thanks to Nadav Sherman for this riddle!

## Spoiler Alert - Solution Below!

The problem with the memory being initialized with adverserial random is that we can't do anything like checking the cells for a checksum, etc. So what can we do instead?

First notice that it is enough to solve a simpler problem where the array only contains bits, is initialized to 0s, and we can only turn bits on. So we'll solve for a version of the data structure with these operations instead:

1. **Init(int n)** – initialize the array of booleans to be of size n and filled with 0s.
2. **Get(int i)** – return the boolean value at cell i.
3. **Set(int i)** – set the value of cell i to 1.

Do you see why given a data structure that implements the above in constant time you can easily solve the original problem? We can use this structure, call it a *TrustArray*, to denote which bits of uninitialized memory in the original array we can trust. Every time we set a value in the original array, we also turn on the trust bit in the TrustArray. When we read values from the original array, we first check if the index is trusted, and if not we return the fixed initialization value.

Let's start by considering a solution where **Init** and **Set** take constant time, but **Get** takes linear time, and then improve it. Let's call this data structure SlowTrustArray:

```c++
struct SlowTrustArray {
  int *trusted_indices;
  int k;

  // Constant time. Memory contents are left uninitialized.
  void Init(int n) {
    trusted_indices = new int[n];
    k = 0;
  }

  // This takes linear time.
  int Get(int i) {
    for (int j = 0; j < k; j++) {
      if (trusted_indices[j] == i) {
        return true;
      }
    }
    return false;
  }

  // This takes constant time.
  void Set(int i) {
    trusted_indices[k++] = i;
  }
}
```

***Final chance to think about this riddle yourself before seeing the full solution!***

So - how can we make Get run in constant time too? Well, what if instead of *searching* the trusted_indices array we knew where to look? But how can we do that? Like this:

```c++
struct TrustArray {
  int *trusted_indices;
  int *trusted_indices_map;
  int k;

  // Constant time. Memory contents are left uninitialized.
  void Init(int n) {
    trusted_indices = new int[n];
    trusted_indices_map = new int[n];
    k = 0;
  }

  // This takes constant time.
  int Get(int i) {
    int idx = trusted_indices_map[i];
    if (idx >= 0 && idx < k) {
      return trusted_indices[idx] == i;
    }
    return false;
  }

  // This takes constant time.
  void Set(int i) {
    trusted_indices_map[i] = k;
    trusted_indices[k++] = i;
  }
}
```

Voila!
