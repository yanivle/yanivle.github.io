---
layout: post
title:  "fast_minbpe"
date:   2024-02-23 01:00:00
excerpt: "My late night take on simple, clean, but slightly faster BPE."
categories: AI
tags:  AI Computing Programming Hacking Python Math
image:
  feature: fast_minbpe.png
  topPosition: 0
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: yes
recommended: no
---

Andrej Karpathy's [code](https://github.com/karpathy) and [videos](https://www.youtube.com/@AndrejKarpathy) are so awesome!

I love how concise his code is. His [minGPT repo](https://github.com/karpathy/minGPT) was an important inspiration for me to write my ["The Art of Transformer Programming"]({% post_url 2023-08-04-taotp %}) book (in the first chapter, I included my Transformer implementation in 30 lines of clean python code :)).

Anyway, I just finished watching [his BPE video](https://www.youtube.com/watch?v=zduSFxRajkE) and got inspired again. Karpathy's code is really nice (as always), and [his implementation](https://github.com/karpathy/minbpe) is obviously not meant to be fast, _but_, we should be able to make the code much faster without sacrificing clarity too much. Hopefully, faster code can make experimentation (e.g. with different scores, instead of always taking the most popular pair) easier.

You can find my late night take on a simple, clean, and *fast* BPE implementation [here](https://github.com/yanivle/fast_minbpe).

For his tests, Andrej used a snapshot of the Wikipedia article on Taylor Swift with ~185K chars. On my laptop, training/tokenizing this file with a vocab size of 10K takes:


<table>
<colgroup>
<col width="40%" />
<col width="40%" />
<col width="20%" />
</colgroup>
<thead>
<tr>
<th> </th>
<th style="text-align:left">minbpe</th>
<th style="text-align:left">fast_minbpe</th>
</tr>
</thead>
<tbody>
<tr>
<td markdown="span">Training</td>
<td markdown="span">110.10 secs</td>
<td markdown="span">1.89 secs</td>
</tr>
<tr>
<td markdown="span">Tokenization</td>
<td markdown="span">190.91 secs</td>
<td markdown="span">0.84 secs</td>
</tr>
</tbody>
</table>

So, in this setup, we get 58X faster training.

Training fast_minbpe on the same text but with a GPT-4-sized vocab of 100K tokens takes only slightly longer at 3.11 secs (but results in a single token :)).

As usual, this is a fun puzzle and I recommend trying to solve this yourself!

Below I detail the main ideas behind my implementation. You can find the latest code [here](https://github.com/yanivle/fast_minbpe/blob/main/fast_minbpe.ipynb).

You really should watch [Andrej's video]((https://www.youtube.com/watch?v=zduSFxRajkE)) (or at least make sure you are familiar with the *[byte pair encoding algorithm](https://en.wikipedia.org/wiki/Byte_pair_encoding)*) before reading on.

## Why is minbpe slow?

If we are to perform $N$ merges, and the length of the training text is $L$, Karpathy's original impl does (I think):

```python
for i in range(N):
    calc_stats()        # O(L)
    find_max()          # O(L)
    do_merges()         # O(L)
```
For a total complexity of $O(NL)$ (maybe I'm neglecting some factors).

## Why is fast_minbpe fast?

So fast_minbpe does something like this:

```python
stats = calc_stats()            # O(L)
for i in range(N):
    find_max()                  # O(1)
    do_merges_and_update_stats  # O(Mi + log(L))
```
Where $M_i$ denotes the actual number of merges we perform at the $i$th iteration. Note that $M_1 + M_2 + \dots + M_n \le L - 1$, so the overall complexity of everything (again neglecting logarithmic factors) is $O(L)$!

## Doing the wrong thing

The "right thing" to do here would have been to **profile** Andrej's code and measure which parts take time before attempting to optimze anything. In Python btw, this can be done with a couple of lines and the builtin `cProfile` module. Since I did this just for fun, as a quick late night exercise though, I did *not* do that at all. Instead, I made a quick draft of the above complexity calculations and designed a couple of data structures implementing them. I wish I had run profiling before starting (for one, I would have had more cool numbers to report). In my original implementation I actually kept the cute `find_max()` one-liner with the $O(L)$ complexity, and got a 10X speedup vs minbpe, but it was not until I made the `find_max()` operation constant-time that I got the full improvement factors above. Tl;dr - when optimizing code you should really use a profiler, but, when dealing with large objects, **complexity is never wrong**.

Another very wrong thing that I did is that I basically didn't write any tests... My code produces identical outputs to Karpathy's code (when I forced both to break ties in the same way). Again - this was just a late night fun exercise :)

Ok, let's consider the main data structures I used.

## The Leap

I needed a data structure that can represent an ordered array, supporting the same ops as a basic doubly-linked list in O(1):
 - `append(x)`: appends x to the end.
 - `delete(n)`: removes node n.
 - `start(x)`: returns the first node.
 - `end(x)`: returns the last node.
 - `next(n)`: returns the node following node n.
 - `prev(n)`: returns the node preceding node n.

As well as all of the following operations, also in O(1):
 - `first(x)`: returns the first node *with value x*.
 - `last(x)`: returns the last node *with value x*.
 - `leap(n)`: returns first node after node n *with the same value as n*.
 - `leapback(n)`: returns last node before node n *with the same value as n*.
 - `setvalue(n, x)`: set the value of node n to x (keep its position).

In addition to standard efficient in-order iteration on all elements, a leap
also allows efficient in-order iteration on all elements *with a given value*.

I guess that this data structure must exist, but I haven't heard of it. So I named it - *"Leap"* (although maybe *"Leaped List"* sounds better?).
Either way, if this is a thing and you know its name, please lmk!

The implementation of a leap is straightforward (you can find it [here](https://github.com/yanivle/fast_minbpe/blob/main/leap.py)).

My first implementation of a leap was around 2X *shorter* (by unifying the shared logic for positions and values), but that turned out to also be around 2X *slower*, so I opted for the more verbose version above.

If you ever want to debug a leap, you could use something like this:

```python
def debug_print(leap):
  p = []
  for n in leap:
    s = str(n.val)
    if n is leap.first[n.val]: s += 'F'
    if n is leap.last[n.val]: s += 'L'
    p.append(s)
  return '[' + ', '.join(p) + ']'
```

## HeapyKiYay

I also needed a max-heap that supports increasing/decreasing counts of internal elements. I actually wrote this simple code 3 times: a fast version, a tiny version, and finally the best of all worlds.

### Version 1 - Heapy

Since I needed each element of the heap to be *aware of its own position* (so I could maintain the heap condition when it increases/decreases), my first attempt consisted of writing a less standard *pointer-based* implementation (heaps are almost always implemented in an array). This was the fastest implementation of the three, but also the most convoluted. Here it is:

```python
# A max-heap that supports increasing/decreasing internal elements.
# Might have been nicer to do this with a standard array impl (and have each node hold its own index), or maybe even reuse some of the heapq impl.
# Might also be nice to add a "remove" functionality at some point :)

class Heapy:
    class Node:
        def __init__(self, value=None, p=None, l=None, r=None):
            self.value = value  # A (__lt__ comparable) user supplied value.
            self.p = p  # Parent
            self.l = l  # Left child
            self.r = r  # Right child

        @property
        def leftmost_descendent(self):
            while self.l is not None:
                self = self.l
            return self

    def __init__(self):
        self.root = None
        self.last = None

    def swap_with_parent(self, node: Node):
        # Might be nicer to just implement a swap of 2 arbitrary elements (will also be easier to implement remove).
        # This function is really simple - just move a bunch of pointers around:
        # - Update last and root if needed.
        # - Fix 3 bidirectional pointers from node and node.p. Since we're swapping a child with its parent,
        #   2 pairs are counted twice, so we only need to fix 10 pointers.
        p = node.p
        if self.last is node:
            self.last = p
        if self.root is p:
            self.root = node
        if p.p is not None: # Fix the parent's parent.
            if p.p.l is p:
                p.p.l = node
            else:
                assert p.p.r is p
                p.p.r = node
        if node.l is not None:
            node.l.p = p
        if node.r is not None:
            node.r.p = p
        if node is p.l:
            if p.r is not None:
                p.r.p = node
            node.p, node.l, node.r, p.p, p.l, p.r = p.p, p, p.r, node, node.l, node.r
        else:
            assert node is p.r
            p.l.p = node
            node.p, node.l, node.r, p.p, p.l, p.r = p.p, p.l, p, node, node.l, node.r

    def handle_increase(self, node: Node):  # Propagate node upwards
        while node.p is not None and node.value > node.p.value:
            self.swap_with_parent(node)

    def handle_decrease(self, node: Node):  # Propagate node downwards
        while node.l is not None:  # We have children
            bigger_child = node.r
            if node.r is None or node.r.value < node.l.value:
                bigger_child = node.l
            if node.value > bigger_child.value:
                return
            self.swap_with_parent(bigger_child)

    def insert(self, node: Node):
        assert node.p is None and node.r is None and node.l is None
        if self.root is None:  # Heap is empty
            self.root = self.last = node
            return
        # Now we find out where to insert:
        p = self.last
        while p.p and p is p.p.r:
            p = p.p
        if p.p is not None:
            right_sibling = p.p.r
            if right_sibling is not None:
                p = right_sibling.leftmost_descendent
            else:
                p = p.p
        else:
            p = p.leftmost_descendent

        # We need to insert as a child of p:
        self.last = node
        if p.l is None:
            p.l = node
        else:
            p.r = node
        node.p = p
        self.handle_increase(node)
```

### Version 2 - HeapHeapHooray

Here I decided to optimize for code length. To make this super short, I wanted to reuse the standard implementation from the `heapq` module.
The main idea was to create a custom list object that tells its elements where they are (so I called it a `GPSList`...).

Here's the full implementation:

```python
import heapq

class GPSList(list):
    # A list-like class that tells its elements where they are:
    # >>> l = GPSList(lambda i, x: print(f'{x} is in position {i}'))
    # >>> l.append(3)
    #   3 is in position 0
    # >>> l[0] = 5
    #   5 in in position 0
    # We only support the subset of list operations that are needed for our heap.
    def __init__(self, update_fn):
        super().__init__()
        self.update_fn = update_fn

    def __setitem__(self, i, x):
        super().__setitem__(i, x)
        self.update_fn(i, x)

    def append(self, x):
        super().append(x)
        self.update_fn(len(self) - 1, x)

    # Forbid other methods that can add elements - hope I didn't forget anything :)
    extend = insert = remove = __iadd__ = None

class HeapHeapHooray:
    # A max heap that supports increasing/decreasing internal elements.
    # To make this super short, we're reusing some internal functions from
    # heapq - this might break at some point.
    # Internally, the elements are lists of length 3: [count, value, pos]:
    # - count must be first, so when we return the max element, we'll get the one with max count.
    # - Since value is second, we'll break ties by value.
    # - The values need to be mutable (count and position are updated) so we use a list.
    def __init__(self):
        def setpos(i, x):
            x[-1] = i  # Our elements are lists of length 3 (count, pair, pos).
        self.l = GPSList(setpos)

    @property
    def max(self):
        return self.l[0][1]

    def increase(self, x):
        x[0] += 1
        heapq._siftdown_max(self.l, 0, x[-1])

    def decrease(self, x):
        x[0] -= 1
        heapq._siftup_max(self.l, x[-1])

    def insert(self, val):
        x = [0, val, -1]
        self.l.append(x)
        self.increase(x)
        return x

    def delete(self, x):
        last = self.l.pop()
        if x is last: return
        if self.l:
            self.l[x[-1]] = last
            if x < last:
                heapq._siftdown_max(self.l, 0, last[-1])
            else:
                heapq._siftup_max(self.l, last[-1])

```

This implementation is really short, but has two big downsides:
 - It uses internal functions of the `heapq` module, so might break at some point.
 - It was around 5X slower than my previous version.

### Version 3 - HeapyKiYay

I suspected a big reason for version 2 being slow was the custom list. My final version was based on the previous one, but consisted of getting rid of `GPSList` and the use of the internal `heapq` functions, and instead, write a custom version of an array-based position-aware heap. This version is cleaner imo than the first attempt and only marginally slower, so I'm keeping this one.

You can find my implementation of HeapyKiYay [here](https://github.com/yanivle/fast_minbpe/blob/main/heapykiyay.py).

## Putting it all together

Armed with a `Leap` and our `HeapyKiYay`, the merge code is now super simple:

```python
def merge(pair, new_id, leap, stats=None):
    # Merge occurrences of pair to new_id, and update stats (if provided).
    prev_deleted = None
    for node in [node for node in leap.occurrences(pair[0])]:
        if node is prev_deleted:  # Can happen is pair[0] == pair[1]
            continue
        if node.next is not None and node.next.val == pair[1]:  # Merge!
            prev_deleted = node.next
            leap.delete(node.next)
            leap.set_value(node, new_id)
            if stats is not None:  # Update stats:
                stats.dec(pair)
                if node.prev is not None:
                    stats.dec((node.prev.val, pair[0]))
                    stats.inc((node.prev.val, new_id))
                if node.next is not None:
                    stats.dec((pair[1], node.next.val))
                    stats.inc((new_id, node.next.val))
```

Some notes:
- The actual merge is done in just 2 lines: `leap.delete(node.next)` (deletes the second item of the pair) and `leap.set_value(node, new_id)` (changes the first item to `new_id`).
- We don't iterate on `leap.occurences(pair[0])` directly, but instead make it into a fixed list, as we are modifying elements during iteration.
- We keep a `prev_deleted` pointer to the second item we just deleted. That is useful in cases pair[0] == pair[1] (we already deleted the second item - we don't want to iterate over it).
- The `stats` object contain a standard dict and a HeapyKiYay - the implementations of `inc` and `dec` are super simple.

You can find the my implementation [here](https://github.com/yanivle/fast_minbpe/blob/main/fast_minbpe.ipynb), but, as always, I recommending attempting this yourself first!

**Thanks again Andrej for the fun exercise!**

