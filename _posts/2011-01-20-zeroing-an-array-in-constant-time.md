---
layout: post
title:  "Zeroing an Array in Constant Time"
date:   2011-01-20 01:00:00
excerpt: "A cool and practical riddle"
categories: Algorithms
tags:  Algorithms Puzzles Easy
image:
  feature: zero.jpg
  topPosition: -100px
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
Implement an “integer array” data structure, that supports the following 3 operations:

1. **Init(int n, int k)** – initialize the array to be of size n and with all cells set to the value k.
2. **Get(int i)** – return the value at cell i.
3. **Set(int i, int k)** – set the value of cell i to k.

The catch – all 3 operations should take constant time (not amortized, not probabilistic).

Note – you can assume that malloc or new are constant time, but that the returned memory is filled with (adversarial) random.

Thanks to Nadav Sherman for this riddle!