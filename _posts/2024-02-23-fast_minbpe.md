---
layout: post
title:  "fast_minbpe"
date:   2024-02-23 01:00:00
excerpt: "My late night take on simple, clean, but slightly faster BPE."
categories: AI
tags:  AI Computing Programming Hacking Python Math
image:
  feature: fast_minbpe.png
  topPosition: 0
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
recommended: no
---

Andrej Karpathy's [code](https://github.com/karpathy) and [videos](https://www.youtube.com/@AndrejKarpathy) are so awesome!

I love how concise his code is, and his [minGPT repo](https://github.com/karpathy/minGPT) inspired me to write my ["The Art of Transformer Programming"]({% post_url 2023-08-04-taotp %}) book.

Anyway, I just finished watching [his BPE video](https://www.youtube.com/watch?v=zduSFxRajkE) and got inspired. Karpathy's code is really nice (as always), and [his implementation](https://github.com/karpathy/minbpe) is obviously not meant to be fast, _but_, we should be able to make the code much faster without sacrificing clarity too much. Hopefully, faster code can make experimentation (e.g. with different scores, instead of always taking the most popular pair) easier.

You can find my late night take on a simple, clean, but (slightly) faster BPE implementation [here](https://github.com/yanivle/fast_minbpe).

On my laptop, training/tokenizing the taylorswift.txt file with a vocab size of 10K takes:


<table>
<colgroup>
<col width="40%" />
<col width="40%" />
<col width="20%" />
</colgroup>
<thead>
<tr>
<th> </th>
<th style="text-align:left">minbpe</th>
<th style="text-align:left">fast_minbpe</th>
</tr>
</thead>
<tbody>
<tr>
<td markdown="span">Training</td>
<td markdown="span">110.10 secs</td>
<td markdown="span">1.89 secs</td>
</tr>
<tr>
<td markdown="span">Tokenization</td>
<td markdown="span">190.91 secs</td>
<td markdown="span">0.84 secs</td>
</tr>
</tbody>
</table>

So, in this setup, we get 58X faster training.

As usual, this is a fun puzzle and I recommend trying to solve this yourself before looking at [my code](https://github.com/yanivle/fast_minbpe/blob/main/fast_minbpe.ipynb). I hope to get a few more hours at some point to profile and clean up the code properly :)

