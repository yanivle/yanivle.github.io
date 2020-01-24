---
layout: post
title:  "Cloth Simulation in TypeScript"
date:   2018-11-13 01:00:00
excerpt: "A physical simulation of a piece of cloth in TypeScript"
categories: Graphics
tags:  Graphics Coding Physics Simulation Javascript Typescript
image:
  feature: clothsim3d.png
  topPosition: -300px
bgContrast: light
bgGradientOpacity: lighter
syntaxHighlighter: yes
---
A year ago, mostly during a long transatlantic flight, I wrote a simulator for a piece of cloth in TypeScript. That's what it looks like (you can move the sphere with the mouse, clicking the mouse button will tear the cloth):

<h1>Demo</h1>

<p>
Click <strong onclick="window.debug_mode = !window.debug_mode;">here</strong> to toggle debug mode.
</p>

<div id="wrapper">
  <canvas width="800" height="600" id="canvas"></canvas>
  <script src="/assets/javascripts/clothsim3d/clothsim.js" type="module"></script>
  <br/>
</div>

In this post I will describe a couple of the more interesting things about this small project.

#### Representing the Cloth
The cloth is represented by a 2 dimensional array of *joints*, interconnected by *springs*, which allow the cloth to strech.

You can see the joints here:

{% include image.html url="/assets/images/posts/clothsim3d/particles.png" %}

The springs are connecting each joint to it's 8 neighbors (up, down, left, right, and up-left, up-right, bottom-left, and bottom-right):

{% include image.html url="/assets/images/posts/clothsim3d/spring_structure.png" %}

This seemingly simple setup does look like a piece of cloth when we apply more forces. Here are the springs when resting on an invisible sphere:

{% include image.html url="/assets/images/posts/clothsim3d/spring_structure_invisible_sphere.png" %}

Here are the joints and the springs together:

{% include image.html url="/assets/images/posts/clothsim3d/particles_and_springs.png" %}

I experimented with connecting every joint to only 6 of its neighbors (the 4-connected left, right, top, and bottom, as well as the top-left and bottom-right neighbors). This makes the cloth (with the existing parameters) more brittle, while the current 8-neighbor setting, makes the cloth much more stiff.

The joints are simulated as a *particle system*, where each joint is affected by the forces from the springs, gravity, and the wind.

Each spring has some *tension* that increases linearly with the length of the string, but only in 1 direction (i.e. if the string is longer than resting length it exerts a linear forces towards resting length, but if the spring is shorter than resting length, there is no force pushing it back towards resting length). Here we see the tension during rest (caused by gravity):

{% include image.html url="/assets/images/posts/clothsim3d/resting_tension.png" %}

Here we can see the tension when an additional force (wind) is applied to the system:

{% include image.html url="/assets/images/posts/clothsim3d/wind_tension.png" %}

Here we see the tension when the cloth is resting on a sphere:

{% include image.html url="/assets/images/posts/clothsim3d/tension_particles.png" %}

And when the sphere is moving:

{% include image.html url="/assets/images/posts/clothsim3d/tension_sphere_moving.png" %}

I gave each of the springs a maximum stretch factor, and if it stretches more than that, it would tear:

TODO

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

This basically means that instead of maintaining the velocity explicitly, we derive the velocity from the current position and the previous position. This made the physics simulation much more stable. This is a really interesting phenomenon and I'll probably elaborate about this in a future post.

#### UIValue
As I was iterating on the numerical physics constants, I wanted a UI mechanism that will allow me to interactively change the values of all such constants (e.g. the wind speed, gravity, radius of the sphere, etc.). HTML makes it extremely easy to build UIs, but I had one interesting requirement: I wanted to be able to decide anywhere in the code (e.g. deep in the physics integration code) that I wanted to have a constant be changeable from the UI, and with a trivial **local** change, get a UI widget to control that value. I.e. I didn't want to have a centralized pool of UI widgets, and needing to touch a central registry for every change, etc.

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

{% include image.html url="/assets/images/posts/clothsim3d/uivalues.png" %}

So from the calling code, this is treated exactly like a regular JavaScript number. The slider is created the first time that the UIValue is accessed.

There are of course some negatives to not having a centralized location. For example, different code pieces can access the same UIValue, and each of them needs to repeat all of the parameters (the UIValue class does automatically make sure that at least they are always equal, to avoid bugs, incurring a slight performance cost). Another disadvantage is the it's hard to control the order of the sliders in the UI. But all that said, I was very happy with this mechanism that allowed me super fast iterations.

#### Rendering
For this project I created my own rasterization renderer. Everything (the cloth, the sphere) is a mesh, whose vertices are all transformed and then projected on to the screen. I originally implemented perspective projection, but later decided that this actually looks nicer with an orthographic projection, so that's what's happening in the demo above.

Here we see a scene with perspective projection enabled:

TODO

And here we see orthographic projection:

TODO

I implemented a simple lightning model, supporting just ambient and diffuse lightning. Here is the cloth with just ambient lightning on:

{% include image.html url="/assets/images/posts/clothsim3d/ambient_only.png" %}

And here is the same with both diffuse and ambient on:

{% include image.html url="/assets/images/posts/clothsim3d/diffuse_and_ambient.png" %}

Here is a version with exaggerated diffuse lightning, without ambient light, to illustrate the difference:

{% include image.html url="/assets/images/posts/clothsim3d/diffuse_only.png" %}

#### Triangulating the Sphere
Another interesting aspect of this project was rendering the red sphere. While I am using a true sphere for the physics calculations (it is much easier to have my vertices collide with a true sphere than a polygonal mesh), since my engine for this project was rasterization based, I need some way to approximate a sphere with triangles. What I ended up doing (and produced the best results) was to create an icosahedron and tesselate it. I really tried to avoid this though (I didn't have connection on the flight and writing the equations for the vertices of the icosahedron was not trivial). My idea was to take any simple shape (a pyramid or a cube) for which calculating the positions of the vertices is trivial, and repeatedly subdivide the faces and normalize the vertices.

This is better illustrated with some images. Here is a pyramid whose faces I repeatedly subdivided *without* normalization:

{% include image.html url="/assets/images/posts/clothsim3d/pyramid_spheres_color_not_normalized.png" %}

And here it is after normalization:

{% include image.html url="/assets/images/posts/clothsim3d/pyramid_spheres_color.png" %}

It definitely looks "spherish", but not perfect. I tried the same with a cube, which looks better, but still not great:

{% include image.html url="/assets/images/posts/clothsim3d/sphere_cube_color.png" %}

Might be a bit easier to see this one without the faces:

{% include image.html url="/assets/images/posts/clothsim3d/sphere_cube.png" %}

Both of these are ok, but not great, and I finally decided to do the hard work and parametrize the icosahedron:

{% include image.html url="/assets/images/posts/clothsim3d/sphere_icosahedron.png" %}

Here it is in all it's symmetric glory:

{% include image.html url="/assets/images/posts/clothsim3d/sphere_icosahedron_color.png" %}

---

The cloth interacts with gravity and with the wind:

{% include image.html url="/assets/images/posts/wind.png" %}

And it can interact with a semi-sticky sphere:

{% include image.html url="/assets/images/hero/clothsim3d.png" %}
