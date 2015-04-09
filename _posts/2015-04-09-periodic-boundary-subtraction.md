---
layout: post
title: Subtraction and Periodic Boundary Conditions
date:   2015-04-09 18:00:00
categories: physics
---

# Subtraction and Periodic Boundary Conditions

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