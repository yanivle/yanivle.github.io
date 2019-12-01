---
layout: post
title:  "Il Buono, il Brutto, il Cattivo"
date:   2009-07-05 01:00:00
excerpt: "4 math puzzles"
categories: Puzzle
tags:  Math Puzzle
image:
  feature: good_bad_ugly.jpg
  topPosition: -100px
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
### Il Buono (nice and easy)

Prove that in a subset of size $$n+1$$ of the set $$\{1, 2, ..., 2n\}$$ there are two numbers such that one divides the other.

### Il Cattivo (beautiful and hard)

Prove that in a sequence of $$r\times s+1$$ distinct numbers, there is either a monotonically increasing sub-sequence of length $$r+1$$ or a monotonically decreasing sub-sequence of length $$s+1$$.

### Il Brutto (just easy)

Prove that in a subset of size n+1 of the set $$\{1, 2, ..., 2n\}$$ there are two relatively prime numbers (i.e. numbers whose gcd is 1).

### Il Non Collegato (another easy one)

Prove that a degree 7 polynomial with integer coefficients, that receives the values +1 or -1 on 7 integer points is irreducible over the integers.

Here is some inspirational music to help you solve these riddles:

<iframe width="560" height="315" src="https://www.youtube.com/embed/4aniv65Mw8I?start=6" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Spoiler Alert - Solution Ahead!

### Il Buono Solution

For any $$n \in \mathbb{N}$$ write $$n = 2^{s_n}b_n$$ such that b is odd. Define $$f:\mathbb{N}\rightarrow\mathbb{N}$$ such that
$$f(n) = b_n$$. Now, $$f(\{1, 2, ..., 2n\}) \subset \{1, 3, ..., 2n - 1\}$$, so $$|f(\{1, 2, ..., 2n\})| \le n$$. So f on any subset of size n+1 of the set $$\{1, 2, ..., 2n\}$$, will contain a collision, i.e. x and y s.t. $$f(x) = f(y)$$. This implies that $$b_x = b_y = b$$. Which implies that $$x = 2^{k}b, y = 2^{j}b$$, which finally implies that either x divides y or y divides x. $$\blacksquare$$

### Il Brutto Solution

In a subset of size n+1 of the set $$\{1, 2, ..., 2n\}$$ there must be two consecutive numbers (i.e. numbers whose difference is 1), and those must be relatively prime. $$\blacksquare$$

### Il Non Collegato Solution

Let P be a polynomial as in the question. Assume by contradiction that P factors into $$Q_1$$ and $$Q_2$$ non trivially. That means that $$min(deg(Q_1), deg(Q_2)) \le 3$$. WLOG assume $$deg(Q_1) \le 3$$. So $$Q_1$$ receives the values +1 or -1 on 7 integer points. That means that $$Q_1$$ receives +1 on at least 4 points, or it receives -1 on at least 4 points. WLOG assume it receives +1 on at least 4 points. Than the polynomial $$Q'_1 = Q_1 - 1$$ is equal to 0 on 4 distinct points, in contradiction to $$deg(Q'_1) = deg(Q_1) \le 3$$. $$\blacksquare$$