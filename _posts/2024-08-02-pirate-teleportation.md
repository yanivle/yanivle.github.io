---
layout: post
title:  "Pirate Teleportation"
date:   2024-08-02 01:00:00
excerpt: "A cool continuation of an easy puzzle"
categories: Puzzles
tags:  Puzzle Math Easy
image:
  feature: robopirates.png
  topPosition: -500
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
Avast ye, mateys!

This here be a follow up riddle, a sequel if ye will, to [a previous puzzle that's been hidin' in these digital waters for a while now]({% post_url 2007-10-13-pirates %}).
It be a fine and simple ol' challenge, that first one, and ye should be plunderin' it before ye set sail on this new adventure.
So hoist the sails and set a course for [the original puzzle]({% post_url 2007-10-13-pirates %}), then come back here for additional booty!

### Follow Up Questions to the Original Puzzle
1. The survivors from the original puzzle developed teleportation technology! Instead of their ship having a constant integer velocity, they now instead have a fixed (but unknown!) computer program `get_teleport_destination`, that gets the day number as input (it gets 0 on the first day, 1 on the second, etc.) and generates arbitrary new (still integer) coordinates, once per day, and the ship _instantaneously teleports_ to these new coordinates.
As before, you don't know the ship's starting coordinates, and you are allowed one shot per day.
To decide where to shoot, _you must also use a computer program_ that will produce each day the coordinates to shoot at. **Show that you can no longer guarantee the destruction of the ship.**
2. You now learned that the ship is running the `get_teleport_destination` program on a single specific CPU, say an [80386](https://en.wikipedia.org/wiki/I386) computer. Remember that you know that it takes no more than 24 hours to compute the coordinates. **Produce a computer program that generates coordinates to shoot at, that will destroy the ship**. For extra-credit, provide an upper bound on the number of days needed until the ship is destroyed and on the amount of computing power you'd need to guarantee destruction.

A hearty "thank ye" to [Gemini](https://gemini.google.com/), the digital parrot, for helpin' me turn this olde post into pirate speak!
