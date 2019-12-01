---
layout: post
title:  "Differing Neighbors"
date:   2011-01-12 01:00:00
excerpt: "An easy combinatorics puzzle"
categories: Algorithms
tags:  Algorithms Puzzles Easy
image:
  feature: neighbors.jpg
  topPosition: -300px
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: yes
---
#### Algorithm A

Given an array of N integers, sort the array, and find the 2 consecutive numbers in the sorted array with the maximum difference.
Example - on input [1,7,3,2] output 4 (the sorted array is [1,2,3,7], and the maximum difference is 7-3=4).

Algorithm A runs in O(NlogN) time.

Implement an algorithm identical in function to algorithm A, that runs in O(N) time.

Thanks to Yossi Richter for this riddle!

## Spoiler Alert - Solution Ahead

We first find the minimum and maximum of the array. We then allocate another array, call it B, of size N + 2. We let each cell in B contain two integers. Let $$s = \frac{max(A) - min(A)}{N + 2}$$. We pseudo-sort the elements of the original array into array B, such that the first bucket of B represents the integers \[min(A), s\), the second bucket represents \[s, 2s\), ..., the bucket before last represents \[max(A) - s, max(A)\), and the last bucket represents \[max(A), max(A) + s\). We only keep the minimum and the maximum in each bucket (hence the 2 integers in each cell of B). Now, we are splitting N numbers between N + 2 cells, so there must be at least one empty cell. We know that the first and last cells are not empty (as they respectively contain the minimum and maximum elements of the original array), so that means that there are 2 consecutive elements with a distance of at least s. That means that the 2 consecutive elements with maximum distance are the maximum and minimum elements in two cells of B such that all cells between them are empty. $$\blacksquare$$

In python:

```python
from dataclasses import dataclass

@dataclass
class Bucket:
  min : int = None
  max : int = None

  def add(self, x : int):
    if not self.min or x < self.min:
      self.min = x
    if not self.max or x > self.max:
      self.max = x

  def empty(self):
    return self.min == self.max == None

def max_diff_neighbors(A):
  N = len(A)
  mn, mx = min(A), max(A)
  tot = mx - mn
  B = [Bucket() for i in range(N + 2)]
  for x in A:
    bucket = (x - mn) * (N + 1) // tot
    B[bucket].add(x)
  max_diff = 0
  cur = B[0].max
  for i in range(1, N+2):
    if B[i].empty(): continue
    diff = B[i].min - cur
    if diff > max_diff: max_diff = diff
    cur = B[i].max
  return max_diff
```