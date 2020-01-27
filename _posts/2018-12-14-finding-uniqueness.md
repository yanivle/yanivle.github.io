---
layout: post
title:  "Finding Uniqueness"
date:   2018-12-14 01:00:00
excerpt: "An easy programming puzzle"
categories: Puzzles
tags:  Puzzles Programming
image:
  feature: unique.jpg
  topPosition: -100
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
#### The Easy Version
You have an array with N integers such that all of them appear exactly twice, except for one of them that appears just once. Find it, with the best time and memory complexities.

#### The Harder Version
You have an array with N integers such that all of them appear exactly twice, except for ***two*** of them that each appear just once. Find these two, with the best time and memory complexities.

Thanks Asaf Aharoni for these puzzles!

## Spoiler Alert - Solution Ahead!

You can solve both versions with constant space and linear time. To solve the easy version you just need to XOR together all N elements of the array. To solve the harder version you start by XORing together all N elements of the array, and then you get an integer X that is equal to the XOR of the 2 elements that you are after. X cannot equal 0, as the two elements you are after are different from each other. Find a bit position where X equals one, and then XOR together all elements of the array where that bit position is on. You will find one of the 2 elements, and can then recover the other.
