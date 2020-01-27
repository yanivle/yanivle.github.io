---
layout: post
title:  "Uncountable Union"
date:   2007-11-21 01:00:00
excerpt: "A set theory puzzle"
categories: Puzzles
tags:  Math Puzzle Set-Theory
image:
  feature: union.jpg
  topPosition: -500
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
A very interesting riddle for those of you with some basic background in Set Theory.

##### Prove or Disprove the Following Claim:

$$\begin{align*}
& \exists B \subset \mathcal{P}(\mathbb{N}) \text{ s.t. }\\
& |B| = \aleph \text{ and }\\
& B \text{ is completely ordered by the} \subset \text{relation}.\\
\end{align*}$$

##### Notes:
$$\mathbb{N}$$ denotes the set of natural numbers.

$$\aleph$$ denotes the cardinality of the continuum (i.e. $$\aleph = 2^{\aleph_0}$$).

“B is completely ordered by the $$\subset$$ relation” means that for every two elements a, b of B, either a is a subset of b or b is a subset of a.

### Spoiler Alert - Solution Ahead

While it may seem a little counterintuitive the answer is yes - this set exists. It is really hard to construct one directly over the naturals numbers, but the solution is actually really simple:

Take a bijection $$f: \mathbb{Q} \rightarrow \mathbb{N}$$. For each $$x \in \mathbb{R}$$ let $$A_x = \{q \in \mathbb{Q} \mid q < x\}$$. Then let $$B = \{f(A_x) \mid x \in \mathbb{R}\}$$. $$\blacksquare$$
