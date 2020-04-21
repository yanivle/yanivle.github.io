---
layout: post
title:  "Speak Now or Forever Hold Your Peace"
date:   2020-04-17 15:00:00
excerpt: "A hard combinatorics puzzle"
categories: Puzzles
tags:  Puzzles Computing Algorithms Codes
image:
  feature: speak_now.jpg
  topPosition: -100
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
The warden is playing another cruel game with a group of prisoners. He makes 100 of them stand in a circle, and draws a dot, either white or black, on each of their foreheads. They all see everyone else's dots, but not their own. The warden then counts: "1, 2, 3!" and they all need to simultaneously, either say nothing, or guess the color of the dot on their foreheads. If at least one of them guesses wrong they are all killed. If no one guesses correctly they are all killed as well.

What is a good strategy for the prisoners?

Thanks so much Amit Weinstein for this beautiful riddle!

## Spoiler Alert - Small Hint Ahead

What happens if there are just 3 prisoners instead of 100?
Here's a strategy with a 75% success rate: if a prisoner sees that the two others have dots of different colors, they don't speak. If on the other hand they see two dots of the same color, they guess the opposite color for themselves. Can you see why the success rate is 75%?

## Spoiler Alert - Another Small Hint

Consider the cases where the number of prisoners $$n$$ satisfies: $$n = 2^{k} - 1$$ for some $$k$$. So the next case to look at, after 3, would be 7 prisoners, and then 15.

## Spoiler Alert - Major Hint Ahead

* If I am acting with exaggerated expression of emotion and overacting, then I am ...?
* If I take a sandwich without ham, and I am adding ham to it, then I am ... the sandwich?
* If I am behaving like a resident of Germany zip code 59001, then I am ...?
* When John Ratzenberger does his Toy Story character, then he is ...?
* If I am producing a wordless tone with the mouth closed, forcing the sound to emerge from the nose, then I am ...? (and then replace the 'u' with an 'a')
