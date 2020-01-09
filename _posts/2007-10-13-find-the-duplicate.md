---
layout: post
title:  "Find the Duplicate"
date:   2007-08-23 01:00:00
excerpt: "An easy algorithmic riddle"
categories: Puzzles
tags:  Algorithms Puzzle Easy Coding
image:
  feature: twins.jpg
  topPosition: -1000px
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
Dany Valevsky gave me this very cool riddle.

You are given a vector of size *N*, the elements of which are numbers in the range *1, ..., N-1*. I.e. there is at least one repeating element. Give an algorithm that finds a repeating element (it does not matter which one, in case there are several) with *O(N)* time complexity and *O(1)* memory complexity.

NOTE - the time and memory complexities are calculated in integers. I.e. the input is of size *N*, not *N\*log(N)*.

<!-- ## Spoiler Alert - Solution Ahead!

Look at the array A as defining a function $$f:\{1, ..., N\} \rightarrow \{1, ..., N\}$$. To find a duplicate is the same as finding an element such that two numbers  Since N doesn't appear in the array, there isn't any number  &#961; -->