---
layout: post
title:  "What are the Odds?"
date:   2007-07-20 01:00:00
excerpt: "A hard combinatorics puzzle"
categories: Puzzle
tags:  Puzzle Math Hard
image:
  feature: coins.jpg
  topPosition: -100px
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
You are given a natural number N and two coins. You can set the probabilities of getting heads or tails on both coins as you wish. You are then asked to generate a random number uniformly distributed on the set $$\{ 1, 2, ..., N \}$$. The catch is that you must have a *finite upper bound* on the number of coin tosses you use.

Lets clarify the requirements of the riddle by a simple example. Say N=6. Setting the probabilities for the coins to $$\frac{2}{3}$$ and $$\frac{1}{2}$$ will do the trick, as we can generate a number uniformly distributed on the set $${ 1, 2, 3, 4, 5, 6 }$$ with a maximum of 3 tosses of the two coins (can you see how?).
