---
layout: post
title:  "Table Cover"
excerpt: "A cool geometric puzzle"
categories: Puzzles
tags:  Puzzle Geometry
image:
  feature: coins-on-table.jpg
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: yes
---
There are 100 identical coins on a rectangular table, such that you cannot add any coin without it touching one of the existing coins. Prove that you can completely cover the table with 400 coins.

Thanks Asaf Aharoni for this puzzle!

## Spoiler Alert - Solution Ahead!

WLOG assume that the radius of the coins is 1. The fact that you cannot add another coin without it touching one of the existing coins means that any point on the table is of distance less than 1 from one of the edges of the coins. That means that if you replace each of the coins by another coin of radius 2, you could cover the table.

Here is an illustration of the table with coins of radius 1:
{% include image.html url="/assets/images/posts/table_cover_solution1.png" %}

And here is the table, completely covered by coins at the same positions, after doubling the radius the coins (so they are all of radius 2):
{% include image.html url="/assets/images/posts/table_cover_solution2.png" %}

Now scale the entire situation, on both axes, by $$\frac{1}{2}$$. You found a full cover of a quarter of the original table with 100 coins, illustrated here (in this diagram the coins again have radius 1):
{% include image.html url="/assets/images/posts/table_cover_solution3.png" %}

Repeat 4 times, for the lower-left, lower-right, top-left, and top-right corners of the table, and you covered the entire table!
