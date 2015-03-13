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

Now we want some pairing to compare the two, something like this:

|  number in A  |→|  number in B  |
|:-------------:|-|:-------------:|
|       1       |→|       5       |
|       2       |→|       2       |
|       3       |→|       4       |
|       4       |→|       1       |
|       5       |→|       3       |

### As an Image

![Packing-Example]({{ site.baseurl }}/assets/2015-03-12-packing-example-mapping.svg)

### The Question

How do we find that pairing such that we minimize the sum of distances?

### Mathematics

Let us define an *ordering tuple* to be a tuple $A:\left\\{ i\in A\forall i\in\left\\{ 1\ldots
N\right\\} \right\\} $. So $\left(1,2,3 \right)$ and $\left(3,1,2,4\right)$ are *ordering tuples*,
but $\left(3,1,2,3 \right)$ is not.

Now suppose we have two sets of points, $\vec r_i$ and $\vec s_i$, with $1 \le i \le N$.

We now want to find the *ordering tuple* $A$ that minimizes

$$
d^2 = \sum_{i=1}^N \left| \vec{r}_i - \vec{s}_{A_i} \right|
$$

## The Solution

### Step 1: Represent a Solution

A solution is an *ordering tuple*, which in code can just be a list. In 
