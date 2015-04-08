---
layout: post
title: Comparing Packings
date:   2015-03-12 13:30:00
categories: physics
---

# Comparing Packings

## The Problem

Imagine we have generated two sets of points, like the following:

![Packing-Example]({{ site.baseurl }}/assets/2015-03-12-packing-example.svg)

Now we want some pairing of points on the left with points on the right, so that they "match up".
More specifically, we want a pairing that minimizes the total distance between paired points.

#### Table Form

|  number in A  |→|  number in B  |
|:-------------:|-|:-------------:|
|       1       |→|       5       |
|       2       |→|       2       |
|       3       |→|       4       |
|       4       |→|       1       |
|       5       |→|       3       |

#### Image Form

![Packing-Example]({{ site.baseurl }}/assets/2015-03-12-packing-example-mapping.svg)

### The Question

How do we find that pairing such that we minimize the sum of distances?

### Mathematics

Let us define an *ordering tuple* to be a tuple $T:\left\\{ i\in T\forall i\in\left\\{ 1\ldots
N\right\\} \right\\} $. So $\left(1,2,3 \right)$ and $\left(3,1,2,4\right)$ are *ordering tuples*,
but $\left(3,1,2,3 \right)$ is not.

Now suppose we have two sets of points, $\vec r_i$ and $\vec s_i$, with $1 \le i \le N$.

We now want to find the *ordering tuple* $T$ that minimizes

$$
d^2 = \sum_{i=1}^N \left| \vec{r}_i - \vec{s}_{T_i} \right|^2
$$

where for each $i$, we have a location $$\vec{r}_i$$ and a "pairing" numbered $$T_i$$ at a location $$\vec{s}_{T_i}$$.

## The Solution

### Step 1: What does a solution even look like?

A solution is an *ordering tuple*, which in code can just be a list. In [my
code](https://github.com/wackywendell/parm/blob/06e9eef63cf2f5cbfbbf005fdbcd18ebddc44a95/src/constraints.hpp#L418-L444),
I just use a wrapper around `vec<uint>`, with a distance. Here is a simpler version of it:

{% highlight c++ %}
class Solution {
    public:
        vector<uint> assigned;
        flt distsq;
    [ ... ]
}
{% endhighlight %}

The distance (or distance squared, `distsq`) is simply $d^2$ from above.

Below, I'm going to use the form `([2, 0, 1], 10.3)`, where that corresponds to $\left\\{A_0
\rightarrow B_2, A_1 \rightarrow B_0, A_2 \rightarrow B_1 \right\\}$, with a total distance squared
$d^2 = 10.3$.

### Step 2: Djikstra's Algorithm

If you look at the form of the *solution*, you'll notice that it has a lot in common with a
path-finding algorithm: we want a list of "nodes" to visit, and the more nodes we visit, the greater
our distance — $d^2$ is monotonically increasing. This isn't *quite* a path-finding algorithm,
because we want to visit all nodes (i.e. assign every particle in $A$ to a particle in $B$), so its
close to the Traveling Salesman problem, but we can still use a similar solution.

We start with a Queue with one element in it:

    ([], 0.0)

Then we take out the first element, and "expand" it to try assigning every possible particle in $B$
to the  particle 0 in $A$, and put those back in our Queue, keeping it sorted by distance squared:

    ([3], 1.0),
    ([1], 9.0),
    ([2], 16.0),
    ([0], 25.0)

Now we repeat the process with the first element in our Queue:

    ([3, 2], 2.0),
    ([1], 9.0),
    ([2], 16.0),
    ([3, 0], 17.0),
    ([0], 25.0),
    ([3, 1], 29.0)

If we keep doing this, we might end up something like this:

    ([3, 2, 0, 1], 3.0),
    ([1], 9.0),
    ([2], 16.0),
    ([3, 0], 17.0),
    ([0], 25.0),
    ([3, 1], 29.0),
    ([3, 2, 1], 38.0)

And now we know the best pairing is $\left\\{A_0 \rightarrow B_3, A_1 \rightarrow B_2, A_2
\rightarrow B_0, A_3 \rightarrow B_1 \right\\}$, with $d^2 = 3$. Conveniently enough, the remainder
of our Queue is basically a proof that any other pairing would have a greater $d^2$ — for example,
any pairing including $A_0 \rightarrow B_1$ has $d^2 \ge 9$, so we don't have to investigate all 6
ways that could be the case.

## Extra Difficulties

### Translations

Now let's imagine our particles might not only be "unpaired", but possibly also shifted – so now we
want to find not just the best pairing, but the best (pairing, translation) to minimize $d^2$: We
now want to find the *ordering tuple* $T$ and vector $\vec \delta$ that minimizes

$$
d^2 = \sum_{i=1}^N \left| \vec{r}_i - \vec{s}_{T_i} - \vec{delta} \right|
$$

It turns out, this is simple: you subtract off the "center of mass" difference:

$$
\delta = \frac{1}{N}\sum_{i=1}^N \vec{r}_i - \vec{s}_{T_i}
$$

So we use the algorithm above, but add in that calculation first before calculating $d^2$.

### Periodic Boundary Conditions

In my case, we often want to deal with particles in a box with *periodic boundary conditions*, i.e.
a box where a particle that disappears on one side appears on the other. If we still have to
calculate the minimal (pairing, translation), we now have a problem: you can't use the center of
mass trick above, because there is no well-defined center-of-mass like that with periodic boundary
conditions.

To make a long story short, you can instead calculate $d^2$ in the following way, that is
independent of translations:

<!-- $$
\begin{align*}
d^{2} & =\sum_{i=1}^{N}\left(\vec{r}_{i}-\vec{s}_{i}\right)^{2}\\
 & =\frac{1}{N}\sum_{\left\langle i,j\right\rangle }\left(\vec{r}_{ij}-\vec{s}_{ij}\right)^{2}
\end{align*}
$$ -->

$$
d^{2} =\frac{1}{N}\sum_{\left\langle i,j\right\rangle }\left(\vec{r}_{ij} \ominus_\vec{L} \vec{s}_{ij}\right)^{2}
$$

where $\ominus_\vec{L}$ means "shortest distance given periodic boundary conditions in a box of
shape $\vec{L}$". In practice, this is defined like so:

{% highlight c++ %}
for(i=0; i<NUMBER_OF_DIMENSIONS; ++i){
    float dxi = r[i] - s[i];
    ominused[i] = dxi - remainder(dxi, L[i]);
}
{% endhighlight %}

Proving that the $d^2$ defined here for the periodic boundary conditions is equivalent to the
previous one is well outside the scope of this post, but for anyone interested, see
[here]({{site.baseurl}}/assets/2015-03-12-packingcomparisons.pdf), or the original [LyX
file]({{site.baseurl}}/assets/2015-03-12-packingcomparisons.lyx).

### Rotations

Now imagine that however you are generating these sets, sometimes they appear as rotated versions of
each other, and possibly even a mirror.

This is also fairly simple to handle:

 - Include in the `Solution` class a marker representing a *rotation*; for 2D, this only means
adding an `unsigned int` in the range 0--3 for rotations, or 0--8 for rotations and flips.
 
 - Include some code that handles the rotations while calculating the distances squared.
 
 - When you initialize the queue, include an empty pairing *for each rotation and flip*. That way,
each rotation and flip is already covered, and "expanding" only need add new points. Since an
"expansion" doesn't have to ever rotate, the distance are still monotonically increasing.

I have code that handles this
[here](https://github.com/wackywendell/parm/blob/06e9eef63cf2f5cbfbbf005fdbcd18ebddc44a95/src/constraints.hpp#L518-L601).
