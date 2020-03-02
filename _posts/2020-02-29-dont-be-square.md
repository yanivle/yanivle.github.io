---
layout: post
title:  "Don't Be Square"
date:   2020-02-29 12:00:00
excerpt: "An easy puzzle"
categories: Puzzles
tags:  Math Puzzles
image:
  feature: dont-be-square.jpg
  topPosition: -300
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
I play a game with you and your friend. I pick a positive integer $$n$$. I give you either $$n$$ or $$n^2$$ and I give your friend the other number. You look at your number (either $$n$$ or $$n^2$$) and transfer a single bit (e.g. by saying either "yes" or "no") to your friend. Your friend has to know if they got $$n$$ or $$n^2$$.

***What's your strategy?***

#### Extra Credit

What happens if $$n$$ is a positive *real* instead of an *integer*?

> Thanks Anatoly Vorobey for the riddle, and Ofir Mebel for the extra credit!

## Spoiler Alert - Solution Ahead!

We'll just solve the real case (assuming $$n$$ is greater than 1, I leave the case $$n$$ is less than 1 as an easy exercise to the reader). Call your number $$x$$ and your friend's number $$y$$. Now set $$k_x$$ to be the largest integer such that:

$$x^{2^{k_x}} \lt 2$$

And similarly your friend calculates $$k_y$$ for his number. It holds that $$k_x = k_y + 1$$ or $$k_x = k_y - 1$$. You now transmit to your friend the second least bit of $$k_x$$ and since they already know the least bit of $$k_x$$ (it's the opposite of the least bit of $$k_y$$) they can trivially reconstruct $$k_y$$. $$\blacksquare$$
