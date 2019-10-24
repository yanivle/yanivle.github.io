---
layout: post
title:  "Cloth Simulation in TypeScript"
date:   2018-11-13 01:00:00
excerpt: "A physical simulation of a piece of cloth in TypeScript"
categories: Graphics
tags:  Coding Graphics Physics Simulation Javascript Typescript
image:
  feature: clothsim3d.png
  topPosition: -100px
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
I wrote a physical simulator for a piece of cloth in TypeScript.

The cloth interacts with gravity and with the wind:

{% include image.html url="/assets/images/posts/wind.png" %}

It can be torn:

{% include image.html url="/assets/images/posts/torn.png" %}

And it can interact with a semi-sticky sphere:

{% include image.html url="/assets/images/hero/clothsim3d.png" %}

### Interactive Demo

TODO add interactive demo here

### Interesting Technological Pieces

TODO
#### UIValue
UIValue.ts

#### Building the Sphere
Mesh.ts

#### Verlet Integration
TODO explain

