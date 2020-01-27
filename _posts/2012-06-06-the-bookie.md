---
layout: post
title:  "The Bookie"
date:   2012-06-06 01:00:00
excerpt: "Two nice and easy gambling related riddles"
categories: Puzzles
tags:  Math Puzzles Combinatorics
image:
  feature: gambling.jpg
  topPosition: -100
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
These are two nice and easy gambling related riddles.

### Double or Nothing

FC Barcelona  and Real Madrid C.F. will be playing 7 games against each other this season. I give you \\$1,000 and ask you to double it in case Barça wins overall (i.e. if they win at least 4 of the 7 games). You are allowed to lose all of it otherwise.

You have a honest bookie which gives you 1-1 odds on each game, but he is only willing to take bets on single games, not on the entire season.

***How can you double my money?***

Note that you are not allowed to take loans, so if for example you bet \\$30 on Barça in the first game and they win you have a maximum of \\$1,030 to bet on for the second game, and if they lose, you have a maximum of \\$970 to bet on the second game.

### Beat the Bookie

This second riddle is even easier. There are n horses in a horse race. Your bookie gives you $$X_1, ..., X_n$$ – the odds for each horse.

For example, if $$X_2$$ is 3, for each dollar you place on horse 2 you will get 3 dollars if horse 2 wins.

***Under what condition on the $$X_i$$'s can you guarantee to make money?***

*Thanks to Srulix for these two riddles!*

## Spoiler Alert - Solutions Ahead!

### Solution to Double or Nothing
Denote by $$W_{i, j}$$ the maximum multiplier you can guarantee to make on your money if you are willing to lose everything unless there are at least *i* wins, out of *i + j* games. Let's show that $$W_{4, 3} \ge 2$$, and how to get it. Note that $$W_{i, 0} = 2^i$$ (just bet all of your money every turn) and $$W_{0, i} = 1$$ for all *i* (you can't guarantee winning anything at all if you don't have any guarantees on the underlying games). Also, note that since the maximum must be attained whether you win or lose the first game, if you denote by *k* the fraction of your money you should bet to attain $$W_{i, j}$$, note that *k* satisfies $$W_{i, j} = (1 + k) \times W_{i - i, j} = (1 - k) \times W_{i, j-1}$$. Or, $$k = \frac{W_{i, j-1} - W_{i - 1, j}}{W_{i, j-1} + W_{i - 1, j}}$$. Using this recursion formula, we get the following values:

<style>
table {
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: center;
  padding: 8px;
}

.highlight_cell {
    background-color: #eeeeee;
}
</style>

##### W:

<table><tr><td class="highlight_cell">$$1 $$</td>
  <td class="highlight_cell">$$2 $$</td>
  <td class="highlight_cell">$$4 $$</td>
  <td class="highlight_cell">$$8 $$</td>
  <td class="highlight_cell">$$16 $$</td></tr>
<tr><td class="highlight_cell">$$1 $$</td>
  <td>$$1 \frac{ 1 }{ 3 }$$</td>
  <td>$$2 $$</td>
  <td>$$3 \frac{ 1 }{ 5 }$$</td>
  <td>$$5 \frac{ 1 }{ 3 }$$</td></tr>
<tr><td class="highlight_cell">$$1 $$</td>
  <td>$$1 \frac{ 1 }{ 7 }$$</td>
  <td>$$1 \frac{ 5 }{ 11 }$$</td>
  <td>$$2 $$</td>
  <td>$$2 \frac{ 10 }{ 11 }$$</td></tr>
<tr><td class="highlight_cell">$$1 $$</td>
  <td>$$1 \frac{ 1 }{ 15 }$$</td>
  <td>$$1 \frac{ 3 }{ 13 }$$</td>
  <td>$$1 \frac{ 11 }{ 21 }$$</td>
  <td>$$2 $$</td></tr>
<tr><td class="highlight_cell">$$1 $$</td>
  <td>$$1 \frac{ 1 }{ 31 }$$</td>
  <td>$$1 \frac{ 7 }{ 57 }$$</td>
  <td>$$1 \frac{ 29 }{ 99 }$$</td>
  <td>$$1 \frac{ 93 }{ 163 }$$</td></tr></table>

##### k:

<table><tr><td class="highlight_cell">$$$$</td>
  <td class="highlight_cell">$$1 $$</td>
  <td class="highlight_cell">$$1 $$</td>
  <td class="highlight_cell">$$1 $$</td>
  <td class="highlight_cell">$$1 $$</td></tr>
<tr><td class="highlight_cell">$$$$</td>
  <td>$$\frac{ 1 }{ 3 }$$</td>
  <td>$$\frac{ 1 }{ 2 }$$</td>
  <td>$$\frac{ 3 }{ 5 }$$</td>
  <td>$$\frac{ 2 }{ 3 }$$</td></tr>
<tr><td class="highlight_cell">$$$$</td>
  <td>$$\frac{ 1 }{ 7 }$$</td>
  <td>$$\frac{ 3 }{ 11 }$$</td>
  <td>$$\frac{ 3 }{ 8 }$$</td>
  <td>$$\frac{ 5 }{ 11 }$$</td></tr>
<tr><td class="highlight_cell">$$$$</td>
  <td>$$\frac{ 1 }{ 15 }$$</td>
  <td>$$\frac{ 2 }{ 13 }$$</td>
  <td>$$\frac{ 5 }{ 21 }$$</td>
  <td>$$\frac{ 5 }{ 16 }$$</td></tr>
<tr><td class="highlight_cell">$$$$</td>
  <td>$$\frac{ 1 }{ 31 }$$</td>
  <td>$$\frac{ 5 }{ 57 }$$</td>
  <td>$$\frac{ 5 }{ 33 }$$</td>
  <td>$$\frac{ 35 }{ 163 }$$</td></tr></table>

We see that indeed $$W_{4, 3} = 2$$. The fraction of our money we should bet at any point, is given by the k table. $$\blacksquare$$.

### Solution for Beat the Bookie

Denote by $$a_i$$ the amount you bet on horse *i*. Then your guaranteed win is $$min(a_iX_i)$$. You can therefore only guarantee a win if $$\sum{a_i} \lt min(a_iX_i)$$, and an optimal strategy for optimizing the minimum return would be to require for all *i, j* $$a_iX_i=a_jX_j$$, or, $$a_i = \frac{a_1X_1}{X_i}$$. We get:

$$\sum{a_i} = \sum{\frac{a_1X_1}{X_i}} \lt a_1X_1$$
$$\implies \sum{\frac{1}{X_i}} \lt 1$$

Which is a necessary and sufficient condition. $$\blacksquare$$
