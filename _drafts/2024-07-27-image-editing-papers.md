---
layout: post
title:  "Smashing Images for Fun and Profit"
date:   2024-07-27 01:00:00
excerpt: "Some cool techniques for editing images and videos."
categories: AI
tags:  AI Computing Programming Hacking Python Math Puzzles Graphics
image:
  feature: face0_hero.png
  # topPosition: -500
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---

I have a very bad memory.
Still, I vividly remember the mind-blowing moment of seeing the avocado-chair images from the Dall-E paper for the first time:

{% include image.html url="/assets/images/posts/image_gen/dalle1_avocado_chairs_white.jpeg" height=7 %}

Wow! Unbelievable that these are from almost four years ago!

Image generation is such a cool field, and I'm lucky to have spent a bit of time doing research here.
In this post I'll look back at some of my own work in image generation.

# UniTune

<!-- UniTune was a super fun hacking project for a couple of weeks, but to properly explain it, let's start with some important background here. -->

<!-- I was very lucky, a couple of years back, to come across the amazing work by Jonathan Ho, Mohammad Nourouzi, and others, including their amazing work on Imagen (who are now creating one of the coolest image generation platforms out there - [ideogram](https://ideogram.ai/)!) -->

A couple of years ago, some of my friends at Google developed a super cool technique known as [DreamBooth](https://dreambooth.github.io/).
To understand DreamBooth, consider the following problem - if I ask an image generation model to generate a "`Brad Pitt Pirate`" it does a great job, but if I ask it for a "`Yaniv Leviathan Pirate`" it does not:

{% include figure.html url="/assets/images/posts/image_gen/brad_pitt_yaniv_leviathan_pirates.jpeg" caption="Images generated by Stable Diffusion 2.1 for the prompts `Brad Pitt Pirate` (left) and `Yaniv Leviathan Pirate` (right)." %}

Why is that so? The only difference between Brad Pitt and me (_well, the only difference in this specific context, I'm sure you could find a couple more differences in general :)_) is that the model encountered many examples of Brad Pitt during training, while it likely didn't encounter any examples of me.

Well, DreamBooth suggested to fix just that - if we want our model to learn a new concept, such as to be able to draw me, let's just add examples of me (or whatever else we'd like the model to learn) to the training set and _train the model some more_.
Usually, the images of Brad Pitt aren't all clumped up at the end of training, but are rather spread across the train set, so the model encounters them once in a while, while encountering a wide variety of other examples in between (to make sure it doesn't forget how to draw other things, such as pirates!), so DreamBooth suggests to train the model a bit more on a small sample from its original varied dataset, while making sure this sample contains a bunch of images of our new subject (me in this example). Et voilà - the model learned a new concept!

{% include figure.html url="/assets/images/posts/image_gen/dreambooth_me.jpg" caption="Examples of images generated by Stable Diffusion v1.4 after training it a bit more on images of myself, DreamBooth style." %}

As an aside, a while ago I spent a couple of hours writing a small script that fetches the news headlines, converts them to image generation prompt, generates image from a DreamBooth-ed model of myself, and displays the results on my kitchen's Google Home as a background to the actual news headlines. I stopped this experiment very quickly (I admittedly didn't fully think about how horrible the news headlines are :)) but I'll leave that for another post.

{% include image.html url="/assets/images/posts/image_gen/unitune_hero.jpeg" height=20 %}

Btw - the source image above is a photo of Matan and I that we used in [the first blog we published about Google Duplex in 2018](https://research.google/blog/google-duplex-an-ai-system-for-accomplishing-real-world-tasks-over-the-phone/) :)

{% include image.html url="/assets/images/posts/image_gen/unitune2.jpeg" height=20 %}


# Dreamix

{% include video.html url="https://dreamix-video-editing.github.io/static/videos/vid2vid_cats.mp4" %}

{% include video.html url="https://dreamix-video-editing.github.io/static/videos/subj_driv_lifting.mp4" %}

{% include video.html url="https://dreamix-video-editing.github.io/static/videos/vid2vid_leaping.mp4" %}

{% include video.html url="https://dreamix-video-editing.github.io/static/videos/img2vid_buffalo.mp4" %}

{% include video.html url="https://dreamix-video-editing.github.io/static/videos/subj_driv_walking.mp4" %}


# Face0

{% include image.html url="/assets/images/posts/image_gen/face0_hero.jpeg" height=20 %}

# RECAP

{% include image.html url="/assets/images/posts/image_gen/recap_hero.jpeg" height=20 %}

# GameNGen
