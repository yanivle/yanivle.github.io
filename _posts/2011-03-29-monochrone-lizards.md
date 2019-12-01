---
layout: post
title:  "Monochrome Lizards"
date:   2011-03-29 01:00:00
excerpt: "An easy combinatorics puzzle"
categories: Puzzle
tags:  Math Puzzles Easy Combinatorics
image:
  feature: chameleon.jpg
  topPosition: -200px
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
There are 3 types of lizards: yellow, green and blue.

If you rub 2 lizards from different colors, they both change color to the third color. So, for example, if you rub a yellow lizard and a blue lizard, you get 2 green lizards.

**Say that you have X yellow lizards, Y green lizards and Z blue lizards. For what values of X, Y and Z can you transform all the lizards to the same color?**

E.g. for X=3, Y=3 and Z=1 it is possible (rub the 3 yellow ones with the 3 green ones and get a total of 7 blue ones).

### Spoiler Alert - Solution Ahead

We can transform all of the lizards to the same color i.f.f. there are two colors with the same number of lizards mod 3.

##### Proof
One direction: the rubbing operation doesn't affect the differences in the number of lizards between any two colors mod 3. Therefore if no 2 colors have the same number of lizards mod 3, they will remain different mod 3 (and in general).

Other direction: we can transfer 3 lizards from one color, C1, (that has at least 3 lizards) to another color, C2 (that has at least 1 lizard). Indeed, simply rub a lizard of color C1 and a lizard of color C2 together, and rub the 2 new lizards of the third color with 2 more lizards of color C1. To complete the proof, assume that *x* (the number of lizards of color C1) equals *y* (the number of lizards of color C2) mod 3. If they are both 0, we are done. If $$x = 0$$ and $$y \neq 0$$ then by rubbing you can decrease *y* by 1, and increase *x* by 1 (note that *y* must be larger than 1, so will remain non zero after this rubbing). $$\blacksquare$$
