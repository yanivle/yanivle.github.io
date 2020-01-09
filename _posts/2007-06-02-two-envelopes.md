---
layout: post
title:  "Two Envelopes"
date:   2007-06-02 01:00:00
excerpt: "An statistics puzzle"
categories: Puzzles
tags:  Puzzle Math Statistics
image:
  feature: envelopes.jpg
  topPosition: -100px
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
You write down 2 different numbers on 2 pieces of paper (one number on each piece). You put each piece of paper in a sealed envelope. I choose one of the envelopes randomly and open it. I then carry out a certain procedure at the end of which I know with a probability greater than $$\frac{1}{2}$$ whether I received the larger or the smaller of the numbers. I can do this even if when you initially wrote down the numbers, you knew my decision procedure!

***How can I do that? What is my trick?***

## Spoiler Alert - Solution Ahead!

Let's start by solving a slightly easier version of the puzzle, where the numbers are whole numbers.

I take a coin, and flip it until I get heads, and count the number of tails that I got along the way. Denote this number of tails by T, and set S = T + 0.5. So if I got one tails and one heads, S would be 1.5. I then compare the number in the envelop I got to S, and switch if S is larger than the number I see. That's it!

Why does this work?

Note that S can take on any of the values: 0.5, 1.5, 2.5, 3.5, ... with positive probability. That means that for any two numbers you write, $$x_1$$ and $$x_2$$, there is a positive probability that S is between them, i.e.: $$x_1 \lt S \lt x_2$$.

Consider 3 cases:
1. S is smaller than both $$x_1$$ and $$x_2$$.
2. S is larger than both $$x_1$$ and $$x_2$$.
3. S is between $$x_1$$ and $$x_2$$.

In case 1, I will always keep the first envelope I got, so I have exactly 50% change of getting the larger number.
Likewise, in case 2, I will always switch the envelope that I got, again resulting in exactly 50% chance of getting the larger number.
In case 3 though, I am guaranteed to always get the larger envelope! Since case 3 happens with positive probability, the overall probability of me getting the larger envelope is larger than 50%. Indeed:

$$P(\text{win}) = 0.5 \times P(\text{case 1}) + 0.5 \ times P(\text{case 2}) + 1.0 \ times P(\text{case 3})$$

Or:

$$P(\text{win}) = 0.5 + 0.5 \ times P(\text{case 3}) \gt 0.5$$.
$$\blacksquare$$

Note that while positive, the probability for case 3 shrinks exponentially and while I will always be able to get an advantage, you can make this advantage extremely small by choosing large numbers.

### Solving for General Real Numbers
Note that the only thing I needed in order for the solution above to work, is to be able to generate a number between your two numbers with positive probability. That is trivially easy to do for general real numbers as well - just take any bijection f between the natural numbers $$\mathbb{N}$$ and the rational numbers $$\mathbb{Q}$$, flip a coin and calculate T like above, and instead of defining S as T + 0.5, define $$S = f(T)$$.
$$\blacksquare$$