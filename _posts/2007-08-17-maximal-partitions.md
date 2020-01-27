---
layout: post
title:  "Maximal Partitions"
date:   2007-08-17 01:00:00
excerpt: "A cute riddle about the density of integers"
categories: Math
tags:  Math Puzzle
image:
  feature: n_over_x_to_the_x.png
  topPosition: -800
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
When considering the extra-credit of the [23 and 2000 riddle]({% post_url 2007-08-13-23-and-2000 %}), I thought of an additional interesting problem.

Let *N* be a positive integer. A partition of *N* into *m* parts (an ***m-partition*** of *N*) is a multiset of *m* positive integers, such that their sum equals *N*. A ***multiset*** is a set which may contain repeated elements.

So if *N* is 5, then the multiset {1, 1, 1, 2} is a 4-partition of N.

Now, for a multiset *A* of numbers, define the ***mul of A***, denoted ***mul(A)***, as the product of all the numbers.

$$mul(A) = \prod_{x \in A} x$$

So mul({1, 1, 1, 2}) = 2.

Now, let *N* be a positive integer. An m-partition *P* of *N* is called a ***maximal partition*** of *N*,  if for all positive integers *k*, and all k-partitions of *N*, $$P_k$$, $$mul(P) >= mul(P_k)$$.

E.g. the 2-partition {2, 3} is a maximal partition of 5 (it's the only one). Note that as the number of partitions is finite there always is at least one maximal partition.

Finally, define ***maxmul(N)*** to be the *mul* of a maximal partition of *N*.

Now, we finally got to the point: ***Given a positive integer N, what is maxmul(N)?***

If you want to think about this one yourself, stop reading now, because the rest of this post discusses the solution. Anyway, try to have at least an initial intuition on the answer before reading on.

### Spoiler Alert - Solution Ahead

I must admit that my initial intuition about this problem was that if *N* is even, then a maximal partition of *N* will be a $$\frac{N}{2}$$-partition of the form {2, 2, ..., 2}. This is wrong.

As it turns out, for all *N* > 1, the maximal partition of *N* depends on the value of *N* modulo 3.

If *N* = 0 (3) then the maximal partition is of the form {3, 3, …, 3}.

If *N* = 1 (3) then the maximal partition is of the form {3, 3, …, 3, 2, 2}.

If *N* = 2 (3) then the maximal partition is of the form {3, 3, …, 3, 2}.

I leave the reader the details of the proof. It is not too complicated using induction. I will now try to explain the reason behind this fact.

Notice a weird fact about the number 3. It is, in some way, the *densest integer*. Why is that so?

As you might have guessed, this is because 3 is the integer closest to $$e$$ (=~2.718).

Lets consider the continuous equivalent of this problem. Say that *N* is a real-number. For each integer m, define an m-partition of *N* as a multiset of *m* positive *real numbers*, whose sum is *N*. Note that now the number of partitions is infinite (for each m > 1, even the number of m-partitions is infinite) and so we are no longer guaranteed the existence of a maximal partition (although it is easy to show that it indeed exists).

Using some basic analytic tools (such as [Lagrange multipliers](https://en.wikipedia.org/wiki/Lagrange_multiplier)) it is easy to show that given m, the partition whose mul is maximal is the partition $$\{\frac{N}{m}, ..., \frac{N}{m}\}$$.

So now we are left with finding an integer *m* such that the expression $$(\frac{N}{m})^m$$ is maximal. Again, lets consider the continuous equivalent of this. For each $$1 < x < \infty$$, define $$f(x) = (\frac{N}{x})^x$$. Using elementary calculus, it is clear that this function has a single maximum for $$x = \frac{N}{e}$$. A graph of the function f(x) is shown here (the purple line indicates $$\frac{N}{e}$$):

<iframe src="https://www.desmos.com/calculator/dvctcyvqwf?embed" width="500px" height="500px" style="border: 1px solid #ccc"></iframe>

Using $$x = \frac{N}{e}$$ gives a partition with a constant chunk size of *e*.

This explains (at least intuitively) the reason for 3 being the densest integer.

### Extra Credit

1. How many partitions does a positive integer N have?
2. How big is the set {mul(P) \| P is a partition of N}?

#### Note

The definitions used in this post were mostly invented by me for the purposes of this post, and are not universally accepted terminology (i.e. do not be alarmed if someone does not understand the meaning of the term maximal partition!).

BTW - I used [Desmos](https://www.desmos.com/calculator) for the graph above - it is truly an amazing tool!
