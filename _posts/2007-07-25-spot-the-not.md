---
layout: post
title:  "Spot the Not"
date:   2007-07-25 01:00:00
excerpt: "A topology and real-snalysis math puzzle"
categories: Puzzles
tags:  Math Puzzles Topology Real-Analysis
image:
  feature: odd_one_out.jpg
  topPosition: -100
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
This one is a riddle of my own invention. It gives a good counter-example to something that we tend to take for granted.

The riddle requires some knowledge of [Topology](http://en.wikipedia.org/wiki/Topology) and [Real-Analysis](http://en.wikipedia.org/wiki/Real_analysis).  For those of you lacking it, all the relevant definitions are included at the end (I recommend skimming through them before reading the riddle itself).

#### This seemingly trivial list of claims leads to a contradiction. Can you find the error?

1. If $$A$$ is an open subset of $$\mathbb{R}$$, then $$\mathbb{R}-A$$ is a closed subset.
2. If $$A$$ is a subset of $$\mathbb{R}$$, then $$bdy(A)$$ = $$bdy(\mathbb{R}-A)$$.
3. If $$T$$ is the set of all irrational numbers in the segment $$[0,1]$$, then $$u(A) = 1$$ ($$u$$ is the Lebesgue measure).
4. There exists a closed set $$B$$ contained in the set $$T$$ ($$T$$ as in 3) such that $$u(B) > 0.9$$.
5. If $$A$$ is an open subset of $$\mathbb{R}$$, then $$A$$ is a countable union of open intervals.
6. If $$I$$ is an open interval then $$bdy(I)$$ contains at most 2 points.
7. From 5 and 6 it follows that if $$A$$ is an open subset of $$\mathbb{R}$$, then $$bdy(A)$$ is countable.
8. From 1, 2 and 7 it follows that if $$A$$ is a closed subset of $$\mathbb{R}$$ then $$bdy(A)$$ is countable.
9. From 8 it follows that if $$A$$ is a closed set then $$u(A) = u(A-bdy(A))$$.
10. From 9 it follows that $$u(B-bdy(B)) > 0.9$$ (where $$B$$ is as in 4).
11. Let $$C=B-bdy(B)$$. Then $$C$$ is an open set contained in $$T$$ with $$u(C) > 0.9$$. This is clearly impossible since the only open set contained in $$T$$ is the empty set with Lebesgue measure of 0!

***Can you “Spot the Not”?***

#### Definitions Used by the Riddle

1. *Open set* – a set is called open if each point of the set is an interior point of the set.
2. *Interior point* - a point $$p$$ is called an interior point of a subset $$A$$ of $$\mathbb{R}$$ if there exists $$e>0$$ such that the interval $$(c-e,c+e)$$ is contained in $$A$$.
3. *Closed set* – a set is called closedif the limit of every converging sequence contained in the set is also in the set. It can  be shown that if $$A$$ is an open set in $$\mathbb{R}$$, then $$\mathbb{R}-A$$ is a closed set in $$\mathbb{R}$$, and vise-versa. This is actually very easy - try to prove it!
4. *Measure of an interval* – the measure of an interval $$I=(a,b)$$ is denoted $$m(I)$$ and is equal to $$b-a$$.
5. *Lebesgue outer measure* – let $$A$$ be a subset of $$\mathbb{R}$$. The Lebesgue outer measure of $$A$$ is defined as $$\inf_{}\sum{m(P_i)}$$, s.t. $$Pi$$ are countably many open intervals and $$A$$ is contained in union of the $$Pi$$s. Those of you unfamiliar with the definition of the Lebesgue measure, can replace the occurrences of Lebesgue measure with Lebesgue outer measure in the claims above.
6. *Boundary* – the boundary of a subset $$A$$ of $$\mathbb{R}$$, denoted $$bdy(A)$$ is the set $$\{ x \mid \forall \epsilon>0, \exists a_1 \in A, a_2 in \mathbb{R}-A, \{a_1, a_2\} \subset (x-\epsilon,x+\epsilon) \cap A \}$$.
