---
layout: post
title: Random Rotation Matrix in Python
date:   2015-05-12 09:00:00
categories: python
---

Making a random rotation matrix is somewhat hard. You can't just use "random elements"; that's not a random matrix. 

## First attempt: Rotate around a random vector

My first thought was the following:

 1. Pick a random axis $$\hat u$$, by getting three Gaussian-distributed numbers, calling them `x`, `y`, and `z`, and then taking the norm of that vector.
 2. Pick a random angle in the range $$0 \le \theta < 2 \pi $$.
 3. Rotate your original vector $$\vec v$$ around $$\hat u$$ by $$\theta$$.

That's accomplished with the following code:
        
{% highlight python %}
# Preliminaries
import numpy as np
v = np.array([0,0,2]) # or whatever you need

# Step 1
axis = np.random.standard_normal((3,))
axis /= np.linalg.norm(axis)

# Step 2
theta = np.random.uniform(0, 2*np.pi)

# Step 3
def rotate(vec, axis, angle):
    """Rodrigues rotation formula"""
    # TODO: Test this
    axis = axis / np.linalg.norm(axis)
    term1 = vec * np.cos(angle)
    term2 = (np.cross(axis, vec)) * np.sin(angle)
    term3 = axis * ((1 - np.cos(angle)) * axis.dot(vec))
    return term1 + term2 + term3
    
rotated = rotate(v, axis, theta)
{% endhighlight %}

Unfortunately, **this does not give you a uniformly rotated vector*:* you end up where you started too often.

## Second attempt: *Uniform* Random Rotation Matrix

If we want a *uniformly distriuted* rotation, that's a little trickier than the above. There's a [Wikipedia article section](en.wikipedia.org/wiki/Rotation_matrix#Uniform_random_rotation_matrices) on it, but its not too helpful.

Instead, I found [some C code](http://www.realtimerendering.com/resources/GraphicsGems/gemsiii/rand_rotation.c) from a book called "Graphics Gems III".

Then, I started with a direct translation of the C code:

{% highlight python %}
def rand_rotation_matrix(deflection=1.0):
    """
    Creates a random rotation matrix.
    
    deflection: the magnitude of the rotation. For 0, no rotation; for 1, competely random rotation. Small
    deflection => small perturbation.
    """
    # from http://www.realtimerendering.com/resources/GraphicsGems/gemsiii/rand_rotation.c
    
    theta = np.random.uniform(0, 2.0*deflection*np.pi) # Rotation about the pole (Z).
    phi = np.random.uniform(0, 2.0*np.pi) # For direction of pole deflection.
    z = np.random.uniform(0, 2.0*deflection) # For magnitude of pole deflection.
    
    # Compute a vector V used for distributing points over the sphere
    # via the reflection I - V Transpose(V).  This formulation of V
    # will guarantee that if x[1] and x[2] are uniformly distributed,
    # the reflected points will be uniform on the sphere.  Note that V
    # has length sqrt(2) to eliminate the 2 in the Householder matrix.
    
    r  = np.sqrt(z)
    Vx, Vy, Vz = V = (
        np.sin(phi) * r,
        np.cos(phi) * r,
        np.sqrt(2.0 - z)
    )

    # Compute the row vector S = Transpose(V) * R, where R is a simple
    # rotation by theta about the z-axis.  No need to compute Sz since
    # it's just Vz.

    st = sin(theta)
    ct = cos(theta)
    Sx = Vx * ct - Vy * st
    Sy = Vx * st + Vy * ct

    # Construct the rotation matrix  ( V Transpose(V) - I ) R, which
    # is equivalent to V S - R.

    M = np.array((
            (
                Vx * Sx - ct,
                Vx * Sy - st,
                Vx * Vz
            ),
            (
                Vy * Sx + st,
                Vy * Sy - ct,
                Vy * Vz
            ),
            (
                Vz * Sx,
                Vz * Sy,
                1.0 - z   # This equals Vz * Vz - 1.0
            )
            )
    )
    return M
{% endhighlight %}

Then I did a more Pythonic version, using `numpy` arrays more to their potential, and adding an option to use pre-generated random numbers:

{% highlight python %}
def rand_rotation_matrix(deflection=1.0, randnums=None):
    """
    Creates a random rotation matrix.
    
    deflection: the magnitude of the rotation. For 0, no rotation; for 1, competely random
    rotation. Small deflection => small perturbation.
    randnums: 3 random numbers in the range [0, 1]. If `None`, they will be auto-generated.
    """
    # from http://www.realtimerendering.com/resources/GraphicsGems/gemsiii/rand_rotation.c
    
    if randnums is None:
        randnums = np.random.uniform(size=(3,))
        
    theta, phi, z = randnums
    
    theta = theta * 2.0*deflection*np.pi  # Rotation about the pole (Z).
    phi = phi * 2.0*np.pi  # For direction of pole deflection.
    z = z * 2.0*deflection  # For magnitude of pole deflection.
    
    # Compute a vector V used for distributing points over the sphere
    # via the reflection I - V Transpose(V).  This formulation of V
    # will guarantee that if x[1] and x[2] are uniformly distributed,
    # the reflected points will be uniform on the sphere.  Note that V
    # has length sqrt(2) to eliminate the 2 in the Householder matrix.
    
    r = np.sqrt(z)
    Vx, Vy, Vz = V = (
        np.sin(phi) * r,
        np.cos(phi) * r,
        np.sqrt(2.0 - z)
        )
    
    st = np.sin(theta)
    ct = np.cos(theta)
    
    R = np.array(((ct, st, 0), (-st, ct, 0), (0, 0, 1)))
    
    # Construct the rotation matrix  ( V Transpose(V) - I ) R.
    
    M = (np.outer(V, V) - np.eye(3)).dot(R)
    return M
{% endhighlight %}

This method does a much better job of creating a uniform distribution. In other words, for any vector $$\vec v$$, after multiplying $$\vec v^\prime = M \vec v$$ (or `v2 = M.dot(v)`), the new vector $$\vec v^\prime$$ will be uniformly distributed over the sphere.