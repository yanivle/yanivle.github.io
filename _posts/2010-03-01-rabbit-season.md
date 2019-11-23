---
layout: post
title:  "Rabbit Season"
date:   2010-03-01 01:00:00
excerpt: "A cool puzzle"
categories: Puzzle
tags:  Math Puzzle Graphs
image:
  feature: rabbit.jpg
  topPosition: -300px
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

## Spoiler Alert - Solutions!

Let's consider the simple case of a linear graph with 10 cells:

{% include image.html url="/assets/images/posts/linear_10.gv.svg" %}

How can we ever rule out a position? Well, if there is a cell that has only one neighbor where the bunny can be, and we shoot that neighbor, than we can be sure that the bunny will not be in that cell afterwards. For example, consider the cell to the very left. It has only one neighbor (immediately to its right) and if we shoot that neighbor than we can be sure that the bunny won't be in the left most cell on the next turn. Once we ruled out that cell, the cell to its right now only has one neighbor where the bunny can be. We can continue in this fashion and hit the bunny in 16 shots (the red cells denote where we shoot, the white cells denote possible locations for the rabbit):

{% include image.html url="/assets/images/posts/linear_10_solution.gv.svg" %}

The above reasoning also makes it clear that we cannot eliminate the rabbit in a graph that contains cycles, as all cells in the cycle have at least 2 neighbors where the bunny can be at and we can't rule any of them out.

So graphs with cycles don't have a solution, but what about trees? Some trees are trivial, for example Star Graphs like this one:

{% include image.html url="/assets/images/posts/star_8.gv.svg" %}

We just need to shoot the center twice in a row:

{% include image.html url="/assets/images/posts/star_8_solution.gv.svg" %}

What about more complicated trees? Well, it turns out we can solve all trees with 9 or less nodes. For example, can you solve this one (solution right below):

{% include image.html url="/assets/images/posts/random_tree.gv.svg" %}

### Spoiler Alert - Solution for the Tree Above

The reason I know that all trees with up to 9 nodes are solvable is unfortunately not due to some clever reasoning but rather because I wrote a tiny program that enumerates all trees and solves the problem for them (it outputs these diagrams).

Here is the solution for the tree above:

{% include image.html url="/assets/images/posts/random_tree_solution.gv.svg" %}

It turns out though, that we can't solve all the trees. The smallest tree that isn't solvable has 10 nodes. Here it is:

{% include image.html url="/assets/images/posts/unsolvable.gv.svg" %}

The reason this tree can't be solved is because you can't "escape" one of it's legs - you can start ruling out some nodes, but you get stuck later on:

{% include image.html url="/assets/images/posts/unsolvable_best.gv.svg" %}

Can you find a general rule for which trees are solvable?
