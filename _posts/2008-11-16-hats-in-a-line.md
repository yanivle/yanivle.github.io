---
layout: post
title:  "Hats in a line"
date:   2008-11-16 01:00:00
excerpt: "A generalization of an easy puzzle"
categories: Puzzles
tags:  Math Puzzle Set-Theory
image:
  feature: hats.jpg
  topPosition: -100
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
This riddle is a cool extension of a well known (and easy) riddle, involving people with hats waiting in a line.

So, lets begin with the original:

### The Original Riddle
100 men are standing in a line, such that each of them sees all those that are in-front of them (so the last man sees the 99 others, etc.). Each guy has a hat on his head colored either black or white. Each of the men guesses the color of their own hat, out-loud. The guy standing last (the one that sees all the other ones) guesses first, then the guy in-front of him, etc. The men's task is to make sure that no more than one of them is wrong.

Just to make things explicit - the men are allowed to agree upon an algorithm before actually being given the hats, but once the task starts they cannot communicate in any way other than the fact that each of them hears the guess of those standing behind them.

Also, to conform to the universal standards of riddles, note that should more than one man be mistaken, they will all be brutally killed.

If you do not know this riddle yet, take a minute to think about its solution before reading on.

### Spoiler Alert - The Solution of the Basic Riddle
I give here the solution of the basic riddle so that there are no misunderstandings regarding the much more interesting extension. It goes like this - The last man (the one that guesses first) sacrifices themselves (with a probability of 0.5). He regards each black hat as a 1 and each white hat as a 0. He then guesses out-loud that he has a black hat if the sum of all the hats of the other people is odd, and guesses white otherwise. The other people can all guess correctly (make sure that you understand why).

### Some Trivial Extensions
Obviously the numbers 100 and 2 (the number of possible hat colors) in the original riddle are completely arbitrary. If m,n are two natural numbers then the riddle with m men and n possible hat colors is a trivial generalization of the previous result.

Now, note that if we let n, the number of possible hat colors, be equal to infinity (well, $$\aleph_0$$, the cardinality of the set of natural numbers) then again we have a trivial generalization (make sure you see why).

### The Real Deal
Now the extension of the riddle we are interested in consists of letting m, the number of people, be equal to $$\aleph_0$$. For simplicity, lets assume that n equals two (the hats are either black or white).

Is the riddle still solvable? I.e. can the men devise an algorithm such that there will be only one mistake?
