---
layout: post
title: Subtraction and Periodic Boundary Conditions
date:   2015-04-09 18:00:00
categories: physics
---

If you have two points, and periodic boundary conditions, and you want to know the closest distance vector between them, that's easy to write in python:

{% highlight python %}
import numpy as np
[...]
dr = np.remainder(r1 - r2 + L/2., L) - L/2.
{% endhighlight %}

If you have a set of, say, 10 points, and you want to know the distance between all 55 pairs of them, that's still not too complicated:


{% highlight python %}
def dists(rs, L):
    """
    Returns the difference vectors between all pairs of points in rs, given a periodic box of size L.

    Parameters
    ----------
    rs : (N,d) array_like
         Input vectors
    L : (d,) array_like, or scalar
    Size of the box

    Returns
    -------
    out : (N,N,d) ndarray
    Where out[i,j,:] is the difference vector between rs[i,:] and rs[j,:]
    """
    diffs = np.array([np.subtract.outer(rd, rd) for rd in rs.T]).T
    return np.remainder(diffs + L/2., L) - L/2.
{% endhighlight %}

Note that the above function is really only two lines, yet it has some nice properties: 

 * It takes vectors of any length `d`
 * Its vectorized, aside from the splitting by dimension (the list comprehension)
 * The box size can be a single float, or a vector for rectangular-but-not-square boxes
 
## In Matlab

We can do something similar in Matlab:

{% highlight matlab %}
function dr = dists2(rs, L)
    % Returns the difference vectors between all pairs of points in rs, 
    % given a periodic box of size L.
    % 
    % rs : (N,d), Input vectors
    % L : scalar, Size of the box
    % 
    % Returns
    % -------
    % out : (N,N,d),
    % Where out(i,j,:) is the difference vector between rs(i,:) and rs(j,:)
    [N,d] = size(rs);
    out = zeros(N,N,d);
    for i = 1:d
        x = rs(:,i);
        out(:,:,i) = bsxfun(@minus, x, x');
    end
    dr = mod(out + L/2, L) - L/2;
end
{% endhighlight %}

The matlab code has about 8 lines to Python's 2, and also can't handle non-square boxes, but it is also using vectorized operations and any number of dimensions.

## Benchmarking

Out of curiosity, I benchmarked these two functions:

|Input size (`rs`) | Matlab    | Python |
|:-----------------|----------:|-------:|
|`100 x 3`         |  0.7 ms   |  2.6 ms|
|`200 x 3`         |  2.5 ms   |  8.3 ms|
|`500 x 3`         | 18.2 ms   | 60.8 ms|
|`1000 x 3`        | 83.3 ms   |288.0 ms|

Matlab clearly has the upper hand, by a factor of ~3.

## Python Update

We can also do a nice broadcasting method:

{% highlight python %}
def dists3(rs, L):
    diffs = rs[..., np.newaxis] - rs.T[np.newaxis, ...]
    diffs = np.rollaxis(diffs, -1, -2)
    return np.remainder(diffs + L/2., L) - L/2.
{% endhighlight %}

Note that we had to add in a call to `np.rollaxis` here, which converts `diffs`
from $N \times d \times N$ to $N \times N \times d$, and allows us to broadcast
over the adding `L` in the case where `L` is not a scalar.

We can also extend this to a pairwise function for comparing two different sets
of particles:

{% highlight python %}
def pair_dists(rs1, rs2, L):
    N,d = np.shape(rs)
    diffs = rs1[..., np.newaxis] - rs2.T[np.newaxis, ...]
    diffs = np.rollaxis(diffs, -1, -2)
    return np.remainder(diffs + L/2., L) - L/2.
{% endhighlight %}

And if our two pairs of particles may have had a center-of-mass motion that we
want to ignore, we can calculate

$$
d^{2} = \sum_i \left(\vec{r}_{i} \ominus_\vec{L} \vec{s}_{i} - \vec{\delta}\right)^2
$$

where $\ominus_\vec{L}$ means "shortest distance given periodic boundary
conditions in a box of shape $\vec{L}$," and $\vec{\delta}$ is the center-of-mass
motion. It turns out that this is equal to

$$
d^2 = \frac{1}{N}\sum_{\left\langle i,j\right\rangle }\left(\vec{r}_{ij} \ominus_\vec{L} \vec{s}_{ij}\right)^2
$$

The reason this math works (and the $\vec \delta$ drops out!) is talked about a
bit more in [this post]({% post_url 2015-03-12-packing-comparisons %}). The Python function for this is as follows:

{% highlight python %}
def pair_dist(rs1, rs2, L):
    """
    Returns the total distance between pairs of points in rs1 and rs2, given a 
    periodic box of size L. Ignores overall translation.
    """
    dists1 = (rs1[..., np.newaxis] - rs1.T[np.newaxis, ...])
    dists2 = (rs2[..., np.newaxis] - rs2.T[np.newaxis, ...])
    rij_minus_sij = np.rollaxis(dists1 - dists2, -1, -2)
    rij_minus_sij = ((rij_minus_sij + L/2.) % L) - L/2.
    dist_sqs = np.triu(np.sum(rij_minus_sij**2, axis=-1))
    return np.sqrt(np.sum(dist_sqs) / len(rs1))
{% endhighlight %}
