---
layout: post
title: The Better Half
date: 2010-05-19 17:42 -0400
excerpt: "A cute and easy algorithmic riddle"
categories: Algorithms
tags:  Algorithms Puzzles Easy
image:
  feature: halves.jpg
  topPosition: -100px
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
You have an array of N bit strings each of length M. You know that there is at least one element that appears more than N/8 times in the array. Using O(M+log(N)) memory and O(NM) time, find such an element.

#### An Easier Version

Well, its actually almost exactly the same, but solve the above riddle in case there is an element that appears more than N/2 times in the array. I managed to find 3 distinct solutions to this easier variation, but only one of which generalizes easily.

Thanks Nemo for giving me this riddle!