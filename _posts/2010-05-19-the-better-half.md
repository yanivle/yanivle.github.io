---
layout: post
title: The Better Half
date: 2010-05-19 17:42 -0400
excerpt: "A cute and easy algorithmic riddle"
categories: Puzzle
tags:  Algorithms Puzzles Easy
image:
  feature: halves.jpg
  topPosition: -100px
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: yes
---
You have an array of N bit strings each of length M. You know that there is at least one element that appears more than N/8 times in the array. Using O(M+log(N)) memory and O(NM) time, find such an element.

#### An Easier Version

Well, its actually almost exactly the same, but solve the above riddle in case there is an element that appears more than N/2 times in the array. I managed to find 3 distinct solutions to this easier variation, but only one of which generalizes easily.

Thanks Nemo for giving me this riddle!

## Spoiler Alert - Solution Ahead!

The solution's central idea is that you can discard *any* 8 distinct elements of the array (or 2 distinct elements in the easier version). We therefore keep an auxiliary array S of size 7 of bit strings and integer counts. We reset all the counts to 0. We then iterate through our original array and for each element:
* If it is already in the S array, we increment its count.
* Otherwise, if there is room in the S array (i.e. there is an element with a count of 0), we add it to the S array (and set its count to 1).
* Otherwise, we subtract 1 from all elements in the S array (which is akin to discarding 8 distinct elements).

Here it is in Python:

```python
def better_half(A, N = 8):
  S = [[None, 0] * (N - 1)]
  for x in A:
    for s in S:
      if x == s[0]:
        s[1] += 1
        break
    else:
      for s in S:
        if s[1] == 0:
          s[0] = x
          s[1] = 1
          break
      else:
        for s in S:
          s[1] -= 1
  for s in S:
    if s[1] != 0:
      return s[0]
```