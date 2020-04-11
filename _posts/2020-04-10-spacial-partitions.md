---
layout: post
title:  "Spacial Partitions"
date:   2020-04-10 15:00:00
excerpt: "A data structure for finding closest points in space."
categories: Computing
tags:  Computing Algorithms Data-Structures
image:
  feature: spacial_partitions.jpg
  topPosition: -100
bgContrast: light
bgGradientOpacity: lighter
syntaxHighlighter: yes
---
There are several important dimensions that determine *how good an algorithm is*. Maybe the three most important ones are ***time complexity***, ***memory complexity***, and ***code complexity***. Since in almost all problems you can trade one for one of the others, it's usually impossible to find a solution that is actually the best, in the sense that it optimizes all three. Once in a while though, you find a nice trade-off, with low time, memory, *and* code complexities. In this post I'll describe one such algorithm, for the problem of efficiently finding the closest point to a target point in a metric space. This problem has many partical uses (e.g. I use it extensively in my General Relativity Renderer - I hope to write a post about it soon, and, as we'll see, it's also useful for accelerating problems such as finding the closest word in the dictionary to a given word with spelling mistakes).

## An Example Problem
Say you have a set of points in the plane $$R^2$$:

{% include image.html url="/assets/images/posts/spacial_partitions/points.png" %}

You can do some preprocessing on them, and build some data-structure, such that when I give you a new target point in the plane (e.g. the red one):

{% include image.html url="/assets/images/posts/spacial_partitions/points_with_target.png" %}

You need to output the closest point from the original set (e.g. the one with the yellow highlight):

{% include image.html url="/assets/images/posts/spacial_partitions/points_with_target_and_solution.png" %}

## The Standard Solution
Depending on the parameters of the question, the well-known solutions to this problem are usually things like the [*k*-d tree](https://en.wikipedia.org/wiki/K-d_tree). A *k*-d tree is a binary tree, such that each node is associated with a [hyperplane](https://en.wikipedia.org/wiki/Hyperplane) that's orthogonal to one of the axes, and splits the set of points to those on one side of the hyperplane and those on the other side that hyperplane. A hyperplane is simply a plane of dimension one less than that of the space, so in the case of our $$R^2$$ example, a hyperplane is just a line:

{% include image.html url="/assets/images/posts/spacial_partitions/points_with_hyperplane.png" %}

And here is the same space after we added several such hyperplanes:

{% include image.html url="/assets/images/posts/spacial_partitions/points_with_hyperplanes.png" %}

Note BTW, that while the above diagram represents a possible *k*-d tree in $$R^2$$, it is under-specified - i.e. there can be several trees that share this diagram.

Now when a target point is given, like this red one:

{% include image.html url="/assets/images/posts/spacial_partitions/kdtree_search1.png" %}

It is first compared to the root node's hyperplane, and in this case it is determined that it is on its left side:

{% include image.html url="/assets/images/posts/spacial_partitions/kdtree_search2.png" %}

It is then recursively searched on the left side, comparing it to the root node's left child's hyperplane, here determined to be above it:

{% include image.html url="/assets/images/posts/spacial_partitions/kdtree_search3.png" %}

Now, you might say:

> Wait, we still need to check the other side of all the hyperplanes! It's possible that a point is to one side of a hyperplane, but the closest point to it is on the other side!

You'd be very right in saying so, as this diagram depicts:

{% include image.html url="/assets/images/posts/spacial_partitions/kdtree_search4.png" %}

But, note that due to the [triangle inequality](https://en.wikipedia.org/wiki/Triangle_inequality), all the points on the other side of the plane from a point are ***farther away from the point than the plane***. In other words, the *k*-d tree algorithm works:

```python
def find(tree, target):
  if tree.isLeaf(): return tree.point
  subtree_with_point, other_subtree = tree.get_subtree_with_point(target)
  closest = find(subtree_with_point, target)
  if distance(closest, target) < distance(closest, tree.hyperplane):
    return closest
  closest2 = find(other_subtree, target)
  if distance(closest, target) < distance(closest2, target):
    return closest
  return closest2
```

## Optimizations

### Multiple Points Per Leaf
One standard and simple optimization, is that instead of storing only a single point at each of the leafs, we can choose to store a vector of points of some length at each leaf. We would then stop constructing child nodes when a leaf has that number of points or less.
The adjustment to the pseudo-code above is trivial, we would just change one line:

```python
  if tree.isLeaf(): return tree.point
```

To:

```python
  if tree.isLeaf(): return closestPointInList(tree.points, target)
```

See the Benchmarking section below for some results of how this number affects the performance.

### Choosing the Hyperplanes
A much more important optimization comes from the way we choose the hyperplanes. So how should we chose which hyperplanes to use?

#### Good Hyperplanes
Let's consider two desirable traits for the chosen hyperplanes:
1. Most importantly, we'd like about half of the points to lie in each side of them. This criteria is obviously needed in order to get a logarithmic depth to the tree.
2. We'd like the points on each side of the hyperplane to be as far away as possible from the hyperplane. This criteria is important, as even if the tree has logarithmic depth, if the *find* algorithm above needs to explore both sides of the hyperplane often, it might run for more than a logarithmic number of steps.

For example, the root hyperplane in the example above is chosen poorly as most points lie to its left, violating desirability trait #1:

{% include image.html url="/assets/images/posts/spacial_partitions/bad_hyperplane.png" %}

While this one seems better:

{% include image.html url="/assets/images/posts/spacial_partitions/better_hyperplane.png" %}

#### Degrees of Freedom
When choosing the hyperplanes there are two things we are actually choosing:
1. Which axis the hyperplane will be perpendicular to ($$X$$, $$Y$$, or $$Z$$)?
2. What is the intersection point of the hyperplane and that plane?

We have several ways for choosing both. For #1, we could, at every node choose randomly between the axes, or we could choose in a round-robin fashion, or we could always choose the same axis (this one doesn't sound very promising), or we could choose based on a criteria that depends on the actual points (e.g. take the axis upon which the projection of the points in the child has the largest difference between the minimum and maximum, or the axis with the highest entropy, etc.). See the benchmarking section below for experiment results with many of these.

Once we chose the axis, we need to choose the intersection point. Here again we can employ several strategies: we can choose a random point from the set and take its projection on the axis as the intersection point, or we can choose the median point's projection instead of a random point (sounds more promising). Here too, see the benchmarking section below for experiment results with a couple of these.

## Supporting Volume
We discussed above supporting multiple points per leaf, instead of just a single point per leaf. Once we implement that, we can trivially add a really cool feature, that I found useful in several application: supporting *spheres* instead of *points*. Specifically, we want to allow each item that we insert to the tree to have a potentially non-zero radius. In order to enable that, it is enough to allow all nodes in the tree to contain items, not just the leafs, and whenever we add an item to the tree, if its sphere *intersects* the hyperplane (basically meaning it is both to the left and to the right of it) we simply keep it in the parent node, instead of in the child nodes.

## Beyond Hyperplanes
I got to program *k*-d trees several times for various projects, for example, for my General Relativity Path Tracer, I needed to detect the collision of light photons with millions of stars, and storing them in a *k*-d tree enabled rendering such images as this one:

{% include image.html url="/assets/images/posts/spacial_partitions/stars.jpg" %}

I will write a full post about that project at some point.

What I realized recently, and one of the coolest things imo in this post, is that there is a lot of arbitrariness in the fact that we're using axis-aligned hyperplanes for the *k*-d tree, in fact, there is a lot of arbitrariness in using hyperplanes altogether - we can actually use any [hypersurface](https://en.wikipedia.org/wiki/Hypersurface). For example:

{% include image.html url="/assets/images/posts/spacial_partitions/arbitrary_hypersurface.png" %}

Hyperplanes, and specifically axis-aligned hyperplanes have the huge benefit that it is very easy to calculate which side of them a point lies and the distance between them to the point. And while this might be hard to do for arbitrary hypersurfaces, for some hypersufaces this is easy. For example, it's super easy to calculate both of the above for spheres:

{% include image.html url="/assets/images/posts/spacial_partitions/sphere_example.png" %}

Taking this idea one step further, there is even arbitrariness in requiring a Euclidean space at all. Really what the above reasoning relies on is simply the properties of a [metric space](https://en.wikipedia.org/wiki/Metric_space). The triangle-inequality implies that all the points on the other side of a hypersurface from a point are ***farther away from the point than the hypersurface***. Recall that the distance of a point from a hypersurface is just:

$$D(p, s) = \min\{|x-p| \mid x \in s\}$$

Nit note: since we are dealing with closed hypersurfaces in $$R^n$$, the formula above actually gets its minimum value.

Taking a step back - we can actually get the above data structure to work without mapping the items to points in some Euclidean space, but rather keeping them in an arbitrary metric space!

For example, note that the [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) satisfies all the requirements for being a metric:
1. $$d(s1, s2) \ge 0$$
2. $$d(s1, s2) = 0 \Leftrightarrow s1 = s2$$
3. $$d(s1, s2) = d(s2, s1)$$
4. $$d(s1, s2) + d(s2, s3) \le d(s1, s3) \text{(triangle inequality)}$$

So we could use this same spacial partitioning data structure (it's no longer a *k*-d tree really) to index all the words in the dictionary and efficiently find the closest word to a given word with potential spelling errors!

Of course in a general metric space, the notions of *axes* and *hyperplanes* don't exist, so we can't use them as our hypersurfaces. But we can still use spheres!

## Implementation

Here is my implementation of the spacial partition data structure in C++:

```c++
#pragma once

#include <cmath>
#include <memory>
#include <numeric>
#include <optional>
#include <vector>

#include "logging.h"
#include "str_util.h"
#include "vec3.h"

namespace spacial_partition {

template <class T, class Compare>
size_t MedianIndexAndPartialSort(std::vector<T>& v,
                                 const Compare& comp = std::less<T>()) {
  size_t median_index = v.size() / 2;
  std::nth_element(v.begin(), v.begin() + median_index, v.end(), comp);
  return median_index;
}

// Non-negative distance between two points to be compared.
template <class ValueType>
using DistanceFunc = float (*)(const ValueType&, const ValueType&);

// Returns negative or positive depending on which
template <class HypersurfaceType, class ValueType>
using RelationToHypersurfaceFunc = float (*)(const HypersurfaceType&,
                                             const ValueType&);

template <class ValueType>
using GetPositionFunc = vec3 (*)(const ValueType&);

template <class ValueType>
using GetRadiusFunc = float (*)(const ValueType&);

template <class ValueType>
vec3 ValueTypeIsConvertibleToPoint(const ValueType& v) {
  return v;
}

template <class ValueType>
float ZeroRadius(const ValueType& t) {
  return 0;
}

float GetVec3Dist(const vec3& v1, const vec3& v2) { return dist(v1, v2); }
float GetEditDist(const std::string& s1, const std::string& s2) {
  return EditDistance(s1, s2);
}

struct AxisAlignedHyperplane {
  vec3::Axis axis = vec3::X;
  float value;

  std::string str() const {
    return std::string("AxisAlignedHyperplane(") + to_string(axis) + " <> " +
           std::to_string(value) + ")";
  }

  template <class ValueType,
            GetPositionFunc<ValueType> PositionGetter =
                ValueTypeIsConvertibleToPoint<ValueType>,
            GetRadiusFunc<ValueType> RadiusGetter = ZeroRadius<ValueType>>
  static float relationToItem(const AxisAlignedHyperplane& hyperplane,
                              const vec3& item) {
    float item_value_in_axis = item[hyperplane.axis];
    float distance_from_pivot_in_axis = item_value_in_axis - hyperplane.value;
    if (std::abs(distance_from_pivot_in_axis) >= RadiusGetter(item)) {
      return distance_from_pivot_in_axis;
    } else {
      return 0;  // item intersects the hyperplane.
    }
  }
};

template <class ValueType>
struct SphereHypersurface {
  ValueType center;
  float radius;

  std::string str() const {
    return std::string("SphereHypersurface(center: ") + center +
           ", radius: " + std::to_string(radius) + ")";
  }

  template <DistanceFunc<ValueType> Distance,
            GetRadiusFunc<ValueType> RadiusGetter = ZeroRadius<ValueType>>
  static float relationToItem(const SphereHypersurface& sphere,
                              const ValueType& item) {
    float distance_from_center = Distance(item, sphere.center);
    float distance_from_sphere_border = distance_from_center - sphere.radius;
    if (std::abs(distance_from_sphere_border) >= RadiusGetter(item)) {
      return distance_from_sphere_border;
    } else {
      return 0;  // item intersects the bounding sphere.
    }
  }
};

template <class ValueType = vec3, GetPositionFunc<ValueType> GetPosition =
                                      ValueTypeIsConvertibleToPoint<ValueType>>
struct AxisComparator {
  AxisComparator(vec3::Axis axis) : axis(axis) {}
  vec3::Axis axis;
  bool operator()(const ValueType& a, const ValueType& b) {
    return GetPosition(a)[axis] < GetPosition(b)[axis];
  }
};

template <class ValueType = vec3, GetPositionFunc<ValueType> GetPosition =
                                      ValueTypeIsConvertibleToPoint<ValueType>>
struct MaxSpreadAxisSelector {
  vec3::Axis selectAxis(const std::vector<ValueType>& items) const {
    std::vector<float> xs, ys, zs;
    for (const ValueType& item : items) {
      const vec3 pos = GetPosition(item);
      xs.push_back(pos.x);
      ys.push_back(pos.y);
      zs.push_back(pos.z);
    }
    float x_spread = spread(xs);
    float y_spread = spread(ys);
    float z_spread = spread(zs);
    if (x_spread > y_spread && x_spread > z_spread) {
      return vec3::X;
    } else if (y_spread > z_spread) {
      return vec3::Y;
    } else {
      return vec3::Z;
    }
  }

  MaxSpreadAxisSelector child() const { return *this; }

 private:
  static float spread(const std::vector<float>& v) {
    const auto [min, max] = std::minmax_element(begin(v), end(v));
    return *max - *min;
  }
};

template <class ValueType = vec3, GetPositionFunc<ValueType> GetPosition =
                                      ValueTypeIsConvertibleToPoint<ValueType>>
struct XAxisSelector {
  vec3::Axis selectAxis(const std::vector<ValueType>& items) const {
    return vec3::X;
  }

  XAxisSelector child() const { return *this; }
};

template <class ValueType = vec3, GetPositionFunc<ValueType> GetPosition =
                                      ValueTypeIsConvertibleToPoint<ValueType>>
struct RandomAxisSelector {
  vec3::Axis selectAxis(const std::vector<ValueType>& items) const {
    return vec3::Axis(std::rand() % 3);
  }

  RandomAxisSelector child() const { return *this; }
};

template <class ValueType = vec3, GetPositionFunc<ValueType> GetPosition =
                                      ValueTypeIsConvertibleToPoint<ValueType>>
struct RoundRobinAxisSelector {
  vec3::Axis axis = vec3::X;
  vec3::Axis selectAxis(const std::vector<ValueType>& items) const {
    return axis;
  }

  RoundRobinAxisSelector child() const {
    return RoundRobinAxisSelector{vec3::Axis((axis + 1) % 3)};
  }
};

template <class ValueType = vec3, class AxisSelector = RoundRobinAxisSelector<>,
          GetPositionFunc<ValueType> PositionGetter =
              ValueTypeIsConvertibleToPoint<ValueType>>
struct AxisAlignedHyperplaneSelector {
  AxisSelector axis_selector;

  typedef AxisAlignedHyperplane Hypersurface;

  AxisAlignedHyperplane selectHypersurface(
      std::vector<ValueType>& items) const {
    vec3::Axis axis = axis_selector.selectAxis(items);
    AxisComparator<ValueType> cmp(axis);
    int median_index = MedianIndexAndPartialSort(items, cmp);
    ValueType median_item = items[median_index];
    float value = PositionGetter(median_item)[axis];
    return AxisAlignedHyperplane{axis, value};
  }

  AxisAlignedHyperplaneSelector child() const {
    return AxisAlignedHyperplaneSelector{axis_selector.child()};
  }
};

template <class ValueType = vec3, class AxisSelector = RoundRobinAxisSelector<>,
          GetPositionFunc<ValueType> PositionGetter =
              ValueTypeIsConvertibleToPoint<ValueType>>
struct RandomAxisAlignedHyperplaneSelector {
  AxisSelector axis_selector;

  using Hypersurface = AxisAlignedHyperplane;

  AxisAlignedHyperplane selectHypersurface(
      std::vector<ValueType>& items) const {
    int index = std::rand() % items.size();
    const ValueType& item = items[index];
    vec3::Axis axis = axis_selector.selectAxis(items);
    float value = PositionGetter(item)[axis];
    return AxisAlignedHyperplane{axis, value};
  }

  RandomAxisAlignedHyperplaneSelector child() const {
    return RandomAxisAlignedHyperplaneSelector{axis_selector.child()};
  }
};

template <class ValueType = vec3,
          DistanceFunc<ValueType> Distance = GetVec3Dist>
struct HalfMaxDistSphereSelector {
  using Hypersurface = SphereHypersurface<ValueType>;

  Hypersurface selectHypersurface(std::vector<ValueType>& items) const {
    int index = std::rand() % items.size();
    const ValueType& pivot_item = items[index];
    float max_dist = 0;
    for (const ValueType& item : items) {
      float cur_dist = Distance(item, pivot_item);
      max_dist = std::max(max_dist, cur_dist);
    }
    float radius = max_dist / 2;
    return SphereHypersurface<ValueType>{pivot_item, radius};
  }

  HalfMaxDistSphereSelector child() const {
    return HalfMaxDistSphereSelector{};
  }
};

template <class ValueType = vec3,
          DistanceFunc<ValueType> Distance = GetVec3Dist>
struct DistanceFromFixedElementComparator {
  DistanceFromFixedElementComparator(const ValueType& pivot) : pivot(pivot) {}
  ValueType pivot;
  bool operator()(const ValueType& a, const ValueType& b) {
    return Distance(pivot, a) < Distance(pivot, b);
  }
};

template <class ValueType = vec3,
          DistanceFunc<ValueType> Distance = GetVec3Dist>
struct MedianDistSphereSelector {
  using Hypersurface = SphereHypersurface<ValueType>;

  Hypersurface selectHypersurface(std::vector<ValueType>& items) const {
    int index = std::rand() % items.size();
    const ValueType& pivot_item = items[index];

    int median_index = MedianIndexAndPartialSort(
        items,
        DistanceFromFixedElementComparator<ValueType, Distance>(pivot_item));
    float median_dist = Distance(pivot_item, items[median_index]);
    float radius = median_dist;
    return SphereHypersurface<ValueType>{pivot_item, radius};
  }

  MedianDistSphereSelector child() const { return MedianDistSphereSelector{}; }
};

template <int Size>
struct SplitSize {
  // TODO: think about this.
  static_assert(Size >= 3, "Size must be at least 3");
  const static int size = Size;
};

template <
    class ValueType = vec3, class Hypersurface = AxisAlignedHyperplane,
    class HypersurfaceSelector = AxisAlignedHyperplaneSelector<
        ValueType, RoundRobinAxisSelector<ValueType>>,
    RelationToHypersurfaceFunc<Hypersurface, ValueType> RelationToHypersurface =
        AxisAlignedHyperplane::relationToItem<ValueType>,
    DistanceFunc<ValueType> Distance = GetVec3Dist,
    class MaxSplit = SplitSize<32>>
class SpacialTree {
  // TODO: how to do this?
  // static_assert(std::is_same(Hypersurface,
  //                            HypersurfaceSelector::Hypersurface)::value,
  //               "Inconsistent Hypersurface and HypersurfaceSelector.");

 public:
  void fromVector(const std::vector<ValueType>& vec) {
    for (const auto& item : vec) {
      addChild(item);
    }
    compile();
  }

  void addChild(const ValueType& child) {
    CHECK(!_compiled) << "Trying to add elements after tree compilation";
    items.push_back(child);
  }

  SpacialTree* left() {
    if (!_left) {
      _left = std::make_unique<SpacialTree>();
    }
    return _left.get();
  }

  SpacialTree* right() {
    if (!_right) {
      _right = std::make_unique<SpacialTree>();
    }
    return _right.get();
  }

  void compile(const HypersurfaceSelector& hypersurface_selector =
                   HypersurfaceSelector()) {
    _compiled = true;
    if (items.size() <= MaxSplit::size) {
      return;
    }
    hypersurface = hypersurface_selector.selectHypersurface(items);
    compileGivenHypersurface(hypersurface_selector);
  }

  void compileGivenHypersurface(
      const HypersurfaceSelector& hypersurface_selector =
          HypersurfaceSelector()) {
    std::vector<ValueType> new_items;
    // Note: although MaxSplit.size should be >= 3, it's still possible for one
    // or even both of the subtrees to not be created (if using radii > 0).
    for (int i = 0; i < items.size(); ++i) {
      const ValueType& item = items[i];

      float relation_to_item = RelationToHypersurface(*hypersurface, item);
      if (relation_to_item < 0) {
        left()->addChild(item);
      } else if (relation_to_item > 0) {
        right()->addChild(item);
      } else {
        new_items.push_back(item);
      }
    }
    items = new_items;
    if (_left != 0) {
      _left->compile(hypersurface_selector.child());
    }
    if (_right != 0) {
      _right->compile(hypersurface_selector.child());
    }
  }

  struct ItemWithDistance {
    ValueType item;
    float distance = std::numeric_limits<float>::max();

    std::string str() const {
      return std::string("ItemWithDistance(") + item +
             ", dist: " + std::to_string(distance) + ")";
    }
  };

  ItemWithDistance findClosest(const ValueType& target) const {
    CHECK(_compiled) << "Trying to use SpacialTree without compiling it first.";
    ItemWithDistance res;
    for (const ValueType& item : items) {
      float distance = std::max<float>(0, Distance(item, target));
      if (distance < res.distance) {
        res.distance = distance;
        res.item = item;
        if (res.distance == 0) return res;
      }
    }
    if (hypersurface.has_value()) {
      SpacialTree* subtree = _left.get();
      SpacialTree* other_subtree = _right.get();

      float relation_to_item = RelationToHypersurface(*hypersurface, target);
      if (relation_to_item > 0) {
        subtree = _right.get();
        other_subtree = _left.get();
      }
      if (subtree != nullptr) {
        ItemWithDistance subtree_res = subtree->findClosest(target);
        if (subtree_res.distance < res.distance) {
          res = subtree_res;
          if (res.distance == 0) return res;
        }
      }
      if (other_subtree != nullptr &&
          std::abs(relation_to_item) < res.distance) {
        ItemWithDistance other_subtree_res = other_subtree->findClosest(target);
        if (other_subtree_res.distance < res.distance) {
          res = other_subtree_res;
        }
      }
    }
    return res;
  }

  std::string str(int depth = 0) const {
    std::string res = std::string(depth, ' ');
    if (hypersurface.has_value()) {
      res += hypersurface->str() + "\n";
    }
    if (_left != 0) {
      res += std::string(depth, ' ') + "left:\n" + _left->str(depth + 1);
    }
    if (_right != 0) {
      res += std::string(depth, ' ') + "right:\n" + _right->str(depth + 1);
    }
    if (items.size() > 0) {
      res += std::to_string(items.size()) +
             " items:" + JoinAsStrings<ValueType>(items) + "\n";
    }
    return res;
  }

 private:
  std::vector<ValueType> items;
  std::optional<Hypersurface> hypersurface;
  std::unique_ptr<SpacialTree> _left;
  std::unique_ptr<SpacialTree> _right;
  bool _compiled = false;
};

template <class AxisSelector, class MaxSplit = SplitSize<32>>
using CustomVec3KDTree =
    SpacialTree<vec3, AxisAlignedHyperplane,
                AxisAlignedHyperplaneSelector<vec3, AxisSelector>,
                AxisAlignedHyperplane::relationToItem<vec3>, GetVec3Dist,
                MaxSplit>;

using Vec3KDTree = CustomVec3KDTree<RoundRobinAxisSelector<>>;
using Vec3VPTree = SpacialTree<
    vec3, SphereHypersurface<vec3>, MedianDistSphereSelector<vec3, GetVec3Dist>,
    SphereHypersurface<vec3>::relationToItem<GetVec3Dist, ZeroRadius<vec3>>,
    GetVec3Dist, SplitSize<32>>;

using StringVPTree =
    SpacialTree<std::string, SphereHypersurface<std::string>,
                MedianDistSphereSelector<std::string, GetEditDist>,
                SphereHypersurface<std::string>::relationToItem<
                    GetEditDist, ZeroRadius<std::string>>,
                GetEditDist, SplitSize<1024>>;

}  // namespace spacial_partition
```

So how would this be used? Here's an example:

```c++
spacial_partition::Vec3KDTree tree;
tree.fromVector(vector_of_vec3s);
vec3 target = ...;
vec3 closest = tree.findClosest(target);
```

And how about using it for finding the closest string from a dictionary?

```c++
std::vector<std::string> words;
LoadWordsFromDictionary(&words);
spacial_partition::StringVPTree tree;
tree.fromVector(words);
tree_closest = tree.findClosest("Yaniv").item;
std::cerr << "The closest word in the dictionary to 'Yaniv' is: " << tree_closest << std::endl;
```

## Benchmarking
So how does this implementation compare to trivial baselines (of basically just iterating over the data and taking the closest point, with only minor optimizations, like bailing early as soon as a point of distance 0 is found)?
For practical applications, where indeed finding the closest point is the bottleneck, the above code can be *much* further optimized. That said, most optimizations would require hurting the complexity of the code. As it turns out, this implementation already performs orders of magnitude better than the trivial approach (at least in the Euclidean case).

### Results
#### Trees in Euclidean Spaces
So here are the results for indexing 10,000 points in $$R^3$$ and performing 10,000 finds:

{% include image.html url="/assets/images/posts/spacial_partitions/results.png" %}

For calibration, on my setup, creating the 10,000 random vec3s took 0.001 seconds (or 1 milli second).
The rest of the columns represent several tree configurations. The number in red is the cost of building the tree, and the number in blue is the cost of performing the 10K *find-closest* operations. The baseline algorithm, has 0 build cost, and takes 2.7 seconds to perform 10K *find-closest* operations.
The best performing tree in this setup is the round-robin axis aligned tree, with a total cost of 0.07 seconds for the 10K operations (including the building time). Building it costs only 2.3 milliseconds. The random-pivot tree and the max-spread tree perform very similarly. Interestingly, the sphere-tree (that completely ignores the fact that the points are in a Euclidean space) and chooses random pivots, performs really well - less than twice as bad as the round-robin tree.
Also, interestingly, the x-axis only tree (which basically ignores the y and z coordinates completely and just binary-sorts all the points according to their X-coordinate) performs much worse than all of the other tree configurations, but still about an order of magnitude better than the baseline approach (0.36 seconds vs 2.7 seconds for the baseline approach).

#### Closest Dictionary String
What about the performance of the data-structure for finding the closest strings in the dictionary?

For this experiment I used a dictionary with 194,000 English words (from [here](http://www.gwicks.net/dictionaries.htm)). I built the index, and performed 100 closest-word lookups (this was so slow, with such a huge dict, that I only had patience to run 100 iterations). For the target strings, I used random strings of uniform random length between 3 and 10.

Here are the results:

{% include image.html url="/assets/images/posts/spacial_partitions/results_dict.png" %}

As you can see, this elegant implementation already does much better than the naive approach! There are specialized algorithms for this problem of finding the closest string in a dictionary like [SymSpell](https://github.com/wolfgarbe/SymSpell), [LinSpell](https://github.com/wolfgarbe/LinSpell), or [Norvig's algorithm](https://norvig.com/spell-correct.html), but for their gains in time complexity, they pay heavily in memory and code complexity.

## Appendix - Calculating Levenshtein distance

I originally wrote a trivial recursive (without memoization) Levenshtein distance implementation:

```c++
int EditDistanceNaive(const std::string& s1, const std::string& s2,
                             int len1 = -1, int len2 = -1) {
  if (len1 == -1) len1 = s1.length();
  if (len2 == -1) len2 = s2.length();

  // If s1 is empty, insert all characters of s2.
  if (len1 == 0) return len2;

  // If s2 is empty, remove all characters of s1.
  if (len2 == 0) return len1;

  // If the last characters of two strings are same, ignore them.
  if (s1[len1 - 1] == s2[len2 - 1])
    return EditDistanceNaive(s1, s2, len1 - 1, len2 - 1);

  // If the last characters are different, consider all three
  // operations on the last character of s1 by recursing and take the minimum.
  return 1 + std::min({
                 EditDistanceNaive(s1, s2, len1, len2 - 1),     // Insert.
                 EditDistanceNaive(s1, s2, len1 - 1, len2),     // Remove.
                 EditDistanceNaive(s1, s2, len1 - 1, len2 - 1)  // Replace.
             });
}
```

This was so slow, I couldn't run anything but the most trivial of experiments. So I wrote this better implementation that the above experiments use:

```c++
inline const size_t EDIT_DISTANCE_MAX_STRING_LEN = 1024;
class EditDistanceMatrix {
 public:
  char& operator()(int i1, int i2) { return data[i2][i1]; }
  // char& operator()(int i1, int i2) { return data[i2 % 2][i1]; }

 private:
  char data[EDIT_DISTANCE_MAX_STRING_LEN][EDIT_DISTANCE_MAX_STRING_LEN];
};

inline int min(int a, int b, int c) { return std::min(a, std::min(b, c)); }

inline int EditDistanceNoCache(const std::string& s1, const std::string& s2) {
  CHECK(s1.length() < EDIT_DISTANCE_MAX_STRING_LEN)
      << "The first string must have length <" << EDIT_DISTANCE_MAX_STRING_LEN
      << " (its length is " << s1.length() << ")";

  EditDistanceMatrix matrix;

  for (int i2 = 0; i2 <= s2.length(); ++i2) {
    for (int i1 = 0; i1 <= s1.length(); ++i1) {
      if (i2 == 0) {
        matrix(i1, i2) = i1;
      } else if (i1 == 0) {
        matrix(i1, i2) = i2;
      } else if (s1[i1 - 1] == s2[i2 - 1]) {
        matrix(i1, i2) = matrix(i1 - 1, i2 - 1);
      } else {
        matrix(i1, i2) = 1 + min(matrix(i1 - 1, i2), matrix(i1, i2 - 1),
                                 matrix(i1 - 1, i2 - 1));
      }
    }
  }
  return matrix(s1.length(), s2.length());
}
```

Finally, since during tree building I am sometimes calculating the distance between the same pair of strings, I wrapped the above with a version that can cache the results (this is the reason for the *NoCache* suffix).

Hope you enjoyed reading this as much as I enjoyed writing it!
