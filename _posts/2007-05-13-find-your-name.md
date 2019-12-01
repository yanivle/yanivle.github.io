---
layout: post
title:  "Find Your Name"
date:   2007-05-13 01:00:00
excerpt: "A very hard combinatorics puzzle"
categories: Puzzle
tags:  Math Puzzles Hard Classic
image:
  feature: chest.jpg
  topPosition: -300px
bgContrast: light
bgGradientOpacity: lighter
syntaxHighlighter: no
---
There are 100 men, 100 boxes and 100 notes with the men's names on them. The 100 boxes are arranged in a line in a room. Each of the notes with the names is put in a different box randomly. The men are put together and are allowed to decide upon a strategy. When they are done, they are taken, each in his turn, to the room with the boxes. Each one is allowed to open 50 of the boxes. No information whatsoever is shared between the men.

The goal of the men is that each of them finds his own name among the 50 boxes he opened. If but one of them fails to find his own name, they all get killed (why is it, that in so many riddles people end up dead?). You are required to find a method with which they are all saved with a probability greater than 30%.

If you understood this riddle properly, it should seem impossible at first. Lets consider two bad strategies for the men:

1. All the men decide to open the same 50 boxes - this is probably the worst strategy for them, as all of them will die with probability 1. This is because 50 of them are sure to not find their names in the boxes they open.

2. Every man opens 50 boxes randomly - although a better strategy than the previous one, it is also a very bad strategy. Each person is likely to find his own name with a probability of $$\frac{1}{2}$$. As all the events of the men finding their names are independent, they will be saved with a probability of only $$(\frac{1}{2})^{100}$$ which is smaller than 0.00000000000000000000000000000079 (which is obviously smaller than 30%). It is a very bad strategy indeed.
