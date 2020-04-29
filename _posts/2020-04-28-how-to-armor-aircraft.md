---
layout: post
title:  "How To Armor Aircraft"
date:   2020-04-28 01:00:00
excerpt: "An easy statistics puzzle"
categories: Puzzles
tags:  Math Puzzles Easy Statistics Bias
image:
  feature: aircraft.jpg
  topPosition: -400
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
During World War II, the United States Air Force conducted a study of the damage done to aircraft that had returned from battle, in order to recommend where armor should be added. Since armor is very heavy it could only be added sparingly. Researchers analyzed aircarft that returned from battle, and were hit by a bullet, and plotted spots where the bullets hit on this diagram:

{% include image.html url="/assets/images/posts/aircraft_hits.png" %}

Each red dot denotes a location where an aircraft was hit by a bullet.

***Based on this diagram, where should the extra armor be added?***

## Spoiler Alert - Solution Ahead!
Well, the researchers from the Center for Naval Analyses had, wrongly, recommended that armor be added to the areas that showed the most damage - i.e. that armor should be added to the red areas, like so:

{% include image.html url="/assets/images/posts/aircraft_wrong.png" %}

Luckily, the statistician [Abraham Wald](https://en.wikipedia.org/wiki/Abraham_Wald) noted that the study ***only considered the aircraft that had survived their missions***, as all the fighters which had been shot down were unavailable for assessment! The holes in the returning aircraft, then, represented exactly the areas where a fighter could take a bullet and still return home safely! Wald proposed that the Navy reinforce areas where the returning aircraft were **unharmed**, like the cockpit, the engines, the center of the wings, or the narrow fragile area connecting the fighter's tail to the main body:

{% include image.html url="/assets/images/posts/aircraft_right.png" %}

*Those were exactly the areas that, if hit, would cause the plane to be lost, and be missing from the survey!*

The error of concentrating on the things that made it past some selection process and overlooking those that did not, is called [Survivorship bias](https://en.wikipedia.org/wiki/Survivorship_bias#In_the_military). This puzzle is borrowing heavily from the fascinating wikipedia article on the topic (and from a couple of related wikipedia articles).

### Another Example - The Brodie Helmet

When the [Brodie helmet](https://en.wikipedia.org/wiki/Brodie_helmet) was introduced during World War I, there was a dramatic rise in severe head injuries. This led army command to consider redrawing the design, until a statistician remarked that soldiers who might previously have been killed by hits to the head, and therefore never showed up in a field hospital to begin with, were now surviving the same hits!

{% include image.html url="/assets/images/posts/brodie_helmet.jpeg" %}

Interestingly, in May of 2014, the UK's Health and Safety Executive, advised that Brodie helmets were not safe to handle for a completely different reason - the likelihood of their containing asbestos!
