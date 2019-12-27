---
layout: post
title:  "Attractive Triangle"
date:   2019-12-24 01:00:00
excerpt: "A fractal puzzle"
categories: Puzzle
tags:  Math Puzzles Fractals
image:
  feature: triangle.jpg
  topPosition: -100px
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
You have 3 fixed points in the plane: A, B, and C:

{% include image.html url="/assets/images/posts/sierpinski/start_triangle.png" %}

Define a sequence of points, $$p_n$$ as follows. Choose $$p_0$$ anywhere on the plane. For each *n*, chose a point randomly (uniformly) between A, B, and C, call it *q* and set $$p_{n+1} = \frac{p_n + q}{2}$$. I.e. each turn you chose one of A, B, or C, and take the mid-point between the previous point and the chosen point.

Here you can see the first few iterations:

***What will the set $$\{p_n\}$$ look like?***

#### Extra Credit

1. What happens if you choose non-uniformly between A, B, and C?
2. What happens if you don't take the mid-point, but some other point in-between?
3. What happens if you start with 4 points? N points?

## Spoiler Alert - Solution Ahead!

This result of this process is a fractal known as [Sierpiński triangle](https://en.wikipedia.org/wiki/Sierpi%C5%84ski_triangle):

{% include image.html url="/assets/images/posts/sierpinski/sierpinski.png" %}

Why is this the result? I'll sketch a quick explanation, and hopefully will add some illustrative drawings at some point. It's easy to see that no matter where the point starts in the plane, it will quickly move into the triangle formed by the points A, B, and C. Once inside the triangle, the image of the function is limited to a clone of the image of the previous iteration, scaled by $$\frac{1}{2}$$ towards one of A, B, or C, resulting in this amazing fractal!

What happens if instead of choosing the mid-point, we choose a point closer to A, B, or C? (specifically 55% of the way there)

{% include image.html url="/assets/images/posts/sierpinski/sierpinski_45.png" %}

What happens if we stay closer to the original point than to A, B, or C? (45% of the way)

{% include image.html url="/assets/images/posts/sierpinski/sierpinski_55.png" %}

What happens if we choose one point with higher probability than the others?

{% include image.html url="/assets/images/posts/sierpinski/sierpinski_skewed.png" %}

And here's what happens if the fixed points are arranged in a square (and we take a point much closer to A, B, and C than to p):

{% include image.html url="/assets/images/posts/sierpinski/sierpinski_square_33.png" %}

Note that if the fixed points are arranged in a square and we take the mid-point - we get this (can you see why?):

{% include image.html url="/assets/images/posts/sierpinski/sierpinski_square.png" %}

And this is what happens with a skewed square (taking mid-points):

{% include image.html url="/assets/images/posts/sierpinski/sierpinski_square_skewed.png" %}

And a skewed square (taking points close to the corners):

{% include image.html url="/assets/images/posts/sierpinski/sierpinski_square_skewed_33.png" %}

What about a random polygon? Here it is:

{% include image.html url="/assets/images/posts/sierpinski/sierpinski_poly.png" %}

