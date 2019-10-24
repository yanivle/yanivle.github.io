---
layout: post
title:  "Rabbit Season"
date:   2010-03-01 01:00:00
excerpt: "A cool puzzle"
categories: Puzzle
tags:  Math Puzzle Graphs
image:
  feature: rabbit.jpg
  topPosition: -100px
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
There are 10 cells in a line. A transparent rabbit is in one of them. You have a shotgun, and obviously you want to shoot the rabbit.

If you hit the cell with the rabbit, you kill it (and win). Otherwise, if you shoot an empty cell, the rabbit hears the shot, gets scared of the noise and jumps one cell to the right or one cell to the left. In case the rabbit is in the right-most cell, it can only jump to the left (and similarly, if the rabbit is in the left-most cell, it jumps to the right).

***Can you kill the rabbit? If so, what is the minimum number of shots needed to guarantee a kill?***

### Extra Credit
***Spoiler Warning – read after solving the riddle above!***

Instead of considering the cells in a row, the riddle can be generalized to a graph.

If the graph has cycles, no solution exists (make sure you see why!).

What happens if the graph is a general tree?