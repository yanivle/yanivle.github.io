---
layout: post
title:  "Reverse & Clean"
date:   2010-04-17 01:00:00
excerpt: "An easy puzzle"
categories: Puzzles
tags:  Puzzles
image:
  feature: checkers.jpg
  topPosition: -500px
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
The game of Reverse & Clean is a one player game, played on an N by M board, filled with Reversi pieces. Each piece has a black side and a white side. The game starts with all pieces showing their black side, except for the piece in the lower right corner, which shows its white side. See the figure for a 3 by 3 example.

{% include image.html url="/assets/images/posts/reverse_and_clean/3x3.png" %}

In each turn of the game, you remove one of the white pieces and flip all of its (remaining) neighbours (the pieces up, down, left and right of it). The figures below demonstrate 2 possible first moves (note that the very first move of the game is always to remove the bottom right piece, which is the only white piece).

The first move:

{% include image.html url="/assets/images/posts/reverse_and_clean/move1.png" %}

A possible second move:

{% include image.html url="/assets/images/posts/reverse_and_clean/move2.png" %}

The goal of the game is to clean the board (i.e. remove all pieces). Note that if the board is 1 by N, you can always win, while if the board is 2 by 2, winning is impossible (make sure you see why).

***For what numbers, N and M, is a win possible?***

#### Extra Credit
What about 3-dimensions? D-dimensions?

Thanks to Liron Raz for giving me this one!
