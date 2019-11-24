---
layout: post
title:  "Table Cover"
excerpt: "A cool geometric puzzle"
categories: Puzzle
tags:  Puzzle Geometry
image:
  feature: coins-on-table.jpg
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: yes
---
There are 100 identical coins on a rectangular table, such that you cannot add any coin without it touching one of the existing coins. Prove that you can completely cover the table with 400 coins.

## Spoiler Alert - Solution Ahead!

WLOG assume that the radius of the coins is 1. The fact that you cannot add another coin without it touching one of the existing coins means that any point on the table is of distance less than 1 from one of the edges of the coins. That means that if you replace each of the coins by another coin of radius 2, you could cover the table. Do that. Now scale the entire situation, on both axes, by 2. You found a full cover of a quarter of the original table with 100 coins. Repeat 4 times, for the lower-left, lower-right, top-left, and top-right corners of the table, and you covered the entire table!
