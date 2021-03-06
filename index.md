---
layout: title
title: About
permalink: /
---

## About Me

I am a software engineer in Cambridge, MA (next to Boston), currently working at [Datadog](https://datadoghq.com/). I work primarily on the metrics query system, a distributed system for aggregating large amounts of data at high volume and low latency.

Before that, I was a computational physicist at Yale University, studying a range of systems in the fields of biophysics and granular materials via computational models.

I am also an Open-Source enthusiast, and I maintain a few useful packages:

- [basic_allocator](https://docs.rs/basic_allocator) ([repo](https://github.com/wackywendell/basicalloc)): A simple memory allocator for Rust written in Rust, primarily for educational purposes.
- [Tess](http://tess.readthedocs.org/en/latest/)
  ([repo](https://github.com/wackywendell/tess)): Calculate 3D Voronoi tesselations in Python
- [Spack](http://spack.readthedocs.org/en/latest/)
  ([repo](https://github.com/wackywendell/spack)): Analyze packings of spheres
- [ParM](http://parm.lostinmyterminal.com/) ([repo](https://github.com/wackywendell/parm)): A
  feature-packed Molecular Dynamics simulation package, modularly built to support just about any
  MD simulation (2D or 3D). I have used it myself for jamming (packings of spheres), disordered
  protein simulations, and modeling bird nests. It is written in C++ and includes bindings for
  Python.

I have also contributed to many larger projects, including numpy, Rust, vapory, and others.

## About this Site

This site is statically generated using [Jekyll](http://jekyllrb.com/), using [Foundation
5](http://foundation.zurb.com/) for the frontend and hosted on [GitHub
Pages](https://pages.github.com/). Ideas and inspiration came from Jason Long's [Cayman theme](http://jasonlong.github.io/cayman-theme/) and [uigradients.com](http://uigradients.com/).

I also wrote a post on how I integrated
[Jekyll and Foundation]({% post_url 2015-05-30-jekyll-and-foundation %}) for this site.

## Posts

There are a few posts I think are especially useful:

- [Beautiful Plots in Python]({% post_url 2015-12-01-plotting %})
- [BASH and `getopts`]({% post_url 2015-02-06-getopts %})
- [Prepending and appending to your `$PATH`]({% post_url 2015-01-09-path-prepend %})
- [Using Sphinx for documentation]({% post_url 2015-03-09-sphinx-documentation %})

Or if you're in the mood for an interesting algorithm:

- [Packing Comparisons]({% post_url 2015-03-12-packing-comparisons %})

### List of All Posts

{% for post in site.posts %}

- {{ post.date | date: "%b %-d, %Y" }}: [{{ post.title }}]({{ post.url | prepend: site.baseurl }}){% endfor %}
