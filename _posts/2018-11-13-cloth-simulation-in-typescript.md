---
layout: post
title:  "Cloth Simulation in TypeScript"
date:   2018-11-13 01:00:00
excerpt: "A physical simulation of a piece of cloth in TypeScript"
categories: Graphics
tags:  Coding Graphics Physics Simulation Javascript Typescript
image:
  feature: clothsim3d.png
  topPosition: -300px
bgContrast: light
bgGradientOpacity: lighter
syntaxHighlighter: yes
---
A year ago, mostly during a long transatlantic flight, I wrote a simulator for a piece of cloth in TypeScript. That's what it looks like (you can move the sphere with the mouse, clicking the mouse button will tear the cloth):

<style>
  #wrapper {
    position: relative;
  }

  canvas {
    position: absolute;
    left: 0;
  }

  #insert_point {
    position: absolute;
    right: 0;
  }

  #reset {
    position: absolute;
    right: 0;
  }

  input {
    margin: 20px;
  }
</style>

<h1>Demo</h1>
<p>
  <strong>Tear</strong>: mouse click<br/>
  <strong>Shoot</strong>: space bar (aim with mouse!)<br/>
</p>
<div id="wrapper">
  <canvas width="800" height="600" id="canvas"></canvas>
  <script src="/assets/javascripts/require.js"></script>
  <script src="/assets/javascripts/clothsim.js"></script>
  <script>
    requirejs(['clothsim']);
  </script>
  <br/>
  <button type="button" id="reset" onclick="init()">Reset</button><br/>
  <div id="insert_point">
  </div>
</div>

In this post I will describe a couple of the more interesting things about this small project.

#### Representing the Cloth
The cloth is represented by a 2 dimensional array of *joints*, interconnected by *springs*, which allow the cloth to strech. The joints are simulated as a *particle system*, where each joint is affected by the forces from the springs, gravity, and the wind.

Every joint is connected to 6 of its neighbors (the 4-connected left, right, top, and bottom, as well as the top-left and bottom-right neighbors). Removing the diagonal connections makes the cloth (with the existing parameters) more brittle. Adding the other 2 neighbors (top-right and bottom-left) makes the cloth much more stiff.

I gave each of the springs a maximum strech factor, and if strech more than that, it would tear:

{% include image.html url="/assets/images/posts/torn.png" %}

#### Verlet Integration
At the core of my physics engine is a function that advances the state of the world. My initial implementation for that function consisted of simply applying Newton's laws of motion directly (the initial conditions are given by $$x_0, v_0$$):

$$
a_{n} = \sum_{F \in \text{forces}} F\\
v_{n+1} = v_n + a_n \Delta t\\
x_{n+1} = x_n + v_n \Delta t
$$

This resulted in large numerical instability. Instead, I changed my implementation to use [Verlet Integration](https://en.wikipedia.org/wiki/Verlet_integration) which looks like this:

$$
a_{n} = \sum_{F \in \text{forces}} F\\
x_1 = x_0 + v_0 \Delta t + \frac{1}{2}a_1\Delta t^2\\
x_{n+2} = 2 \times x_{n+1} - x_n + a_1\Delta t^2
$$

This basically means that instead of maintaining the velocity explicity, it is derived from the current position and the previous position. This made the physics simulation much more stable.

#### UIValue
This was my first project in TypeScript (a typesafe, compiled version of JavaScript), which I ended up liking a lot.
As I was iterating on the numerical physics constants, I wanted a UI mechanism that will allow me to interactively change the values of all such constants (e.g. the wind speed, gravity, radius of the sphere, etc.). HTML makes it extremely easy to build UIs, but I had one interesting requirement: I wanted to be able to decide anywhere in the code (e.g. deep in the physics integration code) that I wanted to have a constant be changeable from the UI, and with a trivial **local** change, get a UI widget to control that value. I didn't want to have to change a centralized pool of UI widgets.

For this purpose I created the *UIValue* class. It is used like so:

```typescript
// UIValue(
//   name:string,
//   initial_value:number,
//   min:number,
//   max:number,
//   step:number=1) : number;
let some_number = UIValue("name", 0, 0, 100, 10);
```

Here is an actual example from the project:

```typescript
this.wind.x = Math.sin(this.elapsed_time * UIValue("wind_freq", 0.3, 0.1, 10, 0.1)) * UIValue("wind_mag", 0, 0, 160, 40);
```

This results in UI sliders being created:

TODO screenshot.

So from the calling code, this is treated exactly like a regular JavaScript number. The slider is created the first time that the UIValue is accessed.

There are of course some negatives to not having a centralized location. For example, when different code pieces that access the same UIValue, each of them needs to repeat all of the parameters (UIValue makes sure that they are always equal, to avoid bugs, incurring a slight performance cost). Another disadvantage is the it's hard to control the order of the sliders in the UI. But all that said I was very happy with this mechanism that allowed me super fast iterations.

#### Triangulating the Sphere
You can find the full source code for this project in [this github repository](https://github.com/yanivle/clothsim3d).


The cloth interacts with gravity and with the wind:

{% include image.html url="/assets/images/posts/wind.png" %}

And it can interact with a semi-sticky sphere:

{% include image.html url="/assets/images/hero/clothsim3d.png" %}
