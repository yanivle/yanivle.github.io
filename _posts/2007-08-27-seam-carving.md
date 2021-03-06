---
layout: post
title:  "Seam Carving"
date:   2007-08-27 12:00:00
categories: Graphics
tags:  Graphics Algorithms Coding
image:
  feature: seam_carving.png
  topPosition: -300
bgContrast: light
bgGradientOpacity: lighter
syntaxHighlighter: no
---
I recently watched [this](http://www.youtube.com/watch?v=vIFCV2spKtg) interesting video by Shai Avidan and Ariel Shamir from MERL. They developed an extremely cool image resizing technique called *Seam Carving*. They explain all about it in [this paper](http://graphics.cs.cmu.edu/courses/15-463/2013_fall/hw/proj3-seamcarving/imret.pdf).

One of the coolest things about their idea is that it is easy to implement. I implemented a semi-optimized version of their algorithm in a couple of hours of coding. All the images in this post were generated by my code.

The following image of a pagoda will assist me in demonstrating the ideas to follow:

{% include image.html url="/assets/images/posts/seam_carving/pagoda.png" %}

First let's discuss the two most popular image resizing methods currently in use, namely *scaling* and *cropping*. Scaling consists of uniformly resizing the image. If for example we were to reduce an image 100 pixels wide to an image 50 pixels wide, we could simply average every two neighboring pixels (a generalization of this technique can be applied even when the image’s new width does not divide the image’s original width, and of course to resizing both the width and the height of the image).

Scaling is efficient and, in some sense, you do not lose a lot of information from the original image. There are two big problems with scaling however:

* If the new dimensions of the image are not proportionate to the original dimensions, the scaled image is distorted.
* The method does not take into account the contents of the image at all (I will clarify this point shortly).

An example of the pagoda image scaled:

{% include image.html url="/assets/images/posts/seam_carving/pagoda_scaled.png" %}

As you can see, the proportions of the pagoda aren't maintained and it and the background get distorted.

A second widely used form of image resizing is cropping. Cropping consists of simply selecting a sub image of the desired proportions from the original image – i.e. removing the borders of the image. An important question now arises: how do we select which box of the image to keep (or equivalently, how do we select which borders to remove)?

Let's say we assign a weight to each of the pixels of the image, representing its importance. Then selecting the cropping box amounts to simply selecting the box containing the pixels whose sum of weights is highest. We will refer to the weights of the pixels as the energy of the pixels. So optimal cropping would select the box with the highest energy.

Now, all we are left to do is assign the weights to the pixels. Following Avidan and Shamir, we can use simple gradient magnitude as our energy function. Gradient magnitude simply means calculating the gradient at each pixel (regarding the image as a function from $$\mathbb{R}_2$$ to $$\mathbb{R}$$) and taking its magnitude at each pixel. In a follow up paper ([Improved seam carving for video retargeting](http://www.eng.tau.ac.il/~avidan/papers/vidret.pdf)) Avidan and Shamir, together with Michael Rubinstein present the concept of *forward energy* which assigns to each pixel its gradient energy *after* removing it (otherwise by removing a pixel with low energy we might inadvertedly create a high energy pixel). This is the variant we'll use.

The perceptive reader would have noticed that a color image is usually a function from $$\mathbb{R}_2$$ to $$\mathbb{R}_3$$ and not to $$\mathbb{R}$$ (as there are usually three independent color channels). There are several ways to calculate the gradient magnitude in this case. The one I used in my code is to calculate the magnitudes of the three gradients separately and average the results. Note that averaging before calculating the gradients is a bad idea as a lot of information is lost in the process!

Note that the gradient magnitude of a pixel constitutes some measure of how likely that pixel is to be a border pixel (and thus more important).

Using all of this, an optimal cropping of the pagoda image is shown here:

{% include image.html url="/assets/images/posts/seam_carving/pagoda_cropped.png" %}

The cropping is optimal in the sense that this is the sub-image of the given dimensions containing the most energy.

Note that the city and the mountains in the background and the trees on the left of the image, and the smaller house to the very right of the image, are missing.

Now, unlike the scaling method, the cropping technique just presented takes into account the contents of the image. But what if the image contained two pagodas, one at each side of the image? Cropping would only be able to select one of them.

So what we are looking for is some way to automatically remove the uninteresting parts in the middle of the image, and bring the interesting bits closer together.

A naive solution, similar to regular cropping, would be to remove the columns of the image with the least amount of energy not necessarily from the border. This technique causes severe artifacts.

Avidan’s and Shamir’s seam carving technique is an improvement of this. They define a vertical seam as an 8-connected path from top-to-bottom of the image containing one pixel in each row. 8-connectedness means that if pixel (x,y) is in the vertical seam, then exactly one of the pixels (x-1, y+1), (x, y+1) or (x+1, y+1) is in the vertical seam as well (unless of course y = the height of the image). A horizontal seam is defined similarly.

Now instead of deleting the column (row) with the least energy, they suggest deleting the vertical (horizontal) seam with the least energy. The seam with the least energy can be easily found using dynamic programming.

The first seam to be removed in the pagoda image is depicted below:

{% include image.html url="/assets/images/posts/seam_carving/pagoda_min_seam.png" %}

And here we see the first 100 seams to be removed - note how the seams seems to cut out the less interesting details of the image:

{% include image.html url="/assets/images/posts/seam_carving/pagoda_min_seams.png" %}

The process of reducing an image’s size via repeated deletions of the least important seams is called *seam carving*. The result of applying some seam carving to the pagoda image is shown here:

{% include image.html url="/assets/images/posts/seam_carving/pagoda_carved.png" %}

Let's compare all three versions side by side - for convenience the carved version is in the middle (with the cropped version on the left and the scaled version on the right):

{% include image.html url="/assets/images/posts/seam_carving/pagoda_sxs.png" height=10 %}

Here we see the carving process animated:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/axs8iul1i3w" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Note that although some artifacts are present in the image, it is the best among all the reduced images (at least – a mon avis).

A problem with seam carving, compared to scaling, is efficiency. I have some algorithmic ideas that I think might substantially reduce computation costs (it takes my code a couple of seconds to carve an image of size 1000x1000). I will let you know when I will have time to test them.

### More Examples

Another pagoda example is shown. The original image:

{% include image.html url="/assets/images/posts/seam_carving/pagoda2.png" %}

And the three scaling methods:

{% include image.html url="/assets/images/posts/seam_carving/pagoda2_sxs.png" %}

And the animated carving:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/NbHiUgD70Gs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

And just to convince you that the method doesn’t only work on pagodas:

{% include image.html url="/assets/images/posts/seam_carving/city.png" %}

Some seams to removed:

{% include image.html url="/assets/images/posts/seam_carving/city_min_seams.png" %}

And the carved version:

{% include image.html url="/assets/images/posts/seam_carving/city_carved.png" %}

Side by side:

{% include image.html url="/assets/images/posts/seam_carving/city_sxs.png" %}

And the animation:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/8DE5m4n6TCE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Some surfing pics:

{% include image.html url="/assets/images/posts/seam_carving/surf.png" %}

The carved version:

{% include image.html url="/assets/images/posts/seam_carving/surf_carved.png" %}

The side-by-side comparison:

{% include image.html url="/assets/images/posts/seam_carving/surf_sxs.png" height=7 %}

And the animated version:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/rpLoLEYAmZE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Another surfing pic:

{% include image.html url="/assets/images/posts/seam_carving/two_surfers.png" height=7 %}

Note how the first seams go around all the important details in the image:

{% include image.html url="/assets/images/posts/seam_carving/two_surfers_min_seams.png" height=7 %}

And the carved version (which keeps both surfers):

{% include image.html url="/assets/images/posts/seam_carving/two_surfers_carved.png" %}

This is the best example of the strength of seam carving, compared to the other methods that do really badly here:

{% include image.html url="/assets/images/posts/seam_carving/two_surfers_sxs.png" height=7 %}

<iframe width="100%" height="315" src="https://www.youtube.com/embed/AYeHv9gWvCA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

And finally a couple of easier cases:

{% include image.html url="/assets/images/posts/seam_carving/jumping.png" %}

The carved version:

{% include image.html url="/assets/images/posts/seam_carving/jumping_carved.png" %}

And the animation:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/BHUyu7kulOI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

And finally this group of birds. This one I carved on both dimensions (horizontally and vertically). The original image:

{% include image.html url="/assets/images/posts/seam_carving/birds.png" %}

Scaled (note how the birds and the sun are small):

{% include image.html url="/assets/images/posts/seam_carving/birds_scaled.png" %}

And carved (note that the birds and the sun are bigger):

{% include image.html url="/assets/images/posts/seam_carving/birds_carved2.png" %}

And I'll leave you with this sunset side-by-side:

{% include image.html url="/assets/images/posts/seam_carving/birds_sxs.png" %}
