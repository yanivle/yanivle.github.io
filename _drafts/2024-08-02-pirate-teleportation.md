---
layout: post
title:  "Pirate Teleportation!"
date:   2024-08-02 01:00:00
excerpt: "A cool continuation of an easy puzzle"
categories: Puzzles
tags:  Puzzle Math Easy
image:
  feature: telepirates.gif
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
1. The survivors from the original puzzle developed teleportation technology! Instead of their ship having a constant integer velocity, they now instead have a fixed (but unknown!) computer program `get_teleport_destination`, that gets the ship's current position and generates arbitrary new (integer) coordinates, once per day, and the ship instantaneously teleports to these new coordinates. As before, you don't know the ship's (integer) starting coordinates, and you are allowed one shot per day. To decide where to shoot, _you must also use a computer program_ that will produce each day the coordinates to shoot at. **Can you destroy the ship?**
2. Convince yourself that if you know the ship's `get_teleport_destination` program, you can easily destroy it. **Can you still guarantee the destruction of the ship if instead of knowing `get_teleport_destination`, you know that it is one of two programs, either `get_teleport_destination1` or `get_teleport_destination2`?**
3. What if `get_teleport_destination` is not known, but you do know that the ship is using a single specific computer, say an [80386](https://en.wikipedia.org/wiki/I386) computer, and that it takes no more than 24 hours to compute the coordinates? Assuming that you also have access to an 80386, and that it performs 1,000,000 instructions per second (each potentially reading or writing 1 bit of memory), **provide an upper bound on the number of days needed until the ship is guaranteed to be destroyed.**

Thanks be to ye, [ideogram](https://ideogram.ai), ye've created a mighty fine hero image, fit for a true pirate!
Shiver me timbers! A thousand barnacles on ye, and a hearty "Yo ho ho" [Vidnoz](https://www.vidnoz.com/), ye've added an animation worthy of a legendary pirate's bounty!
And a hearty "thank ye" to [Gemini](https://gemini.google.com/), the digital parrot, for helpin' me turn this olde post into pirate speak!
