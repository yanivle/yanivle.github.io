---
layout: post
title:  "Expanding Frogs"
date:   2007-11-21 01:00:00
excerpt: "An easy geometric math puzzle"
categories: Puzzles
tags:  Math Puzzles Easy
image:
  feature: frog.jpg
  topPosition: -100px
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
Thanks to Nadav Sherman for asking me this riddle.

Four frogs are sitting on the corners of the unit square (i.e. they have coordinates (0,0), (0,1), (1,1) and (1,0)). Each turn, a frog can jump over any other frog, thereby transferring itself to the symmetrical point on the other side of the static frog. For example, if the frog at (0,0) jumps over the frog at (1,1) it will land on (2,2).

**Prove that the frogs cannot transfer themselves to a square with a side of length 2.**

## Spoiler Alert - Solution Ahead!

Note that all the steps are reversible, i.e. you can rewind back time. That means that if you can create a square of side 2 from a square of side 1, you can create a square of side 1 from a square of side 2. Now apply those exact same steps to a square of side 1, and you'll end up with a square of side $$\frac{1}{2}$$ which is clearly impossible, as obviously the frogs always remain on integer coordinates. $$\blacksquare$$